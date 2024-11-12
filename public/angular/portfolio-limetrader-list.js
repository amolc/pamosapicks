

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
    
    $scope.name = localStorage.getItem("customerName");

    
    $scope.portfolioList = function (req, res) {
      var email= localStorage.getItem("customerEmail");
      $http
        .get($scope.baseurl + `stockdata/get-customer-portfolios/?email=${email}&robot=limetrader`)
        .success(function (res) {
          if (res.status == "false") {
          } else {
            
            $scope.mangoes = res;
            $scope.dataset = $scope.mangoes.data;
            console.log("----$scope.dataset---", $scope.dataset);
          }
        })
        .error(function (data, status, header, config) {
           console.log(data)
         });
    };

    $scope.goToPortfolioPage = function (portfolioId) {
      var portfolioUrl = "portfolio-limetrader-transaction.html?id=" + portfolioId;
      location.href = portfolioUrl;
    };
    $scope.login = function (req, res) {
      location.href = "/login.html";
    };

    $scope.logout = function (req, res) {
      localStorage.clear();
      location.href = "index.html";
    };

    $scope.onedit = function (custID,PortID) {
      localStorage.setItem("custID",custID );
      localStorage.setItem("PortID",PortID );
      location.href = "ig-portfolio-edit.html";
    };



  $scope.confirmDelete = function (customer_id, portfolio_id) {
    $scope.portfolio_id =  portfolio_id

     $("#modal-small").modal("show");
  };
  
  $scope.deleteSubmit = function () {

    var data = {}

    var id = $scope.portfolio_id 
    
    var urlconfig = {
      headers: {
        "Content-Type": "application/json;",
      },
    };
    $http.delete(config.baseurl + `stockdata/delete-portfolio/?portfolio_id=${id}&robot=aliceblue`)
        .success(function(res) {
            if (res.status == 'false') {
            } else {
                $scope.response = res.data;
                console.log('data: ', $scope.response);
                $("#closeOpenPositionMdl").modal("hide");
                $scope.portfolioList()
            }
            
        }).error(function(res) {
          console.log('data: ', res);
        });
  };

  

  }
);


