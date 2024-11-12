app.controller(
  "strategies",
  function ($scope, $http, $window, $location, config) {
    $scope.baseurl = config.baseurl;
    console.log(config);


    $scope.init = function (req, res) {

      $scope.getportfoliostratiges();
    };
    $scope.currentPage = 1; // Current page number
    $scope.itemsPerPage = 3; // Number of items per page


var islogin = localStorage.getItem("isCustomerlogin");
if (islogin != "1") {
  location.href = "login.html";
} 

$scope.customerName = localStorage.getItem("customerName");


  
    $scope.goToRobotSelection = function (portfolioId, portfolio_name) {
      debugger;
      $scope.imLoading = true;

      $scope.data = {}

      localStorage.setItem("portfolioId", portfolioId);
      localStorage.setItem("portfolio_name", portfolio_name);
      
      location.href = "smart-portfolio.html";
    
    //   // $scope.data.robot = localStorage.getItem("robot");
    //   $scope.data.investamount = localStorage.getItem("investamount");
    //   $scope.data.user_portfolio_name = localStorage.getItem("userPortfolioName");
    //   $scope.data.email = localStorage.getItem("customerEmail");
    //   $scope.data.phone = localStorage.getItem("CustomerPhone");
    //   $scope.data.customerName = localStorage.getItem("customerName");
    //   $scope.data.customer_id = localStorage.getItem("customer_Id");
      
    //   if ($scope.data.robot == 'ig') {
    //     var portfolioUrl = "stockdata/saveigrobotportfolio"
    //   }
    //   else if ($scope.data.robot == 'alpaca') {
    //     var portfolioUrl = "stockdata/savealpacarobotportfolio"
    //   }

    //   else if ($scope.data.robot == 'demo') {
    //     var portfolioUrl = "stockdata/savedemoportfolio"
    //   }
    //   var urlconfig = {
    //     headers: {
    //       "Content-Type": "application/json;",
    //     },
    //   };

    // $http
    //   .post(
    //     $scope.baseurl + portfolioUrl,
    //     $scope.data,
    //     urlconfig
    //   )
    //   .success(function (response, status, headers, config) {
        
    //     $scope.msg = response.msg;
    //     $scope.data = response.data;
    //     console.log(response.data);
    //     $scope.imLoading = false;
    //     location.href = "/robot-congrats.html";

    //   })
    //   .error(function (data, status, header, config) {
    //     $scope.imLoading = false;
    //     alert(data.data)
    //     console.log(data);
        
    //     $("#getportfolio-issue").modal("show");
    //   });
      
    }
    $scope.logout = function (req, res) {
      localStorage.clear();
      location.href = "index.html";
    };

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
