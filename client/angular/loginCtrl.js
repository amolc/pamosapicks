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

     
    };
    $scope.currentPage = 1; // Current page number
    $scope.itemsPerPage = 3; // Number of items per page

    var vm = this;
    $scope.baseurl = config.baseurl;

    vm.loginvalidate = function (data) {
      console.log(data, "====");
      if (data == '' || data == undefined){
        $scope.message = "Please provide a email address.";
        $scope.validateemail = "1";

      }
      // Check if the email field is empty
      if (!data.email) {
        $scope.message = "Please provide an valid email address.";
        $scope.validateemail = "1";
        return false;
      }
    
      // Define a regex pattern for validating email format
      const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    
      // Check if the email provided matches the pattern
      if (!emailPattern.test(data.email)) {
        $scope.message = "Please provide a valid email address.";
        $scope.validateemail = "1";
        return false;
      }
    
      // Check if the password field is empty
      if (!data.password) {
        $scope.message = "Please provide password.";
        $scope.validatepassword = "1";
        return false;
      }
    
      // Validation passed
      return true;
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
            } else if (response.data.isCustomer == false) {
              $scope.message = "User not found";
              $scope.validatepassword = "1";
              console.log($scope.message);
            } else {
              console.log(response.data);
              localStorage.setItem("isCustomerlogin", "1"); // setting
              localStorage.setItem("customerName", response.data.name);
              localStorage.setItem("customerEmail", response.data.email);
              localStorage.setItem("CustomerPhone", response.data.phone);
              localStorage.setItem("adminId", 112);
              localStorage.setItem("customer_Id", response.data.id);
              localStorage.setItem("org_id", response.data.org_id);
              if (response.data.isCustomer == true) {
                $window.location = `dashboard.html`;
              }
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

    $scope.removeValidation = function (type) {
      if (type == 2) {
        $scope.validatepassword = 0;
        $scope.message = '';
      } else if (type == 1) {
        $scope.validateemail = 0;
        $scope.message = '';
      }
    };

    $scope.register = function (req, res) {
      location.href = "../register.html";
    };


    $scope.forget = function (req, res) {
      location.href = "/app/forget.html";
    };

    $scope.logout = function (req, res) {
      localStorage.clear();
      location.href = "index.html";
    };
  }
);


