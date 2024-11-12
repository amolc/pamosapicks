app.controller(
  "selectRobot",
  function ($scope, $http, $window, $location, config) {
    $scope.baseurl = config.baseurl;
    console.log(config);


    $scope.init = function (req, res) {

    };
    $scope.currentPage = 1; // Current page number
    $scope.itemsPerPage = 3; // Number of items per page


var islogin = localStorage.getItem("isCustomerlogin");
if (islogin != "1") {
  location.href = "login.html";
} 

$scope.customerName = localStorage.getItem("customerName");

  
    $scope.selectRobot = function (robot) {
      localStorage.setItem('robot', robot)
      location.href = "strategies.html";
    }
    $scope.logout = function (req, res) {
      localStorage.clear();
      location.href = "index.html";
    };
  }
);
