

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
        .post($scope.baseurl + "stockdata/igportfolio",data)
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
      var portfolioUrl = "portfolio-ig-transaction.html?id=" + portfolioId;
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
      debugger;
      localStorage.setItem("custID",custID );
      localStorage.setItem("PortID",PortID );
      location.href = "ig-portfolio-edit.html";
    };

    $scope.ondelete = function (custID,id) {
      if (confirm("Are you sure to delete??")) {
        
      var urlconfig = {
        headers: {
          "Content-Type": "application/json;",
        },
      };
      $http.delete(config.baseurl + `stockdata/delete-portfolio/?portfolio_id=${id}&robot=ig`)
          .success(function(res) {
              if (res.status == 'false') {
              } else {
                  $scope.response = res.data;
                  console.log('data: ', $scope.response);
              }
          }).error(function(res) {
            console.log('data: ', res);
          });

      location.href = "ig-portfolio.html";
    };
  }

  }
);


  $scope.addstock_modal = function ( stockdataId,modelportfolioId, portfolio_name, capital) {
    console.log("show_add_stock_modal");
    $("#addstock").modal("show");
    var data = {}
  
    var urlconfig = {
      headers: {
        "Content-Type": "application/json;"
      },
    };

    
  $scope.addstock = {}
  $scope.addstock.modelportfolio_id = modelportfolioId ;
  $scope.addstock.capital = capital ;
  $scope.addstock.stockdataId = stockdataId ;
  $scope.addstock.modelportfolio_name = portfolio_name ;
  


  console.log("......",$scope.addstock)
  
  // $scope.url = $scope.baseurl + "stockdata/portfolio/" + stockdataId +"/" ;
  $scope.url = $scope.baseurl + "stockdata/" ;
  console.log($scope.url,".....")


  $http.get( $scope.url , data, urlconfig)
          .success(function (response, status, headers, config) {
            console.log("...sucess")
            $scope.stockdata_list = response.data ;
            console.log($scope.stockdata_list,"...") ;
            $("#addstock").modal("show");
        })
        .error(function (response, status, header, config) {
          
          console.log("...fail")
            console.log(response);
            $scope.errormsg = "We were not able to get the stockdata. Please try again after some time.";
            $("#stockdata-issue").modal('show');
        });
    
  };
