app.controller(
  "indexCtrl",
  function ($scope, $http, $window, $location, config) {
    $scope.baseurl = config.baseurl;
    console.log(config);



    $scope.init = function (req, res) {
      $scope.getportfoliostratiges()
     
    };


    $scope.baseurl = config.baseurl;

    $scope.getportfoliostratiges= function() {
      $scope.imLoading = true
    
        var urlconfig = {
            headers: {
              "Content-Type": "application/json;"
            },
          };
          
    
          $http
            .get( $scope.baseurl + "modelportfolio/get-all-strategy-portfolio/"  , urlconfig)
            .success(function (data, status, headers, config) {
              console.log("++++data++++++", data)
              $scope.portfolioStrategy = data.data ;
              $scope.imLoading = false
    
            })
            .error(function (data, status, header, config) {
              console.log(data);
              $scope.imLoading = false
            });
    
    }
    

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
