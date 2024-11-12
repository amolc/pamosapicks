app.controller(
  "portfolioDetail",
  function ($scope, $http, $window, $location, config) {
    $scope.baseurl = config.baseurl;
    $scope.wssurl = config.wssurl;
    console.log(config);

    $scope.init = function (req, res) {
      $scope.show = false
      // $scope.alpaca();
      var searchParams = new URLSearchParams($window.location.search);
      $scope.portfolioId  = searchParams.get("id");

      console.log("portfolioDetail");
      console.log(config.baseurl);
      var islogin = localStorage.getItem("isCustomerlogin");
      if (islogin != "1") {
        location.href = "login.html";
      } 
      $scope.customerName = localStorage.getItem("customerName");
      
      // subscriber signals
      $scope.accountSocket();
      $scope.getUserPortfolioDetail();
      $scope.getSubscriberStocks();
      // $scope.sharePercentageChart();
      $scope.getSubscriberTranscation();
      
      // $scope.portfolioList();
      // $scope.getSubscriberSignals();
      // $scope.getSubscriberDetails(customerId);


      
    };

    const customerId = localStorage.getItem("customer_Id");
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
          
          // console.log($scope.customers.length,"...legth",$scope.customers)
          // for(var i=0;i<$scope.customers.length;i++){

          //   // console.log($scope.customers[i].portfolio_name,"...", portfolioname)
            
          //   if($scope.customers[i].portfolio_name==portfolioname){
              
          //     $scope.show = true
          //     $scope.plan_name = $scope.customers[i].plan_name
          //     $scope.cost = $scope.customers[i].cost

          //     $scope.startdate = $scope.customers[i].startdate
          //     $scope.enddate = $scope.customers[i].enddate

          //     return
          //     }
          //   else{
          //     $scope.show = false
          //   }

          //   $scope.portfolioname = localStorage.getItem("portfolioname");
          //   if (portfolioname == "USSMALLSTOCKS"){

          //   }
          //   console.log(portfolioname,"..nameport")



          // }
          
        })
        .error(function (data, status, header, config) {
          console.log(data);
        });
    };

  
    $scope.getSubscriberSignals = function () {
      var searchParams = new URLSearchParams($window.location.search);
      var portfolioId = searchParams.get("id");
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

    $scope.sharePercentageChart = function(chart_data) {
 
      // Extract stocks and allocated values
        var stocks = chart_data.map(function(item) {
          return item.stock;
      });
      var allocated_values = chart_data.map(function(item) {
          return item.allocated_value;
      });
    
      // Define the data for the pie chart
      var data = [{
          values: allocated_values,
          labels: stocks,
          marker: {
              'colors': [
                  'rgb(0, 204, 0)',  
                  'rgb(215, 11, 11)' 
              ]
          },
          domain: {column: 0},
          hoverinfo: 'label+percent+name',
          hole: 0.4,
          type: 'pie'
      }];
      
      // Define the layout with increased size
      var layout = {
          title:{
            text: 'Allocation Values',
          font: {
            size: 24,              // Font size of the title
            color: '#FFA500'       // Color of the title text
        }
      },
          annotations: [
              {
                  font: {
                      size: 18,
                      color: '#237D97' // Color of the title text
                  },
                  
                  showarrow: false,
                  text: '',
                  x: 0.17,
                  y: 0.5
              }
          ],
          showlegend: false,
          grid: {rows: 1, columns: 1},
          // Increase height and width
          height: 350,  // Increased height
          width: 350,   // Increased width
          // Set background colors
          paper_bgcolor: "#132935", // Set the background color of the entire graph
          plot_bgcolor: "#132935",  // Set the background color of the plot area
          
      };
    
      // Plot the chart
      Plotly.newPlot('sharePerDiv', data, layout);
     
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

    $scope.addAPIDetails = function (data) {

      $("#addAPIModal").modal('show')
      }

    $scope.onaddAPISubmit = function (data) {
        $scope.imLoading = true
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
              $scope.imLoading = false
              alert("Saved Successfully")
              $("#addAPIModal").modal('hide')
              // $("#igUserDetaiDiv").removeClass('d-none')
              // $("#igUserFormDiv").addClass('d-none')
              
              
            })
            .error(function (data, status, header, config) {
              alert(data.data)
              $scope.imLoading = false
              $("#addAPIModal").modal('hide')
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

    $scope.getSubscriberTranscation = function () {
      $scope.imLoading = true
      var searchParams = new URLSearchParams($window.location.search);
      let portfolioId = searchParams.get("id");
      var customerId = localStorage.getItem("customer_Id");
      // customer_Id
    
      
      var urlconfig = {
        headers: {
          "Content-Type": "application/json;",
        },
      };
      $http
        .get(
          ($scope.url =
            config.baseurl + `stockdata/get-robot-transaction/?subscriber_id=${portfolioId}&robot=alpaca`),
          urlconfig
        )
        .success(function (response, status, headers, config) {
          $scope.transactionData  = response.data;
          console.log( $scope.transactionData ,"...transaction")
          $scope.portfoliostocks = $scope.stockData ;
          $scope.stockvalue = true ;
          $scope.analysisgraph($scope.transactionData);
          // $scope.profitloss($scope.transactionData);
          // $scope.winratechart($scope.transactionData);
    
          // $scope.analysisgraph($scope.transactionData);
          $scope.imLoading = false
          
        })
        .error(function (data, status, header, config) {
          // debugger
          $scope.imLoading = false
          console.log(data);
        });
    };


    $scope.analysisgraph = function(data) {
      debugger;
      let dataindex = []; // This will hold the dates
      let portfolioroi = [];
  
      let totalprofit = 0;
      let finalamount = 0;
      let investmentAmount = parseFloat(localStorage.getItem('investment_amount'));
  
      for (let i = 0; i < data.length; i++) {
          if (data[i].profitloss >> 0) {
              totalprofit = totalprofit + data[i].profitloss;
              finalamount = investmentAmount + totalprofit;
              let roi = ((finalamount - investmentAmount) / investmentAmount) * 100;
              dataindex.push(data[i].datetime); // Assuming the x-axis should be the datetime
              portfolioroi.push(roi);
          }
      }
  
      var fig = {};
  
      fig.data = [
          {
              x: dataindex,
              y: portfolioroi,
              type: 'scatter',
              mode: 'lines+markers',
              marker: { color: '#237D97', size: 4 },
              name: 'Portfolio ROI',
              hoverinfo: 'x+y',
              hovertemplate: 'Date: %{x}<br>ROI: %{y:.2f}%<extra></extra>'
          }
      ];
  
      fig.layout = {
          responsive: true,
          autosize: true,
          margin: { l: 50, r: 50, b: 100, t: 100, pad: 4 },
          paper_bgcolor: '#132935',
          plot_bgcolor: '#132935',
          showlegend: true,
          legend: { x: 0, y: 1, font: { color: '#237D97' } },
          title: { text: 'Stock ROI', font: { color: '#FFA500' } },
          xaxis: {
              title: { text: 'Date', font: { color: '#FFA500' } },
              tickfont: { color: '#237D97' },
              type: 'category', // Assuming dataindex are categorical labels
              automargin: true
          },
          yaxis: {
              title: { text: 'ROI', font: { color: '#FFA500' } },
              tickfont: { color: '#237D97' },
              automargin: true
          }
      };
  
      Plotly.newPlot('analysisgraph', fig.data, fig.layout);
      
  };

  
  $scope.closeModal = function(modalId) {

    $("#"+modalId).modal("hide");
    $("#addstock")
  }


    }

);