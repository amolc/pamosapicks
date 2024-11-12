app.controller(
  "strategySignals",
  function ($scope, $http, $window, $location, config) {
    $scope.baseurl = config.baseurl;

    var searchParams = new URLSearchParams($window.location.search);
    $scope.portfolio_name  = searchParams.get("portfolio");
    $scope.stock  = searchParams.get("stock");


    $scope.init = function (req, res) {
      $scope.portfolioStocksData()
      $scope.StockSignals()
      $scope.roiPer = 0;

    };
    
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
            config.baseurl +`modelportfolio/get-strategy-details/?portfolio_name=${$scope.portfolio_name}`),
          urlconfig
        )
        .success(function (response, status, headers, config) {
          $scope.stocks = response.stocks;
          console.log("stocks",$scope.stocks);
          console.log("chart_data",response.chart_data);
          console.log("analysis_data",response.analysis_data);
          $scope.portfolioData = response.analysis_data
          $scope.analysisgraph(response.analysis_data)
          $scope.imLoading = false;
        })
        .error(function (data, status, header, config) {
          $scope.imLoading = false;
          console.log(data);
          console.log(data.message);
        });

      }



      $scope.StockSignals = function() {
          var urlconfig = {
            headers: {
              "Content-Type": "application/json;",
            },
          };
          $http
          .get(
            ($scope.url =
              config.baseurl +`modelportfolio/get-stock-signals-history/?portfolio_name=${$scope.portfolio_name}&stock=${$scope.stock}`),
            urlconfig
          )
          .success(function (response, status, headers, config) {
            $scope.signals = response.data
            console.log("chart_data",response.data);
            // $scope.portfolioData = response.analysis_data
            // $scope.analysisgraph(response.analysis_data)
          })
          .error(function (data, status, header, config) {
            $scope.imLoading = false;
            console.log(data);
            console.log(data.message);
          });
  
        }
  



    



      $scope.analysisgraph = function (data) {
        $scope.imLoading = true;
        // Arrays to hold portfolio data
        let dataindex = [];
        let dataclose = [];
    
        // Arrays to hold benchmark data
        let benchindex = [];
        let benchclose = [];
    
        let firstPortfolioDate = new Date(data.portfoliodate[0]);
        $scope.portFolioStartDate = firstPortfolioDate;
        // Populate portfolio data
        for (let i = 0; i < data.portfolioroi.length; i++) {
            let currentDate = new Date(data.portfoliodate[i]);
    
            if (currentDate >= firstPortfolioDate) {
                dataindex.push(data.portfoliodate[i]);
                dataclose.push(data.portfolioroi[i]);
            }
        }
    
        // Populate benchmark data starting from the first portfolio date
        for (let i = 0; i < data.benchmarkroi.length; i++) {
            let currentDate = new Date(data.benchmarkdatetime[i]);
    
            if (currentDate >= firstPortfolioDate) {
                benchindex.push(data.benchmarkdatetime[i]);
                benchclose.push(data.benchmarkroi[i]);
            }
        }
    
        // Calculate the duration between the first date and now
        let now = new Date();
        let durationInDays = Math.floor((now - firstPortfolioDate) / (1000 * 60 * 60 * 24));
        $scope.durationInDays = durationInDays;
        let lastPortfolioValue = data.portfolioroi[data.portfolioroi.length - 1];
        $scope.roiPer = lastPortfolioValue;
    
        var fig = {};
    
        fig.data = [
            {
                x: dataindex, // Portfolio data x-axis (dates)
                y: dataclose, // Portfolio data y-axis (ROI)
                type: "scatter",
                mode: "lines+markers",
                marker: { color: "#237D97", size: 4 },
                name: "Portfolio ROI",
                hoverinfo: "x+y", // Display both x and y values on hover
                hovertemplate: "Date: %{x}<br>ROI: %{y:.2f}<extra></extra>" // Custom hover text
            },
            {
                x: benchindex, // Benchmark data x-axis (dates)
                y: benchclose, // Benchmark data y-axis (ROI)
                type: "scatter",
                mode: "lines+markers",
                marker: { color: "#FFA500", size: 4 }, // Orange color for benchmarks
                name: "Benchmark ROI",
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
                text: "Portfolio vs Benchmark ROI",
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
            },
            annotations: [
                {
                    text: `From ${firstPortfolioDate.toLocaleDateString()} to now (${durationInDays} days)`,
                    showarrow: false,
                    align: 'left',
                    x: 0.02,
                    y: 1.05,
                    xref: 'paper',
                    yref: 'paper',
                    font: {
                        size: 12,
                        color: '#FFA500'
                    }
                }
            ]
        };
    
        Plotly.newPlot("analysisgraph", fig.data, fig.layout);
        $scope.imLoading = false;
    };
    



      
      $scope.addNewsLetterCustomer = function() {

        $("#addAPIModal").modal('show')
      }
      $scope.onaddAPISubmit = function (data) {
        $scope.imLoading = true
        data['org_id'] = 1
        data['portfolio_id'] = $scope.portfolio_id
          var urlconfig = {
            headers: {
              "Content-Type": "application/json;",
            },
          };
          $http
            .post(
              ($scope.url =
                config.baseurl + `customer/post-newsletter-customer/`),
                data,
              urlconfig
            )
            .success(function (response, status, headers, config) {
              $scope.imLoading = false
              alert("Saved Successfully")
              $("#addAPIModal").modal('hide')

              
              
            })
            .error(function (data, status, header, config) {
              alert(data.data)
              $scope.imLoading = false
              $("#addAPIModal").modal('hide')
              console.log(data);
            });
          
    }


    $scope.goToRobotSelection = function (portfolioId, portfolio_name) {
      $scope.imLoading = true;

      $scope.data = {}

      localStorage.setItem("portfolioId", portfolioId);
      localStorage.setItem("portfolio_name", portfolio_name);
      
      location.href = "smart-portfolio.html";
      
    }
      
  $scope.closeModal = function(modalId) {

    $("#"+modalId).modal("hide");
  }
  
  $scope.logout = function (req, res) {
    localStorage.clear();
    location.href = "index.html";
  };

  }
);

