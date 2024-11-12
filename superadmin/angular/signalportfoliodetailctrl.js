app.controller(
  "signalportfoliodetailctrl",
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
       
        $scope.name = localStorage.getItem("name");
        $scope.customer_id = localStorage.getItem("customer_id");
        $scope.portfolio_name =  localStorage.getItem("portfolio_name");
        $scope.signalportfolio_id =  localStorage.getItem("signalportfolio_id");

        var data = {}
        data.signalportfolio_id =  $scope.signalportfolio_id ;
      
  
        console.log(data);
          var urlconfig = {
              headers: {
                "Content-Type": "application/json;"
              },
            };
            $http
              .post( $scope.baseurl + "roboportfolio/getUserSignalPortfolioDetail  ", data, urlconfig)
              .success(function (response, status, headers, config) {
                $scope.mysignalportfolio = response.data ;
                console.log($scope.myportfolio);

                $scope.getportfolio($scope.mysignalportfolio.id);
              })
              .error(function (errorresponse, status, header, config) {
                console.log(errorresponse);
              });

      }
    
    }

    $scope.getportfolio = function(signalportfolio_id) {
      var data = {}
      data.signalportfolio_id = signalportfolio_id ;
    
      console.log(data);
        var urlconfig = {
            headers: {
              "Content-Type": "application/json;"
            },
          };
    
          $http
            .post( $scope.baseurl + "roboportfolio/getSignalPortfoliostocks" , data, urlconfig)
            .success(function (data, status, headers, config) {
              $scope.dataset = data.data ;
              console.log($scope.dataset)
              
            })
            .error(function (data, status, header, config) {
              console.log(data);
              $("#getportfolio-issue").modal('show');
            });
    
    }

    $scope.show_add_stock_modal = function (customerId, myportfolioId, portfolioId,capital,broker) {
      console.log("show_add_stock_modal");
      var data = {}
      var urlconfig = {
        headers: {
          "Content-Type": "application/json;"
        },
      };

      
    $scope.addstock = {}
    $scope.addstock.customerId = customerId ;
    $scope.addstock.myportfolioId = myportfolioId ;
    $scope.addstock.portfolioId = portfolioId ;
    $scope.addstock.capital = capital ;
    $scope.addstock.broker = broker ;
    
    $scope.url = $scope.baseurl + "stockdata/portfolio/" + portfolioId +"/" ;

    $http.get( $scope.url , data, urlconfig)
            .success(function (response, status, headers, config) {
              $scope.stockdata_list = response.data ;
              console.log($scope.stockdata_list) ;
              $("#addstock").modal("show");
          })
          .error(function (response, status, header, config) {
              console.log(response);
              $scope.errormsg = "We were not able to get the stockdata. Please try again after some time.";
              $("#stockdata-issue").modal('show');
          });


      
    };

    

    $scope.addnewstock = function (data) {
      // console.log("addnewstock");
      // console.log("customer_id");
      // console.log("portfolio_id");
      console.log(addstock);

      if(data.portfolioId == 7){
        data.asset_class = "CRYPTO";
      }else{
        data.asset_class = "STOCK";
      }


      console.log(data);
        var urlconfig = {
            headers: {
              "Content-Type": "application/json;"
            },
          };
          $http
            .post( $scope.baseurl + "roboportfolio/addstock", data, urlconfig)
            .success(function (data, status, headers, config) {
              $scope.addstock = data.data ;
              $("#addstock").modal("hide");
              location.reload();
              $scope.getportfolio(addstock.myportfolioId);
            })
            .error(function (data, status, header, config) {
              console.log(data);
            });
};




$scope.createmodelportfolio = function (customerId,portfolioId,myportfolioId,capital,broker) {

  var urlconfig = {
    headers: {
      "Content-Type": "application/json;"
    },
  };
  

  $scope.data = {}
  $scope.data.customerId = customerId;
  $scope.data.portfolioId = portfolioId;
  $scope.data.myportfolioId = myportfolioId;
  $scope.data.capital = capital;
  $scope.data.broker = broker ;

  console.log( $scope.data);
 

  $http
  .post( $scope.baseurl + "roboportfolio/createModelPortfolio" , $scope.data, urlconfig)
  .success(function (response, status, headers, config) {
    $scope.getportfolio($scope.myportfolioId);


  })
  .error(function (data, status, header, config) {
   
  });

  




};


$scope.editstockmodal = function (customerId,stock_id,symbol,stock_percentage,capital,broker) {

  
  console.log("addnewstock")
  $scope.data = {}
  $scope.data.stock_id = stock_id
  $scope.data.symbol = symbol
  $scope.data.percentage = stock_percentage
  $scope.data.capital = capital


  console.log($scope.data);
   $("#editstock").modal("show");
};

$scope.editstock = function (customer_id,portfolio_id,data) {
  console.log("editstock")
  console.log(data);
    var urlconfig = {
        headers: {
          "Content-Type": "application/json;"
        },
      };
      $http
        .post( $scope.baseurl + "roboportfolio/editstock", data, urlconfig)
        .success(function (data, status, headers, config) {
          $scope.edit = data.data ;
          $("#editstock").modal("hide");

          $scope.getportfolio($scope.myportfolioId);
        })
        .error(function (data, status, header, config) {
          console.log(data);
        });
};




$scope.deletestockmodal = function (customerId,stock_id,symbol) {
  console.log("addnewstock")

  if(symbol == "ETHUSD" ||  symbol == "BTCUSD"){
          var asset_class = "CRYPTO";
  }else{ var asset_class = "STOCK"; }

  $scope.data = {}
  $scope.data.api_key =  $scope.api_key
  $scope.data.api_secret =  $scope.api_secret
  $scope.data.api_endpoint =  $scope.api_endpoint
  $scope.data.customer_id = customerId
  $scope.data.alpaca_cash = $scope.alpaca_cash
  $scope.data.stock_id = stock_id
  $scope.data.symbol = symbol
   $("#deletestock").modal("show");
};

$scope.deletestock = function (customer_id,portfolio_id,data) {
  console.log("editstock")
  console.log(data);
    var urlconfig = {
        headers: {
          "Content-Type": "application/json;"
        },
      };
      $http
        .post( $scope.baseurl + "roboportfolio/deletestock", data, urlconfig)
        .success(function (data, status, headers, config) {
          $scope.edit = data.data ;
          $("#deletestock").modal("hide");
          $scope.getportfolio($scope.myportfolioId);
        })
        .error(function (data, status, header, config) {
          console.log(data);
        });
};

// This is edit myportfolio section

$scope.editmyportfoliomodal = function (myportfolioId,portfolioName,myportfolio) {
  
  console.log("editmyportfoliomodal")

  $scope.data = myportfolio ;
  console.log($scope.data );
   $("#editmyportfolio").modal("show");
};

$scope.submitmyportfolio = function (data) {
  
  console.log("submitmyportfolio")
  console.log(data);
    var urlconfig = {
        headers: {
          "Content-Type": "application/json;"
        },
      };
      $http
        .post( $scope.baseurl + "roboportfolio/updateuserportfolio", data, urlconfig)
        .success(function (response, status, headers, config) {
       
          console.log(response.data)
          $scope.portfolioName = response.data.portfolio_name
          $scope.capital = response.data.portfolio_capital

          localStorage.setItem("portfolioName",$scope.portfolioName );
          localStorage.setItem("capital", $scope.capital);
         

          $scope.getportfolio($scope.myportfolioId);
          $("#editmyportfolio").modal("hide");
          
        })
        .error(function (data, status, header, config) {
          console.log(data);
        });
};






    });
