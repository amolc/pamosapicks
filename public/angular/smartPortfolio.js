app.directive("sparklinechart", function () {
  return {
    restrict: "E",
    scope: {
        data: "="
    },
    compile: function (tElement, tAttrs, transclude) {
      return function (scope, element, attrs) {
        attrs.$observe("data", function (newValue) {
          newValue = newValue.replace("[", "");
          newValue = newValue.replace("]", "");
          var array = newValue.split(",");

          // Custom tooltip formatter function
          var tooltipFormatter = function (sparkline, options, fields) {
            var value = fields.y;
            var background = "#143443";
            return (
              '<span style="background-color: ' +
              background +
              '; color: #fff; padding: 5px; border-radius: 5px;">' +
              value +
              "</span>"
            );
          };

          element.sparkline(array, {
            type: "line",
            width: "96%",
            height: "100px",
            lineWidth: 2,
            changeRangeMin: -10,
            chartRangeMax: 10,
            lineColor: "red",
            fillColor: "false",
            tooltipFormatter: tooltipFormatter,
          });
        });
      };
    },
  };
});


app.controller(
  "smartPortfolio",
  function ($scope, $http, $window, $location, config) {
    $scope.baseurl = config.baseurl;
    console.log(config);

    $scope.init = function (req, res) {
      console.log("smartPortfolio");
      console.log(config.baseurl);

      $scope.brokerData();
    };

    $scope.customerName = localStorage.getItem("customerName");
    $scope.strategy_name = localStorage.getItem("strategy_name");
    $scope.robot = localStorage.getItem("robot");
    $scope.validateportfolio = 0;
    $scope.validateInvestment = 0;
    $scope.validateBroker = 0;
    
    $scope.message = "";

    var islogin = localStorage.getItem("isCustomerlogin");
    if (islogin != "1") {
      location.href = "login.html";
    } 

    $scope.portfolio_name =  localStorage.getItem("portfolio_name")
    $scope.data = data = {
      investamount: 10000, 
      userPortfolioName: $scope.portfolio_name +'-'+ $scope.customerName
    }
    
    $scope.brokerData = function (req, res) {
      $http
        .get($scope.baseurl + "modelportfolio/get-all-brokers/")
        .success(function (res) {
          if (res.status == "error") {
          } else {
 
            $scope.brokers = res.data;
            

          }
        })
        .error(function () {});
    };

    $scope.goToPortfolioPage = function (data) {

      if ($scope.data.userPortfolioName == '' || $scope.data.userPortfolioName == undefined) {
        $scope.validateportfolio = 1;
        $scope.message = "Portfolio Name should not be empty";
      }
      else if ($scope.data.investamount == '' || $scope.data.investamount == undefined) {
        $scope.validateInvestment = 1;
        $scope.message = "Investment should not be empty";
      }

      else if ($scope.data.robot == '' || $scope.data.robot == undefined) {
        $scope.validateBroker = 1;
        $scope.message = "Select any one Broker";
      }
      else {
        $scope.imLoading = true
        localStorage.setItem("robot", $scope.data.robot);
        $scope.data.portfolioId = localStorage.getItem("portfolioId");
        $scope.data.portfolio_name = localStorage.getItem("portfolio_name");
        $scope.data.user_portfolio_name = $scope.data.userPortfolioName
        $scope.data.email = localStorage.getItem("customerEmail");
        $scope.data.phone = localStorage.getItem("CustomerPhone");
        $scope.data.customerName = localStorage.getItem("customerName");
        $scope.data.customer_id = localStorage.getItem("customer_Id");
        
          if ($scope.data.robot == 'ig') {
            var portfolioUrl = "stockdata/saveigrobotportfolio"
          }
          else if ($scope.data.robot == 'alpaca') {
            var portfolioUrl = "stockdata/savealpacarobotportfolio"
          }
    
          else if ($scope.data.robot == 'demo') {
            var portfolioUrl = "stockdata/savedemoportfolio"
          }
          else if ($scope.data.robot == 'cttrade' || $scope.data.robot == 'aliceblue' || $scope.data.robot == 'limetrader') {
            var portfolioUrl = "stockdata/saverobotportfolio/"
          }

          var urlconfig = {
            headers: {
              "Content-Type": "application/json;",
            },
          };
    
        $http
          .post(
            $scope.baseurl + portfolioUrl,
            $scope.data,
            urlconfig
          )
          .success(function (response, status, headers, config) {
            $scope.msg = response.msg;
            $scope.data = response.data;
            console.log(response.data);
            $scope.imLoading = false;
            location.href = "/robot-congrats.html";
    
          })
          .error(function (data, status, header, config) {
            $scope.imLoading = false;
            alert(data.data)
            console.log(data);
            
            $("#getportfolio-issue").modal("show");
          });

    }
  };


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




  }
);
