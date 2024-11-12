app.controller(
  "globalFund-2",
  function ($scope, $http, $window, $location, config) {
    $scope.baseurl = config.baseurl;


    $scope.init = function (req, res) {
      $scope.portfolioStocksData()
      $scope.latestSignals()
      $scope.roiPer = 0;
    };
    let  portfolio_name = "GLOBALFUND"
    
    $scope.portfolioStocksData = function() {
      $scope.imLoading = true;
        var urlconfig = {
          headers: {
            "Content-Type": "application/json;",
          },
        };
        $http
        .get(
          ($scope.url =
            config.baseurl + `simpleincome/get-portfolio-details/?portfolio_name=${portfolio_name}`),
          urlconfig
        )
        .success(function (response, status, headers, config) {
          $scope.stocks = response.stocks;
          console.log("stocks",$scope.stocks);
          console.log("chart_data",response.chart_data);
          console.log("analysis_data",response.analysis_data);
          $scope.analysisgraph(response.analysis_data)
          $scope.imLoading = false;
        })
        .error(function (data, status, header, config) {
          $scope.imLoading = false;
          console.log(data.data);
        });

      }



    

      $scope.analysisgraph = function (data) {
        dataindex = [];
        dataclose = [];
      
        for (let i = 0; i < data.portfolioroi.length; i++) {
          dataindex.push(i); // Assuming the x-axis should be the index
          dataclose.push(data.portfolioroi[i]);
        }

        let lastValue = data.portfolioroi[data.portfolioroi.length - 1];
        $scope.roiPer = lastValue
      
        var fig = {};
      
        fig.data = [
          {
            x: dataindex,
            y: dataclose,
            smoothness: 1.3,
            line_smoothing: 1.3,
            mode: "line+marker",
            marker: { color: "#237D97", size: 4 },
            name: "Portfolio Roi",
          },
        ];
      
        fig.layout = {
          responsive: true,
          autosize: true,
          margin: {
            l: 50,
            r: 50,
            b: 100,
            t: 100,
            pad: 4,
          },
          paper_bgcolor: "#132935", // Set the background color of the entire graph
          plot_bgcolor: "#132935",  // Set the background color of the plot area
          showlegend: true,         // Show the legend
          legend: { 
            x: 0, 
            y: 1,
            font: {
              color: "#237D97" // Color of the legend text
            }
          },
          title: {
            text: "Portfolio ROI",
            font: {
              color: "#237D97" // Color of the title text
            }
          },
          xaxis: {
            title: {
              text: 'Index', // You can change this to your specific x-axis label
              font: {
                color: "#237D97" // Color of the x-axis title
              }
            },
            tickfont: {
              color: "#237D97" // Color of the x-axis tick labels
            }
          },
          yaxis: {
            title: {
              text: 'ROI', // You can change this to your specific y-axis label
              font: {
                color: "#237D97" // Color of the y-axis title
              }
            },
            tickfont: {
              color: "#237D97" // Color of the y-axis tick labels
            }
          }
        };
      
        Plotly.newPlot("analysisgraph", fig.data, fig.layout);
      };


      $scope.latestSignals = function() {
        var urlconfig = {
          headers: {
            "Content-Type": "application/json;",
          },
        };
        $http
        .get(
          ($scope.url =
            config.baseurl + `simpleincome/get-latest-vwap-signals/?portfolio_name=${portfolio_name}`),
          urlconfig
        )
        .success(function (response, status, headers, config) {
          $scope.signals = response.data
          console.log(response.data, "===response.data===");
        })
        .error(function (data, status, header, config) {
          console.log(data.data);
        });
  
      }
  
  }
);

