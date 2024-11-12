app.controller(
  "mysignalportfolioctrl",
  function ($scope, $http, $window, $location, config) {
    $scope.baseurl = config.baseurl;
    $scope.logout = function (req, res) {
      localStorage.clear();
      location.href = "index.html";
    };

    $scope.portfolioId = 1;
    $scope.init = function (req, res) {
      console.log("roboctrl");
      console.log(config.baseurl);
      var islogin = localStorage.getItem("islogin");

      if (islogin != "1") {
        location.href = "index.html";
      } else {
        $scope.portfoliolist();
        $scope.name = localStorage.getItem("name");
        $scope.customerId = localStorage.getItem("customerId");
        console.log($scope.customerId);
      }
    };

    $scope.portfoliolist = function (req, res) {
        $scope.customerId = localStorage.getItem("customerId");
        console.log( $scope.customerId)
        $scope.url = config.baseurl + "roboportfolio/getUserSignalPortfolio/" + $scope.customerId 
      $http
        .get($scope.url)
        .success(function (res) {
          if (res.status == "false") {
          } else {
            $scope.signalportfoliolist = res.data;
            console.log("dataset: ", $scope.signalportfoliolist);
            $("#portfoliolist").removeClass("ng-hide");
            
          }
        })
        .error(function () {});
    };

    $scope.portfoliodetails = function (id, portfolio_id, customer_id,portfolio_name) {
        
      
      console.log(id, portfolio_id, customer_id,portfolio_name) 
      localStorage.setItem("portfolio_name",portfolio_name );
      localStorage.setItem("signalportfolio_id",id );
      localStorage.setItem("category_id",portfolio_id );
    
    $window.location.href = 'signalportfolio_detail.html';



    };




   
   

  
 });
