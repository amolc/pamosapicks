app.controller('robot-detail-ctrl', function($scope, $http, $window, $location, $sce, $timeout, store, config) {

    $scope.baseurl = config.baseurl;
    const urlParams = new URLSearchParams($window.location.search);

    let deviation = null;
    let timing = null;
    const stock = urlParams.get('stock');
    const source = urlParams.get('source');
    const portfolioId = urlParams.get('portfolioId');
    const robot = urlParams.get('robot');
    deviation = urlParams.get('deviation');
    timing = urlParams.get('timing');

    $scope.width = window.innerWidth; 
    $scope.stock = stock ;
    $scope.source = stock ;
    console.log(stock);
    console.log(source);
    stock.toUpperCase();
    source.toUpperCase();
    
    
  
    $scope.init = function (req, res) {
        console.log("robot-details-ctrl");
        console.log(config.baseurl);

        if (deviation == null ){deviation = 0.7} ;
        if (timing == null ){timing = 1 } ;

        $scope.data = {}
        $scope.data.stock = stock ;
        $scope.data.source = source ;
        $scope.data.length = 5000 ;
        $scope.data.interval = timing ;
        $scope.data.qty = 1 ;
        $scope.data.deviationfactor = deviation ;
        $scope.showDiv1Flag = true;
        $scope.showDiv2Flag = false;
        // $scope.backtest(portfolioId)
        $scope.getStockSignals(stock,source,portfolioId);
        
      };


      $scope.getStockSignals = function (stock,source,portfolioId) {
        console.log($scope.url =
          config.baseurl + `stockdata/stockanalysis/?stock=${stock}&source=${source}&portfolioId=${portfolioId}`,".....")
          var urlconfig = {
          headers: {
            "Content-Type": "application/json;",
          },
        };

        
        $http
          .get(
            ($scope.url =
              config.baseurl + `stockdata/stockanalysis/?stock=${stock}&source=${source}&portfolioId=${portfolioId}&robot=${robot}`),
            urlconfig
          )
          .success(function (response, status, headers, config) {
            $scope.signals = response.signals;
            $scope.analysisgraph(response.signals);
             $scope.profitloss(response.signals);
            //  $scope.winratechart(response.signals  );
            // console.log("-----signals---",$scope.signals);
          })
          .error(function (data, status, header, config) {
            console.log(data);
          });
      };

    // Initial state of the div

    $scope.showDiv1 = function() {
      $scope.showDiv1Flag = true;
      $scope.showDiv2Flag = false;
    }
    
    $scope.showDiv2 = function() {
      $scope.showDiv1Flag = false;
      $scope.showDiv2Flag = true;
    }


    $scope.backtest = function(portfolioId) {
        $scope.imLoading = true;

        $http.get(config.baseurl + `stockdata/get-stock-analysis/?stock=${stock}&source=${source}&portfolioId=${portfolioId}&robot=${robot}`)
            .success(function(res) {
              // $scope.winratechart(res.data.total, res.data.win);
                  $scope.analysisgraph(res.signals);
                  $scope.imLoading = false;
                  // $scope.df = res.df ;
                  // $scope.sf = res.sf ;
                  // $scope.tf = res.tf ;
                  
                  // $scope.total_profit = res.total_profit ;
                 
                  // $scope.total_trades = res.total_trades ;
                  // $scope.winrate = res.winrate ;

                  // console.log('tf: ', res.tf);
                  // console.log('stats: ', res.stats);
                  // $scope.stats = res.stats;

                // $scope.profitloss(res.sf);
                // $scope.winratechart($scope.total_trades ,  $scope.winrate  );

                  
            }).error(function() {});
      }
    


      $scope.profitloss = function (data) {

        data = data.reverse();

        xarray = []
        profitloss = []

        // var data = JSON.parse(response.data)
      
        var i = 0;
        var winrate = 0
        $scope.total = 0;
        


        for (i; i < data.length; i += 1) {
            
            xarray.push(i);
            profitloss.push(data[i]["profitloss"]);
            $scope.total += data[i]["profitloss"];
           if (data[i]["profitloss"] > 0 ){
              winrate = winrate + 1
            }

         }
        
         $scope.total = data.length ;
         $scope.winrate =winrate ;
         console.log(winrate);

        

        var loserate = data.length - winrate
        var trace1 = {
          x: xarray,
          y: profitloss,
          type: 'bar',
          name: 'Profit Loss',
          marker: {
            color: '#4e8dc9',
            opacity: 0.8,
          }
        };
        
        var data = [trace1];
        
        var layout = {
          title: 'Profitloss Report',
          xaxis: {
            tickangle: -45
          },
          barmode: 'group',
          showlegend: false,
          responsive:true
        };
        
        Plotly.newPlot('profitlossdiv', data, layout);
        $scope.winratechart($scope.total , $scope.winrate );
        
      };

      $scope.winratechart = function (totaltrades,winrate) {

        console.log("winrate chart");
        console.log(totaltrades);
        console.log(winrate);

      //  Lets draw the pie-chart
        var loserate = totaltrades - winrate
        console.log(loserate);
        $scope.winratepercentage = winrate/totaltrades * 100 ;



        var data = [{
          values: [winrate, loserate],
          labels: ['Winrate', 'Loserate' ],
          marker: {'colors': [
            'rgb(0, 204, 0)',  
            'rgb(215, 11, 11)' 
           ]},
          domain: {column: 0},
          name: 'Winrate',
          hoverinfo: 'label+percent+name',
          hole: .4,
          type: 'pie'
        }];
        
        var layout = {
          title: 'Winrate',
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


        Plotly.newPlot('winratediv', data, layout );
   
      }

    
      $scope.analysisgraph = function(data) {
        dataindex = [];
        benchmarkindex = [];
        portfolioroi = [];
        benchmarkroi = [];
    
        for (let i = 0; i < data.length; i++) {
            dataindex.push(data[i].end_datetime); // Assuming the x-axis should be the index
            portfolioroi.push(data[i].portfolioroi);

        }
    
    
        // for (let i = 0; i < data; i++) {
        //     console.log(i)
        //     benchmarkindex.push(i); // Assuming the x-axis should be the index
        //     console.log(data.benchmarkroi[i])
        //     benchmarkroi.push(data.benchmarkroi[i]);
        // }
    
        var fig = {};
    
        fig.data = [
            {
                x: dataindex,
                y: portfolioroi,
                smoothness: 1.3,
                line_smoothing: 1.3,
                mode: 'line+marker',
                marker: { color: "#143443", size: 1 },
                name: data.portfolio_name
            }
            // ,
            // {
            //     x: benchmarkindex,
            //     y: benchmarkroi,
            //     smoothness: 1.3,
            //     line_smoothing: 1.3,
            //     mode: 'line+marker',
            //     marker: { color: "red", size: 1 },
            //     name: data.benchmark
            // }
        ];
    
        fig.layout = {
            responsive: true,
            autosize: true,
            margin: {
                l: 50,
                r: 50,
                b: 100,
                t: 100,
                pad: 4
            },
            paper_bgcolor: '#fff',
            plot_bgcolor: '#fcfcfc',
            showlegend: true, // Show the legend
            legend: { x: 0, y: 1 } // You can adjust the position of the legend
        };
    
        fig.layout.title = 'Stock ROI';
    
        Plotly.newPlot('analysisgraph', fig.data, fig.layout);
    };




     
    
    
});
