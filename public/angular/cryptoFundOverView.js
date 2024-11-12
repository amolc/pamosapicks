app.controller(
  "cryptoFundOverView",
  function ($scope, $http, $window, $location, config) {
    $scope.baseurl = config.baseurl;

    var searchParams = new URLSearchParams($window.location.search);
    $scope.strategy  = searchParams.get("strategy");

    $scope.init = function (req, res) {
      $scope.portfolioStocksData()
      $scope.roiPer = 0;
    };
    const  portfolio_name = "CRYPTOFUND"
    
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
          $scope.portfolioData = response.analysis_data
          $scope.stocks = response.stocks;
          $scope.analysisgraph(response.analysis_data)
          $scope.sharePercentageChart(response.chart_data)
          $scope.imLoading = false;
        })
        .error(function (data, status, header, config) {
          $scope.imLoading = false;
          console.log(data.data);
        });

      }


      $scope.sharePercentageChart = function(chart_data) {

        // Extract stocks and allocated values
        var stocks = chart_data.map(function(item) {
            return item.stock;
        });
        var allocated_values = chart_data.map(function(item) {
            return item.allocatedvalue;
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
              color: '#237D97'       // Color of the title text
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

