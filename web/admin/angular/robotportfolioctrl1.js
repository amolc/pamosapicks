app.controller('robotportfolioctrl', function($scope, $http, $window,$location, config) {

    $scope.baseurl = config.baseurl ;

    $scope.logout = function (req, res) {
            localStorage.clear();
            location.href = "index.html";
          };
    
    $scope.portfolioId = 1 ;
    $scope.init = function(req, res) {
         console.log("roboctrl");
         console.log(config.baseurl);
         var islogin = localStorage.getItem("islogin");

         if (islogin != "1") {
                location.href = "index.html";
              }else{
                $scope.categorylist();
                $scope.name = localStorage.getItem("name");
                $scope.customerId = localStorage.getItem("customerId");
                console.log($scope.customerId);

              }

    }


    $scope.categorylist = function(req, res) {
            $http.get(config.baseurl + 'category/')
                .success(function(res) {
                    if (res.status == 'false') {} else {
                        $scope.categoryset = res.data;
                        console.log('dataset: ', $scope.categoryset);
                    }
                }).error(function() {});
        }


    $scope.showportfolio = function(customerId, portfolioId,portfolioName) {
    
      $scope.portfolioId = portfolioId ;
      $scope.portfolioName = portfolioName ;
      console.log('customerId', customerId);
      console.log('portfolioId', portfolioId);
      $scope.checkportfolioexist(customerId, portfolioId,portfolioName);
      // $scope.getportfolio (customerId, portfolioId);
          
      }

      
    $scope.checkportfolioexist = function(customerId,portfolioId) {


        var data = {}
        data.customer_id=  customerId ;
        data.portfolio_id =  portfolioId ;
       
        console.log(data);

          var urlconfig = {
              headers: {
                "Content-Type": "application/json;"
              },
            };

            $http
              .post( $scope.baseurl + "roboportfolio/checkportfolio" , data, urlconfig)
              .success(function (data, status, headers, config) {
                $scope.portfolioexist = data.portfolioexist ;

                if($scope.portfolioexist == 1){

                  $("#portfoliodetails").removeClass("ng-hide");
                }
                else{
                
                  $("#createportfolio").removeClass("ng-hide");

                }
               


              })
              .error(function (data, status, header, config) {
                console.log(data);
                $("#getportfolio-issue").modal('show');
              });

    }
   
    
    $scope.createportfolio = function(customerId,portfolioId,portfolioName,portfolio) {


      var data = {}
      data.customer_id=  customerId ;
      data.portfolio_id =  portfolioId ;
      data.portfolio_name =  portfolioName ;
      data.portfolio_capital =  portfolio.capital ;

      console.log(data);

        var urlconfig = {
            headers: {
              "Content-Type": "application/json;"
            },
          };

          $http
            .post( $scope.baseurl + "roboportfolio/createportfolio" , data, urlconfig)
            .success(function (data, status, headers, config) {
              $scope.portfolioexist = data.portfolioexist ;

              if($scope.portfolioexist == 1){

                $("#portfoliodetails").removeClass("ng-hide");
              }
              else{
              
                $("#createportfolio").removeClass("ng-hide");

              }
             


            })
            .error(function (data, status, header, config) {
              console.log(data);
              $("#getportfolio-issue").modal('show');
            });

  }
        

    

    $scope.getportfolio = function(customerId,portfolioId) {

      

        var data = {}
        data.api_key =  $scope.api_key ;
        data.api_secret =  $scope.api_secret ;
        data.api_endpoint =  $scope.api_endpoint;
        data.alpaca_cash = $scope.alpaca_cash ;
        data.customerId = customerId ;
        data.portfolioId = portfolioId ;

        console.log(data);
          var urlconfig = {
              headers: {
                "Content-Type": "application/json;"
              },
            };

            $http
              .post( $scope.baseurl + "roboportfolio/getinitialportfolio" , data, urlconfig)
              .success(function (data, status, headers, config) {
                $scope.dataset = data.data ;
                $("#portfoliodetails").removeClass("ng-hide");
              })
              .error(function (data, status, header, config) {
                console.log(data);
                $("#getportfolio-issue").modal('show');
              });

    }


    $scope.show_add_stock_modal = function (portfolioId) {
      
      var data = {}
      var urlconfig = {
        headers: {
          "Content-Type": "application/json;"
        },
      };

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



         $scope.addnewstock = function (customer_id,portfolio_id,addstock) {
                console.log("addnewstock");
                console.log("customer_id");
                console.log("portfolio_id");
                console.log(addstock);

                if(portfolio_id == 7){
                        addstock.asset_class = "CRYPTO";
                }else{
                        addstock.asset_class = "STOCK";
                }

                var data = {}
                data.api_key =  $scope.api_key
                data.api_secret =  $scope.api_secret
                data.api_endpoint =  $scope.api_endpoint
                data.customer_id = customer_id ;
                data.alpaca_cash = $scope.alpaca_cash ;
                data.symbol = addstock.symbol ;
                data.asset_class = addstock.asset_class ;
                data.portfolio_id = addstock.portfolio_id ;
                data.percentage = addstock.percentage ;

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
                      })
                      .error(function (data, status, header, config) {
                        console.log(data);
                      });
          };


        $scope.resetportfolio = function (customer_id,portfolio_id) {
                console.log("resetportfolio")
                var data = {}
                data.api_key =  $scope.api_key
                data.api_secret =  $scope.api_secret
                data.api_endpoint =  $scope.api_endpoint
                data.customer_id = customer_id ;
                data.alpaca_cash = $scope.alpaca_cash ;

                console.log(data);
                  var urlconfig = {
                      headers: {
                        "Content-Type": "application/json;"
                      },
                    };

                    $http
                      .post( $scope.baseurl + "roboportfolio/resetportfolio", data, urlconfig)
                      .success(function (data, status, headers, config) {
                        $scope.resetdata = data.data ;
                        $("#restportfolio").modal("hide");
                        location.reload();

                      })
                      .error(function (data, status, header, config) {
                        console.log(data);
                      });
          };


          $scope.createportfoliomodal = function (customer_id,portfolio_id) {
                console.log("createportfolio")
                var data = {}
                data.api_key =  $scope.api_key
                data.api_secret =  $scope.api_secret
                data.api_endpoint =  $scope.api_endpoint
                data.customer_id = customer_id ;
                data.alpaca_cash = $scope.alpaca_cash ;

                console.log(data);
                  var urlconfig = {
                      headers: {
                        "Content-Type": "application/json;"
                      },
                    };

                    $http
                      .post( $scope.baseurl + "roboportfolio/getinitialportfolio", data, urlconfig)
                      .success(function (data, status, headers, config) {

                        var  data = data;
                        console.log(data)
                        msg = data.msg ;
                        console.log(msg)
                        if(msg==0){
                              $("#createportfolio").modal("show");
                        }
                        else{
                          $scope.alertmessage = "Please reset your portfolio before creating a new one."
                           $("#alert").modal("show");

                        }

                      })
                      .error(function (data, status, header, config) {
                        console.log(data);
                        $("#alert").modal("show");

                      });
          };

          $scope.createportfolio = function (customer_id,portfolio_id) {
                console.log("createportfolio")
                var data = {}
                data.api_key =  $scope.api_key
                data.api_secret =  $scope.api_secret
                data.api_endpoint =  $scope.api_endpoint
                data.customer_id = customer_id ;
                data.alpaca_cash = $scope.alpaca_cash ;

                console.log(data);
                  var urlconfig = {
                      headers: {
                        "Content-Type": "application/json;"
                      },
                    };

                    $http
                      .post( $scope.baseurl + "roboportfolio/createPortfolio", data, urlconfig)
                      .success(function (data, status, headers, config) {
                        $scope.resetdata = data.data ;
                        $("#createportfolio").modal("hide");
                        
                       
                      })
                      .error(function (data, status, header, config) {
                        console.log(data);
                        $("#alert").modal("show");

                      });
          };

          $scope.editstockmodal = function (customerId,stock_id,symbol,stock_percentage) {
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
                $scope.data.asset_class = asset_class
                $scope.data.portfolio_id = 1
                $scope.data.percentage = stock_percentage
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
                         $scope.getportfolio($scope.customerId)
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
                        $scope.getportfolio($scope.customerId)
                      })
                      .error(function (data, status, header, config) {
                        console.log(data);
                      });
          };


    

















});