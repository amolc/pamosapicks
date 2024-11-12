app.controller(
  "portfolioDetail",
  function ($scope, $http, $window, $location, config) {
    $scope.baseurl = config.baseurl;
    $scope.wssurl = config.wssurl;
    console.log(config);

    var searchParams = new URLSearchParams($window.location.search);
    $scope.portfolioId  = searchParams.get("id");
    
    $scope.init = function (req, res) {
      $scope.show = false
      // $scope.alpaca();
      
      
      console.log("portfolioDetail");
      console.log(config.baseurl);
      var islogin = localStorage.getItem("islogin");
      if (islogin != "1") {
        location.href = "login.html";
      } 

      var customerId = localStorage.getItem("customerId");
      // subscriber signals
      $scope.accountSocket();
      $scope.getUserPortfolioDetail();
      $scope.getSubscriberStocks();
      $scope.portfolioAccessList();
      $scope.sharePercentageChart();
      // $scope.portfolioList();
      // $scope.getSubscriberSignals();
      // $scope.getSubscriberDetails(customerId);


      
    };


    $scope.getSubscriberDetails = function (data) {
      console.log(data);
      var urlconfig = {
        headers: {
          "Content-Type": "application/json;",
        },
      };
      $http
        .get(
          ($scope.url =
            config.baseurl + `stockdata/subscriberportfolio/?customerId=${data}`),
          data,
          urlconfig
        )
        .success(function (response, status, headers, config) {
          $scope.customers = response;

          console.log($scope.customers);

          
        })
        .error(function (data, status, header, config) {
          console.log(data);
        });
    };



    $scope.getUserPortfolioDetail = function (req, res) {
      var data = {};
      var searchParams = new URLSearchParams($window.location.search);
      var portfolioId = searchParams.get("id");
      data.myportfolioId = portfolioId;

      console.log(data);
      var urlconfig = {
        headers: {
          "Content-Type": "application/json;",
        },
      };
      $http
        .get(
          ($scope.url = config.baseurl + "stockdata/subscribedetail/"+portfolioId+"/?robot=alpaca"),
          data,
          urlconfig
        )
        .success(function (response, status, headers, config) {
          $scope.portfolioDetails = response.data;
          $scope.addapidata = response.data;
          console.log("response.data", response.data);
          console.log("profitlossgraph",response.data['profitlossgraph'])

          console.log("datetimegraph",response.data['datetimegraph'])
          
          $scope.enddate = $scope.portfolioDetails.enddate;
          var durationInMilliseconds =
            $scope.enddate - $scope.portfolioDetails.startdate;

          // Calculate the duration in days
          var durationInDays = durationInMilliseconds / (1000 * 60 * 60 * 24);

          // Store the duration in your scope variable
          $scope.duration = durationInDays;
          var dateObj = new Date($scope.enddate);

          // Extract year, month, and day components
          var year = dateObj.getFullYear();
          var month = String(dateObj.getMonth() + 1).padStart(2, "0"); // Month is zero-based
          var day = String(dateObj.getDate()).padStart(2, "0");

          // Format the components into yyyy-mm-dd format
          $scope.formattedEndDate = year + "-" + month + "-" + day;

          localStorage.setItem("portfolioname", response.data.portfolio_name);

          console.log($scope.customers);
          var portfolioname = $scope.portfolioDetails.portfolio_name
          
          console.log($scope.customers.length,"...legth",$scope.customers)
          for(var i=0;i<$scope.customers.length;i++){

            // console.log($scope.customers[i].portfolio_name,"...", portfolioname)
            
            if($scope.customers[i].portfolio_name==portfolioname){
              
              $scope.show = true
              $scope.plan_name = $scope.customers[i].plan_name
              $scope.cost = $scope.customers[i].cost

              $scope.startdate = $scope.customers[i].startdate
              $scope.enddate = $scope.customers[i].enddate

              return
              }
            else{
              $scope.show = false
            }

            $scope.portfolioname = localStorage.getItem("portfolioname");
            if (portfolioname == "USSMALLSTOCKS"){

            }
            console.log(portfolioname,"..nameport")



          }
          
        })
        .error(function (data, status, header, config) {
          console.log(data);
        });
    };

  
    $scope.getSubscriberSignals = function () {
      var searchParams = new URLSearchParams($window.location.search);
      var portfolioId = searchParams.get("id");
      var customerId = localStorage.getItem("customerId");
      var portfolioname = localStorage.getItem("portfolioname");
      $scope.url = config.baseurl + `stockdata/alpacasubscribersignal?customerId=${customerId}&portfolioName=${portfolioname}`

      
      var urlconfig = {
        headers: {
          "Content-Type": "application/json;",
        },
      };
      $http
        .get(
          ($scope.url =
            config.baseurl + `stockdata/alpacasubscribersignal?customerId=${customerId}&portfolioName=${portfolioname}`),
          urlconfig
        )
        .success(function (response, status, headers, config) {

          $scope.signals = response;
          console.log($scope.signals);
          
          
        })
        .error(function (data, status, header, config) {
          console.log(data);
        });
    };


    $scope.getSubscriberStocks = function () {
      var searchParams = new URLSearchParams($window.location.search);
      var portfolioId = searchParams.get("id");
      var customerId = localStorage.getItem("customerId");

      
      var urlconfig = {
        headers: {
          "Content-Type": "application/json;",
        },
      };
      $http
        .get(
          ($scope.url =
            config.baseurl + `stockdata/subscriberportfoliostocks?customerId=${customerId}&portfolioId=${portfolioId}&robot=alpaca&status=1`),
          urlconfig
        )
        .success(function (response, status, headers, config) {
          $scope.stockData  = response.data;
          console.log( $scope.stockData ,"...stockdata")
          $scope.sharePercentageChart(response.chart_data)
          $scope.stockvalue = true
          
        })
        .error(function (data, status, header, config) {
          console.log(data);
        });
    };


    $scope.portfolioList = function (req, res) {
      $http
        .get($scope.baseurl + "modelportfolio/featured")
        .success(function (res) {
          if (res.status == "false") {
          } else {
            $scope.mangoes = res;
            $scope.dataset = $scope.mangoes.data;

            

            // Calculate the starting index and ending index for the last three items
            var startIndex = Math.max($scope.dataset.length - 3, 0);
            var endIndex = $scope.dataset.length;

            // Calculate the number of pages
            $scope.totalPages = Math.ceil(
              $scope.dataset.length / $scope.itemsPerPage
            );

            // Set currentPage to the last page if it's beyond the total pages
            if ($scope.currentPage > $scope.totalPages) {
              $scope.currentPage = $scope.totalPages;
            }

            // Slice the dataset to show only the last three items
            $scope.displayedItems = $scope.dataset.slice(startIndex, endIndex);
          }
        })
        .error(function () {});
    };

    $scope.getStockSignals = function (data) {
      console.log(data);
      var urlconfig = {
        headers: {
          "Content-Type": "application/json;",
        },
      };
      $http
        .get(
          ($scope.url =
            config.baseurl + `stockdata/signals/?portfolio_name=${data}`),
          data,
          urlconfig
        )
        .success(function (response, status, headers, config) {
          $scope.signals = response;
         
          console.log($scope.signals);
         
        })
        .error(function (data, status, header, config) {
          console.log(data);
        });
    };

    $scope.portfolioStockList = function (req, res) {
      var searchParams = new URLSearchParams($window.location.search);
      var portfolioId = searchParams.get("id");
      $http
        .get($scope.baseurl + "modelportfolio/stocks/" + portfolioId)
        .success(function (res) {
          if (res.status == "false") {
          } else {
            $scope.mangoes = res;
            $scope.stockData = $scope.mangoes.data;
            console.log($scope.stockData);
                      }
        })
        .error(function () {});
    };

    $scope.sharePercentageChart = function (chart_data) {

      //  Lets draw the pie-chart
        // var loserate = totaltrades - winrate
    
        // $scope.winratepercentage = winrate/totaltrades * 100 ;
        var stocks = chart_data.map(function(item) {
          return item.stock;
      });
      var allocated_values = chart_data.map(function(item) {
          return item.allocated_value;
      });
    
        var data = [{
          values:allocated_values,
          labels: stocks,
          marker: {'colors': [
            'rgb(0, 204, 0)',  
            'rgb(215, 11, 11)' 
           ]},
          domain: {column: 0},
          // name: 'Allocation Value',
          hoverinfo: 'label+percent+name',
          hole: .4,
          type: 'pie'
        }];
        
        var layout = {
          title: 'Allocation Values',
          annotations: [
            {
              font: {
                size: 18
              },
              showarrow: false,
              text: '',
              x: 0.17,
              y: 0.5
            }
          ],
          showlegend: false,
          grid: {rows: 1, colums: 1},
          height: 300,
          width: 300,
        };
    
    
        Plotly.newPlot('sharePerDiv', data, layout );
    
    }
  
    $scope.testAccount = function () {
        var searchParams = new URLSearchParams($window.location.search);
        var portfolioId = searchParams.get("id");
      
        var urlconfig = {
          headers: {
            "Content-Type": "application/json;",
          },
        };
        $http
          .get(
            ($scope.url =
              config.baseurl + `stockdata/test-details/?portfolio_id=${portfolioId}&robot=alpaca`),
            urlconfig
          )
          .success(function (response, status, headers, config) {
            alert("Account verfied")
          })
          .error(function (data, status, header, config) {
            alert(data.data)
            console.log(data);
          });
        
    }

    $scope.onaddAPISubmit = function (data) {

          var searchParams = new URLSearchParams($window.location.search);
          var portfolioId = searchParams.get("id");
        
          var urlconfig = {
            headers: {
              "Content-Type": "application/json;",
            },
          };
          $http
            .put(
              ($scope.url =
                config.baseurl + `stockdata/put-details/${portfolioId}/?robot=alpaca`),
                data,
              urlconfig
            )
            .success(function (response, status, headers, config) {
              $scope.getUserPortfolioDetail();
              alert("Saved Successfully")
              // $("#igUserDetaiDiv").removeClass('d-none')
              // $("#igUserFormDiv").addClass('d-none')
        
              
            })
            .error(function (data, status, header, config) {
              alert(data)
              console.log(data);
            });
          
    }

    $scope.igdashboarddata = []; 
    $scope.accountSocket = function() {
      debugger;
      var searchParams = new URLSearchParams($window.location.search);
      var portfolioId = searchParams.get("id");
      var socket = new WebSocket($scope.wssurl+`ws/get-alpaca-orders/${portfolioId}/`)
      socket.onmessage = function (e){
        
        var cleanedData = e.data.replace(/NaN|null/g, 'null');
        var djangoData = JSON.parse(cleanedData);
        console.log(djangoData, "---djangoData--");
        $scope.$apply(function () {
          $scope.igdashboarddata = djangoData.value;
        });
      }
    }

    $scope.buyAndsellOpenPosistion = function(stockId, portfolioId, api_key, direction) {
      console.log(stockId, portfolioId, direction );
      if (api_key == null  || api_key == '' ){
        alert("Enter API Details to Trade")
      }
      else {
        $scope.imLoading = true;
      var searchParams = new URLSearchParams($window.location.search);
      var portfolioId = searchParams.get("id");
      data = {'side': direction}
      var urlconfig = {
        headers: {
          "Content-Type": "application/json;",
        },
      };
      $http
        .post(
          ($scope.url =
            config.baseurl + `stockdata/post-robot-alpaca-trading/?stock_id=${stockId}&portfolio_id=${portfolioId}`),
            data, urlconfig
        )
        .success(function (response, status, headers, config) {
          $scope.imLoading = false;
          alert("Success")
          $scope.getSubscriberTranscation()
          $scope.accountSocket()
        })
        .error(function (data, status, header, config) {
          $scope.imLoading = false;
          alert(data.data)
          console.log(data);
        });
      }
    }


    $scope.closePosition = function (symbol) {
      $scope.symbol =  symbol
  
       $("#closeOpenPositionMdl").modal("show");
    };
    
    $scope.confrimClosePosition = function () {
  
      var searchParams = new URLSearchParams($window.location.search);
      var portfolioId = searchParams.get("id");
  
      var data = {}
  
      var symbol = $scope.symbol 
      data = {"symbol": symbol}
        var urlconfig = {
            headers: {
              "Content-Type": "application/json;"
            },
          };
          $http
            .patch( $scope.baseurl + `stockdata/close-robot-alpaca-trading/?portfolio_id=${portfolioId}`, data, urlconfig)
            .success(function (data, status, headers, config) {
              alert("Success")
              console.log(data, "--success--");
              $("#closeOpenPositionMdl").modal("hide");
            })
            .error(function (data, status, header, config) {
              console.log(data);
              alert(data.data)
            });
    };

    $scope.addAccess = function () {
      $("#allowAccessModel").modal('show')
    }
    
    $scope.closeModal = function(modalId) {

      $("#"+modalId).modal("hide");
    }
    
    $scope.portfolioAccessSubmit = function (data) {

      var searchParams = new URLSearchParams($window.location.search);
      var portfolioId = searchParams.get("id");
      data['portfolio_id'] = portfolioId
      data['robot'] = "alpaca"
      var urlconfig = {
        headers: {
          "Content-Type": "application/json;",
        },
      };
      $http
        .post(
          ($scope.url =
            config.baseurl + `stockdata/post-portfolio-access/`),
            data,
          urlconfig
        )
        .success(function (response, status, headers, config) {
          console.log(response.data);
          $("#allowAccessModel").modal('hide')
          alert("Success")
          $scope.portfolioAccessList()
        })
        .error(function (data, status, header, config) {
          alert(data.data)
          console.log(data.data);
        });
      
      }



      $scope.portfolioAccessList = function () {
        var searchParams = new URLSearchParams($window.location.search);
        var portfolioId = searchParams.get("id");
      
        var urlconfig = {
          headers: {
            "Content-Type": "application/json;",
          },
        };
        $http
          .get(
            ($scope.url =
              config.baseurl + `stockdata/get-portfolio-access/?portfolio_id=${portfolioId}&robot=alpaca`),
            urlconfig
          )
          .success(function (response, status, headers, config) {
            $scope.AcccessList = response.data
          })
          .error(function (data, status, header, config) {
            alert(data)
            console.log(data);
          });
        
        }

  
    }
);