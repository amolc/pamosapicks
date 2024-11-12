app.controller(
  "loginCtrl",
  function ($scope, $http, $window, $location, config) {
    $scope.baseurl = config.baseurl;
    console.log(config);

    //for validation
    $scope.validateemail = 0;
    $scope.validatepassword = 0;
    $scope.message = "";

    $scope.init = function (req, res) {
      console.log("portfolioDetail");
      console.log(config.baseurl);
      var islogin = localStorage.getItem("islogin");

      if (islogin == '1'){
        $window.location = "/app/my-portfolio-list.html";
      }

     
    };
    $scope.currentPage = 1; // Current page number
    $scope.itemsPerPage = 3; // Number of items per page

    var vm = this;
    $scope.baseurl = config.baseurl;

    vm.loginvalidate = function (data) {
      console.log(data);
      if (data["email"] == "") {
        $scope.message = "Please provide an email address.";
        $scope.validateemail = "1";
        return false;
      } else if (data["password"] == "") {
        $scope.message = "Please provide password.";
        $scope.validatepassword = "1";
        return false;
      } else {
        var confirm = 1;
        return confirm;
      }
    };

    $scope.login = function (req, res) {
      console.log($scope.data);
      $scope.formvalidate = vm.loginvalidate($scope.data);
      if ($scope.formvalidate == 1) {
        console.log($scope.data);

        var config = {
          headers: {
            "Content-Type": "application/json;",
            "Access-Control-Allow-Origin": "*",
          },
        };
        console.log("this is before post");
        console.log($scope.baseurl);
        console.log($scope.data);
        $scope.url = $scope.baseurl + "customer/login";
        console.log($scope.url);
        $http
          .post($scope.url, $scope.data)
          .success(function (response, status, headers, config) {
            if (response.status === "passworderror") {
              $scope.message = response.msg;
              $scope.validatepassword = "1";
              console.log($scope.message);
            } else if (response.status === "emailerror") {
              $scope.message = response.msg;
              $scope.validateemail = "1";
              console.log($scope.message);

            } else if (response.data.isStaff == false) {
              $scope.message = "You dont have permission of staff";
              $scope.validatepassword = "1";
              console.log($scope.message);
            } else {
              console.log(response.data);
              // debugger
              localStorage.setItem("islogin", "1"); // setting
              localStorage.setItem("name", response.data.name);
              localStorage.setItem("email", response.data.email);
              localStorage.setItem("phone", response.data.phone);
              localStorage.setItem("customerId", response.data.id);
              localStorage.setItem("org_id", response.data.org_id);
              localStorage.setItem("isStaff", response.data.isStaff);
              $window.location = "/app/my-portfolio-list.html";
            }
          })
          .error(function (response, status, header) {
            $scope.ResponseDetails =
              "response: " +
              response +
              "<hr />status: " +
              status +
              "<hr />headers: " +
              header +
              "<hr />config: " +
              config;

            console.log(response);
          });
      } else {
        console.log("Resolve validation error");
      }
    };

    $scope.register = function (req, res) {
      location.href = "/app/register.html";
    };
    $scope.forget = function (req, res) {
      location.href = "/app/forgot-password.html";
    };

    $scope.logout = function (req, res) {
      localStorage.clear();
      location.href = "my-portfolio-list.html";
    };
  }
);


// app.controller("loginCtrl", function ($scope, $http, $window, $location, config) {
//   $scope.baseurl = config.baseurl;
//   console.log(config)

//   // Initialize the validation variables
//   $scope.validateemail = 0;
//   $scope.validatepassword = 0;
//   $scope.message = "";

//   $scope.init = function (req, res) {
//     console.log("portfolioDetail");
//     console.log(config.baseurl);
//     var islogin = localStorage.getItem("islogin");

//     $scope.portfolioList();
//     $scope.portfolioStockList();
//     $scope.getUserPortfolioDetail();
//   };

//   $scope.currentPage = 1; // Current page number
//   $scope.itemsPerPage = 3; // Number of items per page

//   vm.loginvalidate = function () {
//     $scope.validateemail = 0;
//     $scope.validatepassword = 0;
//     $scope.message = "";

//     if (!$scope.data || !$scope.data.email) {
//       $scope.message = "Please provide an email address.";
//       $scope.validateemail = 1;
//       return false;
//     } else if (!$scope.data.password) {
//       $scope.message = "Please provide a password.";
//       $scope.validatepassword = 1;
//       return false;
//     }

//     return true;
//   };

//   $scope.login = function () {
//     $scope.formvalidate = $scope.loginvalidate();

//     if ($scope.formvalidate) {
//       var config = {
//         headers: {
//           "Content-Type": "application/json",
//           "Access-Control-Allow-Origin": "*",
//         },
//       };

//       $scope.url = $scope.baseurl + "customer/login";

//       $http
//         .post($scope.url, $scope.data, config)
//         .then(
//           function (response) {
//             if (response.data.status === "passworderror") {
//               $scope.message = response.data.msg;
//               $scope.validatepassword = 1;
//             } else if (response.data.status === "emailerror") {
//               $scope.message = response.data.msg;
//               $scope.validateemail = 1;
//             } else {
//               // Login successful
//               localStorage.setItem("islogin", "1");
//               localStorage.setItem("name", response.data.name);
//               localStorage.setItem("email", response.data.email);
//               localStorage.setItem("phone", response.data.phone);

//               localStorage.setItem("customerId", response.data.id);
//               localStorage.setItem("org_id", response.data.org_id);
//               localStorage.setItem("isStaff", response.data.isStaff);

//               $window.location.href = "/app";
//             }
//           },
//           function (error) {
//             $scope.message = "Error during login. Please try again.";
//           }
//         );
//     } else {
//       console.log("Resolve validation error");
//     }
//   };

//   $scope.register = function () {
//     $window.location.href = "/app/register.html";
//   };

//   $scope.forget = function () {
//     $window.location.href = "/app/forget.html";
//   };

//   $scope.logout = function () {
//     localStorage.clear();
//     $window.location.href = "index.html";
//   };
// });
