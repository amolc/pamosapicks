

app.controller(
  "smartPortfolio",
  function ($scope, $http, $window, $location, config) {
    $scope.baseurl = config.baseurl;
    console.log(config);

    $scope.init = function (req, res) {
      console.log("smartPortfolio");
      console.log(config.baseurl);
      

      $scope.portfolioList();
    };
    
    $scope.name = localStorage.getItem("name");

    

    $scope.portfolioList = function (req, res) {
      data = {}
      data['customerId'] = localStorage.getItem("customerId");
      
      $http
        .post($scope.baseurl + "stockdata/alpacaportfolio",data)
        .success(function (res) {
          if (res.status == "false") {
          } else {
            
            $scope.mangoes = res;
            console.log(res.data, "======");
            $scope.dataset = $scope.mangoes.data;
          }
        })
        .error(function (data, status, header, config) {
           console.log(data)
         });
    };

    $scope.goToPortfolioPage = function (portfolioId) {
      var portfolioUrl = "portfolio-alpaca.html?id=" + portfolioId;
      location.href = portfolioUrl;
    };
    $scope.login = function (req, res) {
      location.href = "/app/login.html";
    };

    $scope.logout = function (req, res) {
      localStorage.clear();
      location.href = "index.html";
    };

    $scope.onedit = function (custID,PortID) {
      localStorage.setItem("custID",custID );
      localStorage.setItem("PortID",PortID );
      location.href = "alpaca-portfolio-edit.html";
    };

    $scope.ondelete = function (custID,PortID) {
      if (confirm("Are you sure to delete??")) {
        
      var urlconfig = {
        headers: {
          "Content-Type": "application/json;",
        },
      };
      $http.delete(config.baseurl + `stockdata/delete-portfolio/?portfolio_id=${PortID}&robot=alpaca`)
          .success(function(res) {
              if (res.status == 'false') {
              } else {
                  $scope.response = res.data;
                  console.log('data: ', $scope.response);
              }
          }).error(function() {
          });

      location.href = "alpaca-portfolio.html";
    };
  }

  }
);
