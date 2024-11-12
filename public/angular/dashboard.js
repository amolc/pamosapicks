app.controller(
  "dashboard",
  function ($scope, $http, $window, $location, config) {
    $scope.baseurl = config.baseurl;
    console.log(config);


    $scope.init = function (req, res) {
      $scope.dashboardPortfolios()
    };

    $scope.dataset = {}
var islogin = localStorage.getItem("isCustomerlogin");
if (islogin != "1") {
  location.href = "login.html";
} 

$scope.customerName = localStorage.getItem("customerName");
$scope.customer_Id = localStorage.getItem("customer_Id");

  
    $scope.selectRobot = function (robot) {
      localStorage.setItem('robot', robot)
      location.href = "strategies.html";
    }
    $scope.logout = function (req, res) {
      localStorage.clear();
      location.href = "index.html";
    };


        
    $scope.dashboardPortfolios = function() {
      $scope.imLoading = true;
        var urlconfig = {
          headers: {
            "Content-Type": "application/json;",
          },
        };
        $http
        .get(
          ($scope.url =
            config.baseurl + `stockdata/get-dashboard-portfolios/?customer_id=${$scope.customer_Id}`),
          urlconfig
        )
        .success(function (response, status, headers, config) {
          $scope.dataset =  response.data
          // $scope.demoPortfolio = response.data
        console.log(response, "===response===");
 
          $scope.imLoading = false;
        })
        .error(function (data, status, header, config) {
          $scope.imLoading = false;
          console.log(data.data);
        });

      }


  }
);
