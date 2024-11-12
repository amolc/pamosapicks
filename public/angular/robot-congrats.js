app.controller(
  "congrats",
  function ($scope, $http, $window, $location, config) {
    $scope.baseurl = config.baseurl;
    console.log(config);

    $scope.init = function (req, res) {
      console.log("portfolioDetail");
      console.log(config.baseurl);
      var islogin = localStorage.getItem("isCustomerlogin");
      if (islogin != "1") {
        location.href = "login.html";
      } 

      // $scope.portfolioList();
      // $scope.portfolioStockList();
      // $scope.getUserPortfolioDetail();
    };
    $scope.currentPage = 1; // Current page number
    $scope.itemsPerPage = 3; // Number of items per page
    $scope.name = localStorage.getItem('customerName');

    var vm = this;
    $scope.baseurl = config.baseurl;


  


    $scope.homepage = function(req, res) {
      var robot = localStorage.getItem("robot");
      if (robot == 'ig'){
        location.href = "portfolio-list.html";
      } else if (robot == 'alpaca'){
        location.href = "alpaca-portfolio.html";
      } else if (robot == 'demo'){
        location.href = "portfolio-demo-list.html";
      } else if (robot == 'cttrade'){
        location.href = "portfolio-cttrade-list.html";
      } else if (robot == 'aliceblue'){
        location.href = "portfolio-aliceblue-list.html";
      }
    }

    $scope.logout = function (req, res) {
      localStorage.clear();
      location.href = "login.html";
    };
  }
);
