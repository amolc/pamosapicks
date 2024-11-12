app.controller('chartCtrl', function ($scope, $http, $window, $location, $interval, config) {

  $scope.baseurl = config.baseurl;


  const urlParams = new URLSearchParams($window.location.search);
  const stock = urlParams.get('stock');
  console.log(stock);
  var stockdata = stock.toUpperCase();

  console.log(stockdata);


  $scope.logout = function (req, res) {
    localStorage.clear();
    location.href = "index.html";
  };

  $scope.init = function (req, res) {
    console.log("brokerCtrl");
    console.log(config.baseurl);
    var islogin = localStorage.getItem("islogin");

    if (islogin != "1") {
      location.href = "index.html";
    } else {
      $scope.customerId = localStorage.getItem("customerId");
      $("#menu").load("menu-admin.html"); 
      // $("#menu").load("menu.html"); 
      $("#general").addClass("active"); 
      $("#modelcategory").addClass("active"); 

      $scope.name = localStorage.getItem("name");
     
     

    }

  }

  
});