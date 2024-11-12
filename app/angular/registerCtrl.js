
app.controller(
  "registerCtrl",
  function ($scope, $http, $window, $location, config) {
    $scope.baseurl = config.baseurl;
    $scope.showPassword = false;
    console.log(config);

    $scope.init = function (req, res) {
      console.log("portfolioDetail");
      console.log(config.baseurl);
      var islogin = localStorage.getItem("islogin");

      $scope.portfolioList();
      $scope.portfolioStockList();
      $scope.getUserPortfolioDetail();
    };
    $scope.currentPage = 1; // Current page number
    $scope.itemsPerPage = 3; // Number of items per page
    
    var vm = this;
    vm.signupvalidate = function(data) {
      console.log(data['useragreement'])
        if (data['name'] == "" || (data['name'] === undefined)) {
            console.log(data['name']);
            $scope.message = "Please provide a name."
            console.log(  $scope.message);
            $scope.validatename = "1";
            return false;

        } else if (data['email'] == "" || (data['email'] === undefined)) {
            $scope.message = "Please provide an email address."
                console.log(  $scope.message);
            $scope.validateemail = "1";
            return false;
        }
          else if (data['phone'] == "" || (data['phone'] === undefined)) {
            $scope.message = "Please provide a phone number."
                console.log(  $scope.message);
            $scope.validatephone = "1";
            return false;
        }
        else if (data['password'] == "" || (data['password'] === undefined)) {
            $scope.message = "Please provide password."
                console.log(  $scope.message);
            $scope.validatepassword = "1";
            return false;
        }
        else if (data['useragreement'] == false || (data['useragreement'] === undefined)) {
            $scope.message = "Please confirm the agreement."
                console.log(  $scope.message);
            $scope.validateuseragreement= "1";
            return false;
        }
        else {
            var confirm = 1
            return confirm;
        }

    }

    // $scope.customersignup = function (req, res) {
    //   // console.log($scope.data);
    //   $scope.formvalidate = vm.signupvalidate($scope.data);
    //   // console.log($scope.formvalidate);
    //   if ($scope.formvalidate == 1) {
    //     // console.log($scope.data);

    //     var config = {
    //       headers: {
    //         "Content-Type": "application/json;",
    //         "Access-Control-Allow-Origin": "*",
    //       },
    //     };
    //     console.log("this is before post");
    //     // console.log($scope.baseurl);
    //     // console.log($scope.data);
    //     $http
    //       .post($scope.baseurl + "customer/sign-up", $scope.data)
    //       .success(function (response, status, headers, config) {
    //         console.log("Successful");
    //         console.log(response);

    //         // $window.location = "login.html";
    //         if (response.status == "error") {
    //           $scope.msg = response.data;
    //           $scope.error = "1"
    //           $("#error").modal("show");
    //         } else if (response.status == "success") {
    //           $scope.msg = response.data;
    //           $("#success").modal("show");
    //           $window.location = "/";
    //         }
    //         // web\admin\index.html
    //       })
    //       .error(function (response, status, header) {
    //         $scope.ResponseDetails =
    //           "response: " +
    //           response +
    //           "<hr />status: " +
    //           status +
    //           "<hr />headers: " +
    //           header +
    //           "<hr />config: " +
    //           config;

    //         // console.log(response);
    //       });
    //   } else {
    //     console.log("Resolve validation error");
    //   }
    // };






    $scope.data = {};
    $scope.customersignup = function () {
        $scope.formvalidate = vm.signupvalidate($scope.data);
    
        if ($scope.formvalidate == 1) {
            var config = {
                headers: {
                    "Content-Type": "application/json",
                    "Access-Control-Allow-Origin": "*",
                },
            };
    
            $http.post($scope.baseurl + "customer/sign-up", $scope.data)
                .then(function (response) {
                    if (response.data.status === "error") {
                        $scope.msg = "Registration failed:" + response.data.data;
                        $scope.showErrorModal();
                    } else if (response.data.status === "success") {
                        $scope.msg = "<span style='color: green; font-weight: bold;'>Registration successful:</span> " + response.data.data;
                        $scope.showSuccessModal(); 
                        $window.location = "/app/login.html";
                    }
                })
                .catch(function (error) {
                    $scope.msg = "An error occurred during registration.";
                    $scope.showErrorModal(); 
                    console.log("Error:", error);
                });
        } else {
            console.log("Resolve validation error");
        }
    };
    
     // Function to show the success modal
     $scope.showSuccessModal = function () {
        $("#successModal").modal("show");
    };

    // Function to show the error modal
    $scope.showErrorModal = function () {
        $("#errorModal").modal("show");
    };
  
    // $scope.customersignup = function () {
    //     $scope.formvalidate = vm.signupvalidate($scope.data);

    //     if ($scope.formvalidate == 1) {
    //         var config = {
    //             headers: {
    //                 "Content-Type": "application/json",
    //                 "Access-Control-Allow-Origin": "*",
    //             },
    //         };

    //         $http.post($scope.baseurl + "customer/sign-up", $scope.data)
    //             .then(function (response) {
    //                 console.log("Successful");
    //                 console.log(response.data);

    //                 if (response.data.status === "error") {
    //                     $scope.msg = response.data.data;
    //                     $scope.error = "1";
    //                     $("#error").modal("show");
    //                 } else if (response.data.status === "success") {
    //                     $scope.msg = response.data.data;
    //                     $("#success").modal("show");
    //                     $window.location = "/";
    //                 }
    //             })
    //             .catch(function (error) {
    //                 $scope.ResponseDetails =
    //                     "response: " + error.data +
    //                     "<hr />status: " + error.status +
    //                     "<hr />headers: " + error.headers +
    //                     "<hr />config: " + error.config;

    //                 console.log(error);
    //             });
    //     } else {
    //         console.log("Resolve validation error");
    //     }
    // };

    $scope.togglePasswordVisibility = function () {
        $scope.showPassword = !$scope.showPassword;
        var passwordInput = document.querySelector('.password-input input');
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
        } else {
            passwordInput.type = 'password';
        }
    };

    $scope.login = function (req, res) {
      location.href = "/app/login.html";
    };

    $scope.logout = function (req, res) {
      localStorage.clear();
      location.href = "index.html";
    };
  }
);
