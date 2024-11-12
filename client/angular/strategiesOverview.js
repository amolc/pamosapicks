app.controller(
  "globalFundOverView",
  function ($scope, $http, $window, $location, config) {
    $scope.baseurl = config.baseurl;

    var searchParams = new URLSearchParams($window.location.search);
    $scope.portfolio_id  = searchParams.get("id");

    $scope.init = function (req, res) {
      $scope.portfolioStocksData()
      $scope.roiPer = 0;
      
    };

    let  dataset = [];
    let  stock = [];
    let  colors = [];
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
            config.baseurl + `modelportfolio/get-strategy-details/?portfolio_id=${$scope.portfolio_id}`),
          urlconfig
        )
        .success(function (response, status, headers, config) {
          console.log(response, "====");
          $scope.portfolioData = response.analysis_data
          $scope.stocks = response.stocks;
          $scope.analysisgraph(response.analysis_data)
          $scope.sharePercentageChart(response.chart_data)
            //  Lets draw the pie-chart
            stock = response.chart_data.map(function(item) {
              return item.stock;
          });
          dataset = response.chart_data.map(function(item) {
              return item.allocatedvalue;
          });
          console.log(dataset);
          let baseColors = ['#9e0142', '#d53e4f', '#f46d43', '#fdae61', '#fee08b', '#e6f598', '#abdda4', ]; // '#66c2a5', '#3288bd', '#5e4fa2'
          colors = baseColors.slice(0, dataset.length);
          // draw();
          $scope.imLoading = false;
        })
        .error(function (data, status, header, config) {
          $scope.imLoading = false;
          console.log(data.data);
        });
       
      }




    $scope.analysisgraph = function (data) {
    
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
    };
    
    
    


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



  
      // const width = document.querySelector('.chart-wrapper').offsetWidth;
      // const height = document.querySelector('.chart-wrapper').offsetHeight;
      // const minOfWH = Math.min(width, height) / 2;
      // const initialAnimDelay = 300;
      // const arcAnimDelay = 150;
      // const arcAnimDur = 3000;
      // const secDur = 800;
      // const secIndividualdelay = 150;
  
      // let radius = (minOfWH > 200) ? 200 : minOfWH;
  
      // // Append svg
      // let svg = d3.select('.chart-wrapper').append('svg')
      //     .attr('width', width)
      //     .attr('height', height)
      //     .attr('class', 'pieChart')
      //     .append('g')
      //     .attr('transform', `translate(${width / 2}, ${height / 2})`);
  
      // // For drawing slices
      // let arc = d3.arc()
      //     .outerRadius(radius * 0.6)
      //     .innerRadius(radius * 0.45);
  
      // // For labels and polylines
      // let outerArc = d3.arc()
      // .innerRadius(radius * 0.75)  // Reduced radius multiplier for shorter lines
      // .outerRadius(radius * 0.75); // Reduced radius multiplier for shorter lines
      // let pie = d3.pie().value(d => d);
  
      // let draw = function() {
      //     svg.append("g").attr("class", "lines");
      //     svg.append("g").attr("class", "slices");
      //     svg.append("g").attr("class", "labels");
      //     // Define slice
      //     let slice = svg.select('.slices')
      //         .datum(dataset)
      //         .selectAll('path')
      //         .data(pie)
      //         .enter().append('path')
      //         .attr('fill', (d, i) => colors[i])
      //         .attr('d', arc)
      //         .attr('stroke-width', '25px')
      //         .attr('transform', (d, i) => 'rotate(-180, 0, 0)')
      //         .style('opacity', 0)
      //         .transition()
      //         .delay((d, i) => (i * arcAnimDelay) + initialAnimDelay)
      //         .duration(arcAnimDur)
      //         .ease(d3.easeElastic)
      //         .style('opacity', 1)
      //         .attr('transform', 'rotate(0,0,0)');
  
      //     slice.transition()
      //         .delay((d, i) => arcAnimDur + (i * secIndividualdelay))
      //         .duration(secDur)
      //         .attr('stroke-width', '5px');
  
      //     let midAngle = d => d.startAngle + (d.endAngle - d.startAngle) / 2;
  
      //     let text = svg.select(".labels").selectAll("text")
      //         .data(pie(dataset))
      //         .enter()
      //         .append('text')
      //         .attr('dy', '0.35em')
      //         .style("opacity", 0)
      //         .style('fill', (d, i) => colors[i]) //text color
      //         .text((d, i) => stock[i]) // pie chart color
      //         .attr('transform', d => {
      //             let pos = outerArc.centroid(d);
      //             pos[0] = radius * (midAngle(d) < Math.PI ? 1 : -1);
      //             return `translate(${pos})`;
      //         })
      //         .style('text-anchor', d => midAngle(d) < Math.PI ? "start" : "end")
      //         .transition()
      //         .delay((d, i) => arcAnimDur + (i * secIndividualdelay))
      //         .duration(secDur)
      //         .style('opacity', 1);
  
      //     let polyline = svg.select(".lines").selectAll("polyline")
      //         .data(pie(dataset))
      //         .enter()
      //         .append("polyline")
      //         .style("opacity", 0.5)
      //         .attr('points', d => {
      //             let pos = outerArc.centroid(d);
      //             pos[0] = radius * 0.95 * (midAngle(d) < Math.PI ? 1 : -1);
      //             return [arc.centroid(d), arc.centroid(d), arc.centroid(d)];
      //         })
      //         .transition()
      //         .duration(secDur)
      //         .delay((d, i) => arcAnimDur + (i * secIndividualdelay))
      //         .attr('points', d => {
      //             let pos = outerArc.centroid(d);
      //             pos[0] = radius * 0.95 * (midAngle(d) < Math.PI ? 1 : -1);
      //             return [arc.centroid(d), outerArc.centroid(d), pos];
      //         });
      // };
  
    
  

  
      

  }
);

