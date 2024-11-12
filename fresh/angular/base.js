app.controller(
  "base",
  function ($scope, $http, $window, $location, config) {
    $scope.baseurl = config.baseurl;
    console.log(config);

    $scope.init = function (req, res) {
      $("#footermodals").load("footer.html");
      $("#menumodals").load("menu.html");
      console.log(config.baseurl);
      var islogin = localStorage.getItem("islogin");
      
      
     
     
    };
    $scope.currentPage = 1; // Current page number
    $scope.itemsPerPage = 3; // Number of items per page
    $scope.name = localStorage.getItem('name');

    var vm = this;
    $scope.baseurl = config.baseurl;

    

    $scope.logout = function (req, res) {
      localStorage.clear();
      location.href = "login.html";
    };

    $scope.login = function (req, res) {
      location.href = "/app/login.html";
    };
  }
);
