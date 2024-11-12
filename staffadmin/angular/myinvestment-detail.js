
app.directive("sparklinechart", function () {

  return {

      restrict: "E",

      scope: {

          data: "@"

      },

      compile: function (tElement, tAttrs, transclude) {

          tElement.replaceWith("<span>" + tAttrs.data + "</span>");

          return function (scope, element, attrs) {

              attrs.$observe("data", function (newValue) { 
                  console.log(newValue)
                  newValue = newValue.replace("[","");
                  newValue = newValue.replace("]","");
                  var array = newValue.split(",");
                  console.log(array);
                  console.log(typeof array);
                  element.sparkline(array , { type: 'line', width: '96%', height: '100px', 
                  lineWidth:3,
                  changeRangeMin: -10, 
                  chartRangeMax: 10,
                  lineColor:"#90EE90" ,
                  fillColor: false});

              });

          };

      }

  };

});

app.factory("variable", function () {
  return {
    modulename: "roboportfoliolive",
  };
});


app.controller(
  "myinvestment-detail-ctrl",
  function ($scope, $http, $window, $location, config, variable) {
    $scope.baseurl = config.baseurl;

    const urlParams = new URLSearchParams($window.location.search);
    $scope.myportfolioId = urlParams.get("myportfolioId");
    console.log($scope.modelportfolioId);

    $scope.logout = function (req, res) {
      localStorage.clear();
      location.href = "index.html";
    };

    $scope.init = function (req, res) {
      console.log("portfoliodetailctrl");
      console.log(config.baseurl);
      var islogin = localStorage.getItem("islogin");

      
        $scope.customerId = localStorage.getItem("customerId");
       
        $("#modals").load("../modals.html");

        $("#general").addClass("active");
        $("#modelcategory").addClass("active");

        $scope.name = localStorage.getItem("name");
        $scope.email = localStorage.getItem("email");
        $scope.phone = localStorage.getItem("phone");
        // $scope.getCustomerdemoBalance($scope.customerId);
        // $scope.getCustomerliveBalance($scope.customerId);
        $scope.getUserPortfolioDetail($scope.myportfolioId);
        $scope.getBenchmarkData($scope.myportfolioId);
        $scope.portfoliolist();
      
    };




    $scope.portfoliolist = function (req, res) {
      $scope.customerId = 37 ;
      console.log($scope.customerId);
      $scope.url =
        config.baseurl  +  "roboportfoliolive/getFeaturedRoi" ;
      console.log( $scope.url)
      $http
         .get($scope.url)
         .success(function (res) {
          if (res.status == "false") {
          } else {
            $scope.portfoliolist = res.data;

            for (var i=0; i<res.data.length; i++) {
                  console.log(res.data[i].id)
                 
                 
            }


            console.log("portfoliolist: ", $scope.portfoliolist);
            $("#portfoliolist").removeClass("ng-hide");
          }
        })
        .error(function () { });
    };
 

   


    $scope.getCustomerdemoBalance = function (customerId) {
      console.log(customerId);
      $scope.data = {};
      $scope.data.customerId = customerId;
      console.log($scope.data);
      $scope.getbalanceurl = $scope.baseurl + "demobank/getCustomerBalance";
      console.log($scope.getbalanceurl);
      $http
        .post($scope.getbalanceurl, $scope.data)
        .success(function (response, status) {
          $scope.balancedata = response.data;
          console.log($scope.balancedata.cash_balance);
          $scope.demobalance = $scope.balancedata.cash_balance;
          $scope.leveragebalance = $scope.tradebalance * 4;
          console.log($scope.tradebalance);
          console.log($scope.leveragebalance);
        })
        .error(function (erroresponse, status) {
          console.log(erroresponse);
          return NaN;
        });
    };

    $scope.getCustomerliveBalance = function (customerId) {
      console.log(customerId);
      $scope.data = {};
      $scope.data.customerId = customerId;
      console.log($scope.data);
      $scope.getbalanceurl = $scope.baseurl + "livebank/getCustomerBalance";
      console.log($scope.getbalanceurl);
      $http
        .post($scope.getbalanceurl, $scope.data)
        .success(function (response, status) {
          $scope.balancedata = response.data;
          console.log($scope.balancedata.cash_balance);
          $scope.livebalance = $scope.balancedata.cash_balance;

          console.log($scope.tradebalance);
          console.log($scope.leveragebalance);
        })
        .error(function (erroresponse, status) {
          console.log(erroresponse);
          return NaN;
        });
    };

    $scope.getUserPortfolioDetail = function (myportfolioId) {
      var data = {};
      data.myportfolioId = $scope.myportfolioId;

      console.log(data);
      var urlconfig = {
        headers: {
          "Content-Type": "application/json;",
        },
      };
      $http
        .post(
          $scope.baseurl + variable.modulename + "/getUserPortfolioDetail",
          data,
          urlconfig
        )
        .success(function (response, status, headers, config) {
          $scope.portfolioDetails = response.data;

          console.log($scope.portfolioDetails);

          $scope.getportfolio($scope.portfolioDetails.id);
          $scope.gettransactions($scope.portfolioDetails.id);
          $scope.profitlossbymyportfolioid($scope.portfolioDetails.id);
          $scope.userportfolioaftercalculation($scope.portfolioDetails.id);
        })
        .error(function (data, status, header, config) {
          console.log(data);
        });
    };

    $scope.userportfolioaftercalculation = function (myportfolioId) {
      var data = {};
      data.myportfolioId = $scope.myportfolioId;

      console.log(data);
      var urlconfig = {
        headers: {
          "Content-Type": "application/json;",
        },
      };
      $http
        .post(
          $scope.baseurl + variable.modulename + "/getUserPortfolioDetail",
          data,
          urlconfig
        )
        .success(function (response, status, headers, config) {
          $scope.portfolioDetails = response.data;
        })
        .error(function (data, status, header, config) {
          console.log(data);
        });
    };

    $scope.show_add_stock_modal = function (
      customerId,
      myportfolioId,
      portfolioId,
      capital,
      broker
    ) {
      console.log("show_add_stock_modal");
      var data = {};
      var urlconfig = {
        headers: {
          "Content-Type": "application/json;",
        },
      };

      $scope.addstock = {};
      $scope.addstock.customerId = customerId;
      $scope.addstock.myportfolioId = myportfolioId;
      $scope.addstock.portfolioId = portfolioId;
      $scope.addstock.capital = capital;
      $scope.addstock.broker = broker;

      console.log($scope.addstock);

      $scope.url = $scope.baseurl + "stockdata/portfolio/" + portfolioId + "/";

      $http
        .get($scope.url, data, urlconfig)
        .success(function (response, status, headers, config) {
          $scope.stockdata_list = response.data;
          console.log($scope.stockdata_list);
          $("#addstock").modal("show");
        })
        .error(function (response, status, header, config) {
          console.log(response);
          $scope.errormsg =
            "We were not able to get the stockdata. Please try again after some time.";
          $("#stockdata-issue").modal("show");
        });
    };

    $scope.addnewstock = function (data) {
      console.log("addnewstock");
      console.log("customer_id");
      console.log("portfolio_id");
      console.log(addstock);

      if (data.portfolioId == 7) {
        data.asset_class = "CRYPTO";
      } else {
        data.asset_class = "STOCK";
      }

      console.log(data);
      var urlconfig = {
        headers: {
          "Content-Type": "application/json;",
        },
      };
      $http
        .post($scope.baseurl + "roboportfolio/addstock", data, urlconfig)
        .success(function (data, status, headers, config) {
          $scope.addstock = data.data;
          $("#addstock").modal("hide");
          // location.reload();
          $scope.getportfolio();
        })
        .error(function (data, status, header, config) {
          console.log(data);
        });
    };

    $scope.getportfolio = function (myportfolioId) {
      var data = {};
      data.myportfolioId = myportfolioId;

      console.log(data);
      var urlconfig = {
        headers: {
          "Content-Type": "application/json;",
        },
      };

      $http
        .post(
          $scope.baseurl + variable.modulename + "/getinitialportfolio",
          data,
          urlconfig
        )
        .success(function (data, status, headers, config) {
          $scope.dataset = data.data;
          $("#portfoliodetails").removeClass("ng-hide");
        })
        .error(function (data, status, header, config) {
          console.log(data);
          $("#getportfolio-issue").modal("show");
        });
    };

    $scope.profitlossbymyportfolioid = function (myportfolioId) {
      var data = {};
      data.myportfolio_id = myportfolioId;

      console.log(data);
      var urlconfig = {
        headers: {
          "Content-Type": "application/json;",
        },
      };

      $http
        .post(
          $scope.baseurl + variable.modulename + "/profitlossbymyportfolioid",
          data,
          urlconfig
        )
        .success(function (response, status, headers, config) {
          $scope.pnldata = response.data;
          console.log($scope.pnldata);
        })
        .error(function (responseerror, status, header, config) {
          console.log(responseerror);
        });
    };

    $scope.gettransactions = function (myportfolioId, broker) {
      console.log("transactiondata")
      var data = {};
      data.myportfolio_id = myportfolioId;

      console.log(data);
      var urlconfig = {
        headers: {
          "Content-Type": "application/json;",
        },
      };

      $http
        .post(
          $scope.baseurl +
          variable.modulename +
          "/getdemo_trades_By_MyPortfolioId",
          data,
          urlconfig
        )
        .success(function (response, status, headers, config) {
          $scope.transactionsdata = response.data;
          console.log($scope.transactionsdata);
        
        })
        .error(function (data, status, header, config) {
          console.log(data);
          $("#getportfolio-issue").modal("show");
        });
    };




    $scope.editstockmodal = function (
      customerId,
      stock_id,
      symbol,
      stock_percentage,
      capital,
      broker,
      status
    ) {
      console.log("addnewstock");
      $scope.data = {};
      $scope.data.stock_id = stock_id;
      $scope.data.symbol = symbol;
      $scope.data.percentage = stock_percentage;
      $scope.data.status = status;
      $scope.data.capital = capital;

      console.log($scope.data);
      $("#editstock").modal("show");
    };

    $scope.editstock = function (customer_id, portfolio_id, data) {
      console.log("editstock");
      console.log(data);
      var urlconfig = {
        headers: {
          "Content-Type": "application/json;",
        },
      };
      $http
        .post(
          $scope.baseurl + +variable.modulename + "roboportfolio/editstock",
          data,
          urlconfig
        )
        .success(function (data, status, headers, config) {
          $scope.edit = data.data;
          $("#editstock").modal("hide");

          $scope.getportfolio($scope.myportfolioId);
        })
        .error(function (data, status, header, config) {
          console.log(data);
        });
    };

    $scope.deletestockmodal = function (customerId, stock_id, symbol) {
      console.log("addnewstock");

      if (symbol == "ETHUSD" || symbol == "BTCUSD") {
        var asset_class = "CRYPTO";
      } else {
        var asset_class = "STOCK";
      }

      $scope.data = {};
      $scope.data.api_key = $scope.api_key;
      $scope.data.api_secret = $scope.api_secret;
      $scope.data.api_endpoint = $scope.api_endpoint;
      $scope.data.customer_id = customerId;
      $scope.data.alpaca_cash = $scope.alpaca_cash;
      $scope.data.stock_id = stock_id;
      $scope.data.symbol = symbol;
      $("#deletestock").modal("show");
    };

    $scope.deletestock = function (customer_id, portfolio_id, data) {
      console.log("editstock");
      console.log(data);
      var urlconfig = {
        headers: {
          "Content-Type": "application/json;",
        },
      };
      $http
        .post(
          $scope.baseurl + +variable.modulename + "roboportfolio/deletestock",
          data,
          urlconfig
        )
        .success(function (data, status, headers, config) {
          $scope.edit = data.data;
          $("#deletestock").modal("hide");
          $scope.getportfolio($scope.myportfolioId);
        })
        .error(function (data, status, header, config) {
          console.log(data);
        });
    };

    // This is edit myportfolio section

    $scope.editmyportfoliomodal = function (req,res)
    {
      console.log("editmyportfoliomodal");
      $("#editmyportfolio").modal("show");
    };

    $scope.editportfolio = function (data) {
      console.log("editportfolio");
      console.log(data);
      var urlconfig = {
        headers: {
          "Content-Type": "application/json;",
        },
      };
    
      
      $scope.data = {}
      $scope.data.id = $scope.portfolioDetails.id
      $scope.data.portfolio_capital = $scope.portfolioDetails.portfolio_capital
      $scope.data.portfolio_benchmark = $scope.portfolioDetails.portfolio_benchmark
      $scope.data.portfolio_ispublic = $scope.portfolioDetails.portfolio_ispublic
      $scope.data.portfolio_isfeatured = $scope.portfolioDetails.portfolio_isfeatured

      console.log($scope.data)

      $http
        .post(
          $scope.baseurl + variable.modulename + "/updateuserportfolio",
          $scope.data,
          urlconfig
        )
        .success(function (response, status, headers, config) {
          console.log(response.data);
        
          $("#editmyportfolio").modal("hide");
        })
        .error(function (data, status, header, config) {
          console.log(data);
        });
    };


 

    
    // console.log($scope.transactionsdata)
    
    $scope.getBenchmarkData = function (myportfolio_id) {
      $scope.data = {};
      $scope.data.myportfolio_id = myportfolio_id;
    
      console.log($scope.data);
      $scope.postbenchmarkurl = $scope.baseurl +  variable.modulename + "/getbenchmark";
      console.log($scope.postbenchmarkurl);
      $http
        .post($scope.postbenchmarkurl, $scope.data)
        .success(function (response, status) {
          $scope.createplotlygraph(response);
        })
        .error(function (erroresponse, status) {
          console.log(erroresponse);
          return NaN;
        });
    };


    $scope.createplotlygraph = function (response) {
      
      var fig = {}
      fig.data = [
        {
          x: response.datettime,
          y: response.benchmarkroi,
          smoothness :1.3,
          mode: 'line+marker',
          name: 'benchmarkroi'
        },
        {
          x: response.tradedate,
          y: response.portfolioroi,
          smoothness :1.3,
          mode: 'line+marker',
          name: 'portfolioroi'
        },
    ];

    console.log(fig.data);
    fig.layout = {}
    fig.layout.title = 'Portfolio Tracking';
    Plotly.newPlot('myDiv', fig.data, fig.layout);




    }



 });
