app.controller(
  "smartPortfolio",
  function ($scope, $http, $window, $location, config) {
    $scope.baseurl = config.baseurl;
    console.log(config);

    $scope.init = function (req, res) {
      console.log("smartPortfolio");
      console.log(config.baseurl);

      $scope.getallplans();
    };

    $scope.customerName = localStorage.getItem("customerName");
    $scope.strategy_name = localStorage.getItem("strategy_name");
    $scope.robot = localStorage.getItem("robot");
    $scope.validateportfolio = 0;
    $scope.validateInvestment = 0;
    $scope.validateBroker = 0;
    
    $scope.message = "";




    var searchParams = new URLSearchParams($window.location.search);
    $scope.portfolio_id  = searchParams.get("id");


    $scope.getallplans = function() {
      $scope.imLoading = true
    
        var urlconfig = {
            headers: {
              "Content-Type": "application/json;"
            },
          };
          
    
          $http
            .get( $scope.baseurl + `customer/get-contactus-plans/?portfolio_id=${$scope.portfolio_id}`  , urlconfig)
            .success(function (data, status, headers, config) {
              console.log("++++data++++++", data)
              $scope.portfolioDetails = data.data
              console.log("++++portfolioDetails++++++", $scope.portfolioDetails )
              $scope.imLoading = false
    
            })
            .error(function (data, status, header, config) {
              console.log(data);
              $scope.imLoading = false
            });
    
    }
    


    $scope.logout = function (req, res) {
      localStorage.clear();
      location.href = "index.html";
    };

    $scope.removeValidation = function (input) {

      if (input == 1) {
        $scope.validateportfolio = 0;
      }
      else if (input == 2){
        $scope.validateInvestment = 0;
      }
      else if (input == 3){
        $scope.validateBroker = 0;
      }
      $scope.message = '';
    };


    $scope.updatePlanId = function (plan_id) {
      $scope.plan_id = plan_id
    }

    $scope.onaddAPISubmit = function (data) {
      $scope.imLoading = true
      data['org_id'] = 1
      data['portfolio_id'] = $scope.portfolio_id
      data['plan_id'] = $scope.plan_id
        var urlconfig = {
          headers: {
            "Content-Type": "application/json;",
          },
        };
        $http
          .post(
            ($scope.url =
              config.baseurl + `customer/post-contactus-customer/`),
              data,
            urlconfig
          )
          .success(function (response, status, headers, config) {
            $scope.imLoading = false
            
              location.href = `contact-us.html?id=${$scope.portfolio_id}`
            
            
          })
          .error(function (data, status, header, config) {
            alert(data.data)
            $scope.imLoading = false
            $("#addAPIModal").modal('hide')
            console.log(data);
          });
        
  }




  }
);
