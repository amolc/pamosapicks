app.controller(
  "usetfFund",
  function ($scope, $http, $window, $location, config) {
    $scope.baseurl = config.baseurl;
    
    var searchParams = new URLSearchParams($window.location.search);
    $scope.strategy  = searchParams.get("strategy");

    $scope.init = function (req, res) {
      $scope.portfolioStocksData()
      $scope.latestSignals()
      $scope.roiPer = 0;
    };
    const  portfolio_name = "USETFFUND"
    
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
            config.baseurl + `simpleincome/get-portfolio-details/?portfolio_name=${portfolio_name}&strategy_name=${$scope.strategy}`),
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


      $scope.latestSignals = function() {

        if ($scope.strategy == "Vwap") {
          var url_path = 'get-latest-vwap-signals'
        }
        else if ($scope.strategy == "StandardDeviation") {
          var url_path = 'get-latest-signals'
        }



        var urlconfig = {
          headers: {
            "Content-Type": "application/json;",
          },
        };
        $http
        .get(
          ($scope.url =
            config.baseurl + `simpleincome/${url_path}/?portfolio_name=${portfolio_name}`),
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
  

      $scope.analysisgraph = function (data) {
        let dataindex = []; // This will now hold the dates
        let dataclose = [];
      
        // Assuming data.dates is an array of dates corresponding to each portfolio ROI value
        for (let i = 0; i < data.portfolioroi.length; i++) {
            dataindex.push(data.portfoliodate[i]); // Add dates to the x-axis
            dataclose.push(data.portfolioroi[i]);
        }
        
        let lastValue = data.portfolioroi[data.portfolioroi.length - 1];
        $scope.roiPer = lastValue;
      
        var fig = {};
      
        fig.data = [
            {
                x: dataindex, // Now this contains dates
                y: dataclose,
                type: "scatter",
                mode: "lines+markers",
                marker: { color: "#237D97", size: 4 },
                name: "Portfolio ROI",
                hoverinfo: "x+y", // Display both x and y values on hover
                hovertemplate: "Date: %{x}<br>ROI: %{y:.2f}<extra></extra>" // Custom hover text
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
                    text: 'Date', // Updated x-axis label
                    font: {
                        color: "#237D97" // Color of the x-axis title
                    }
                },
                tickformat: "%Y-%m-%d", // Format for the date
                tickfont: {
                    color: "#237D97" // Color of the x-axis tick labels
                },
                type: 'date', // Specify the type as date
                automargin: true // Ensure labels fit within the margins
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
                },
                automargin: true // Ensure labels fit within the margins
            }
        };
      
        Plotly.newPlot("analysisgraph", fig.data, fig.layout);
    };
  }
);

