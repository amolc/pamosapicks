
app.factory("variable", function () {
  return {
    modulename: "roboportfoliolive",
  };
});

app.controller(
  "portfolio-detail-ctrl",
  function ($scope, $http, $window, $location, config, variable) {
    $scope.baseurl = config.baseurl;

    const urlParams = new URLSearchParams($window.location.search);
    $scope.myportfolioId = urlParams.get("myportfolioId");
    console.log($scope.myportfolioId);


    $scope.stock= urlParams.get("stock");
    console.log($scope.stock);


    $scope.charturl = $scope.baseurl + variable.modulename + "/supertrendchart?name=" + $scope.stock;


    $scope.logout = function (req, res) {
      localStorage.clear();
      location.href = "index.html";
    };

    
    $scope.init = function (req, res) {
      console.log("portfoliodetailctrl");
      console.log(config.baseurl);
      var islogin = localStorage.getItem("islogin");

      if (islogin != "1") {
        location.href = "index.html";
      } else {
        $scope.customerId = localStorage.getItem("customerId");
        if ($scope.customerId == 1) {
          $("#menu").load("../menu-admin.html");
        } else {
          $("#menu").load("menu-demo.html");
        }
        $("#modals").load("../modals.html");

        $("#general").addClass("active");
        $("#modelcategory").addClass("active");

        $scope.name = localStorage.getItem("name");
        $scope.email = localStorage.getItem("email");
        $scope.phone = localStorage.getItem("phone");
        // $scope.getCustomerdemoBalance($scope.customerId);
        $scope.profitlossbymyportfolioidandStock($scope.stock,$scope.myportfolioId);
        $scope.getdemo_trades_By_MyPortfolioIdandStock($scope.stock,$scope.myportfolioId);
      }
    };


    // pnldata  - This data needs to be by stock and from the portfolio data

    $scope.profitlossbymyportfolioidandStock = function(stock,myportfolioId) {

      var data = {}
      data.myportfolio_id = myportfolioId ;
      data.stock = stock ;
    
      console.log(data);
        var urlconfig = {
            headers: {
              "Content-Type": "application/json;"
            },
          };
         
          $http
            .post( $scope.baseurl + variable.modulename + "/profitlossbymyportfolioidandstock" , data, urlconfig)
            .success(function (response, status, headers, config) {
              $scope.pnldata = response.data ;
              console.log($scope.pnldata)
            })
            .error(function (responseerror, status, header, config) {
              console.log(responseerror);
            });
    
    }

    $scope.getdemo_trades_By_MyPortfolioIdandStock = function(stock,myportfolioId) {

      var data = {}
      data.stock = stock ;
      data.myportfolio_id = myportfolioId ;
    
      console.log(data);
        var urlconfig = {
            headers: {
              "Content-Type": "application/json;"
            },
          };
          
          $scope.transactionUrl = $scope.baseurl + variable.modulename +  "/getdemo_trades_By_MyPortfolioIdandStock" ;
          $http
            .post($scope.transactionUrl  , data, urlconfig)
            .success(function (response, status, headers, config) {
              $scope.transactionsdata = response.data ;
              console.log($scope.transactionsdata )
            })
            .error(function (data, status, header, config) {
              console.log(data);
              $("#getportfolio-issue").modal('show');
            });
    
    }

    Highcharts.getJSON($scope.charturl, function (response) {

      // split the data set into ohlc and volume
      var ohlc = [],
          volume = [],
          buydata = [],
          buyclosedata = [],
          selldata = [],
          sellclosedata = [],
          ema1data = [],
          ema1dataset =[]
          ema2data = [],
          ema2dataset =[],
          c2data = [],
          c2dataset =[]
  
          data = response.data,
          ema2dataset = response.data,
          buydataset = response.buydataset,
          buyclosedataset = response.buyclosedataset,
          selldataset = response.selldataset,
          sellclosedataset = response.sellclosedataset,
  
  
          dataLength = response.data.length,
          // set the allowed units for data grouping
          groupingUnits = [[
              'minute',                         // unit name
              [1]                             // allowed multiples
          ], [
              'month',
              [1, 2, 3, 4, 6]
          ]],
          
  
          i = 0; a = 0; b = 0; c = 0; d = 0;e = 0;
  
      for (a; a < buydataset.length; a += 1) {
      
        buydata.push([ 
          buydataset[a][0], // the date
          buydataset[a][1] // the buy
        ]);
      }
  
      for (b; b < buyclosedataset.length; b += 1) {
        
        buyclosedata.push([ 
          buyclosedataset[b][0], // the date
          buyclosedataset[b][1] // the buy
        ]);
      }
      for (c; c < selldataset.length; c += 1) {
       
        selldata.push([ 
          selldataset[c][0], // the date
          selldataset[c][1] // the buy
        ]);
      }
      for (d; d < sellclosedataset.length; d += 1) {
        sellclosedata.push([ 
          sellclosedataset[d][0], // the date
          sellclosedataset[d][1] // the buy
        ]);
      }
  
      console.log(ema2dataset.length);
  
      // for (e; e < ema2dataset.length ; e += 1) {
      //   ema2data.push([ 
          
      //     ema2dataset[i][0], // the date
      //     ema2dataset[i][5]  // the ema1
      //   ]);
      //   // console.log(ema2dataset[e][0])
      //   // console.log(ema2dataset[e][5])
      // }
     
      for (i; i < dataLength; i += 1) {
          ohlc.push([
              data[i][0], // the date
              data[i][7], // open
              data[i][8], // high
              data[i][9], // low
              data[i][10] // close
          ]);
         
          volume.push([
              data[i][0], // the date
              data[i][10] // the volume
          ]);
          ema1data.push([
            data[i][0], // the date
            data[i][5] // the volume
          ]);
          ema2data.push([
            data[i][0], // the date
            data[i][6] // the volume
          ]);
          c2data.push([
            data[i][0], // the date
            data[i][7] // the volume
          ]);
      }
  
      console.log(ema1data)
      console.log(ohlc)
      // create the chart
      Highcharts.stockChart('container', {
  
          rangeSelector: {
              selected: 1
          },
  
          title: {
              text: $scope.stockdata
          },
  
          yAxis: [{
              labels: {
                  align: 'right',
                  x: -3
              },
              title: {
                  text: 'OHLC'
              },
              height: '70%',
              lineWidth: 2,
              resize: {
                  enabled: true
              }
          }, {
              labels: {
                  align: 'right',
                  x: -3
              },
              title: {
                  text: 'Volume'
              },
              top: '65%',
              height: '35%',
              offset: 0,
              lineWidth: 2
          }],
  
          tooltip: {
              split: true
          },
          legend: {
            layout: 'vertical',
            align: 'left',
            x: 120,
            verticalAlign: 'top',
            y: 80,
            floating: true
         },
           rangeSelector: {
               selected: 5,
               buttons: [{
                   type: 'minute',
                   count: 60,
                   text: '1h'
               }, {
                   type: 'minute',
                   count: 720,
                   text: '12h'
               }, {
                   type: 'day',
                   count: 1,
                   text: '1d'
               }, {
                   type: 'day',
                   count: 7,
                   text: '1w'
               }, {
                   type: 'month',
                   count: 1,
                   text: '1m'
               }, {            
                   type: 'all',
                   text: 'All'
               }]
           },
  
          series: [
          {
              type: 'candlestick',
              zoomType: 'xy',
              name: $scope.stockdata,
              data: ohlc,
              displayErrors: true,
              marker: {
                fillcolor: "#ff0000",
                states: {
                    hover: {
                        enabled: true,
                    }
                }
              }
          }, 
            {
              type: 'line',
              zoomType: 'xy',
              name: 'ema1',
              data: ema1data,
              displayErrors: true,
              marker: {
                fillcolor: "#0047AB",
                states: {
                    hover: {
                        enabled: true,
                    }
                }
              }
          }, 
          {
            type: 'line',
            zoomType: 'xy',
            name: 'ema2',
            data: ema2data,
            displayErrors: true,
            marker: {
              fillcolor: "#00FF00",
              states: {
                  hover: {
                      enabled: true,
                  }
              }
            }
        }, 
          
          {
            type: 'scatter',
            name: 'buy',
            data: buydata,
            marker: {
              radius: 3,
              symbol: 'circle',
              fillcolor: "#00FF00",
              states: {
                  hover: {
                      enabled: true,
                  }
              }
            }
          },
          {
            type: 'scatter',
            name: 'buyclose',
            data: buyclosedata,
            marker: {
              radius: 3,
              symbol: 'circle',
              fillcolor: "#00008B",
              states: {
                  hover: {
                      enabled: true,
                  }
              }
            }
            
          },
          {
            type: 'scatter',
            name: 'sell',
            data: selldata,
            color: "#FF0000",
            marker: {
              radius: 3,
              symbol: 'circle',
              fillcolor: "#FF0000",
              states: {
                  hover: {
                      enabled: true,
                  }
              }
            }
          },
          {
            type: 'scatter',
            name: 'sellclose',
            data: sellclosedata,
            color: "#653508",
            marker: {
              radius: 3,
              symbol: 'circle',
              fillcolor: "#653508",
              states: {
                  hover: {
                      enabled: true,
                  }
              }
            }
          },
          {
              type: 'column',
              name: 'Volume',
              data: volume,
              yAxis: 1,
             
          }
        ]
      });
    }); 
  
  
  
});
