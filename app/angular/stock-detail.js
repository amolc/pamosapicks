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
        $scope.backtest($scope.data)
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
            console.log("-----signals---",$scope.signals);
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


    $scope.backtest = function(data) {
        $scope.imLoading = true;

        $http.post(config.baseurl + 'stockdata/backtest',data)
            .success(function(res) {
                if (res.status == 'false') {
                 
                } else {

                  
                  $scope.imLoading = false;
                  $scope.df = res.df ;
                  $scope.sf = res.sf ;
                  $scope.tf = res.tf ;
                  
                  $scope.total_profit = res.total_profit ;
                 
                  $scope.total_trades = res.total_trades ;
                  $scope.winrate = res.winrate ;

                  console.log('tf: ', res.tf);
                  console.log('stats: ', res.stats);
                  $scope.stats = res.stats;

                $scope.profitloss(res.sf);
                $scope.winratechart($scope.total_trades ,  $scope.winrate  );
                $scope.analysisgraph(res.df,res.tf);

                  
                }
            }).error(function() {});
      }
    


      $scope.profitloss = function (data) {

        xarray = []
        profitloss = []

        // var data = JSON.parse(response.data);
        
        console.log(data)
      
        var i = 0;
        var winrate = 0
        $scope.total = 0;
        
        for (i; i < data.length; i += 1) {
            
            xarray.push(i);
            profitloss.push(data[i]["profit_loss"]);
            $scope.total += data[i]["profit_loss"];

         }
         $scope.total = Math.round($scope.total*100)/100;
        console.log(winrate)
        var loserate = data.length - winrate
        var trace1 = {
          x: xarray,
          y: profitloss,
          type: 'bar',
          name: 'Primary Product',
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
        
      };

      $scope.winratechart = function (totaltrades,winrate) {
      //  Lets draw the pie-chart
        var loserate = totaltrades - winrate

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

    
      $scope.analysisgraph = function (data,signals) {
        
        dataindex = []
        signalindex = []
        datadatetime = []
        dataclose = []
        dataupper = []
        dataupperTwo = []
        dataupperThree = []
        datamiddle = []
        datalow = []
        datalowTwo = []
        datalowThree = []
        datama = []
        dataema = []
        databuy = []
        databuyclose = []
        datasell = []
        datasellclose = []
        
        i = 0;
        j=0;
       
       
        console.log(data)


        for (i; i < data.length; i += 1) {

            // var dtdate = new moment(response.data[i]['datetime']).format("YYYY-MM-DD HH:MM");
            dataindex.push(data[i]["index"])
            dataclose.push(data[i]["close"]);
            dataupper.push(data[i]["upper"]);
            dataupperTwo.push(data[i]["uppertwo"]);
            dataupperThree.push(data[i]["upperthree"]);
            datamiddle.push(data[i]["middle"]);
            datalow.push(data[i]["lower"]);
            datalowTwo.push(data[i]["lowertwo"]);
            datalowThree.push(data[i]["lowerthree"]);
            datama.push(data[i]["ma"]);
            dataema.push(data[i]["ema"]);
           
        
          }

          for (j;j < signals.length; j += 1) {

           
            // var dtdate = new moment(response.data[i]['datetime']).format("YYYY-MM-DD HH:MM");
        
            signalindex.push(signals[j]["index"])
            databuy.push(signals[j]["buy"]);
            databuyclose.push(signals[j]["buyclose"]);
            datasell.push(signals[j]["sell"]);
            datasellclose.push(signals[j]["sellclose"]);
        
          }
          
       
   
        var fig = {}
  
          fig.data = [
        {
          x: dataindex,
          y: dataclose,
          smoothness :1.3,
          line_smoothing:1.3,
          mode: 'line+marker',
          marker: {color: "grey",size: 1 },
          name: 'close'
        },

        {
          x: dataindex,
          y: datamiddle,
          smoothness :1.3,
          line_smoothing:1.3,
          mode: 'line+marker',
          marker: {color: "blue",size: 1 },
          name: 'middle'
        },

        {
          x: dataindex,
          y: datalow,
          smoothness :1.3,
          line_smoothing:1.3,
          mode: 'line+marker',
          marker: {color: "red",size: 1 },
          name: 'low'
        },

        {
          x: dataindex,
          y: datalowTwo,
          smoothness :1.3,
          line_smoothing:1.3,
          mode: 'line+marker',
          marker: {color: "red",size: 1 },
          name: 'lower 2'
        },

        {
          x: dataindex,
          y: datalowThree,
          smoothness :1.3,
          line_smoothing:1.3,
          mode: 'line+marker',
          marker: {color: "red",size: 1 },
          name: 'lower 3'
        },


        {
          x: dataindex,
          y: dataupper,
          smoothness :1.3,
          line_smoothing:1.3,
          mode: 'line+marker',
          marker: {color: "green",size: 1 },
          name: 'upper'
        },

        {
          x: dataindex,
          y: dataupperTwo,
          smoothness :1.3,
          line_smoothing:1.3,
          mode: 'line+marker',
          marker: {color: "green",size: 1 },
          name: 'upper 2'
        },

        {
          x: dataindex,
          y: dataupperThree,
          smoothness :1.3,
          line_smoothing:1.3,
          mode: 'line+marker',
          marker: {color: "green",size: 1 },
          name: 'upper 3'
        },


        {
          x: signalindex,
          y: databuy,
          mode: 'markers',
          type: 'scatter',
          name: 'Buy',
          text: databuy,
          marker: {color: "green",size: 9 },
        },
        {
          x: signalindex,
          y: databuyclose,
          mode: 'markers',
          type: 'scatter',
          name: 'Buy Close',
          text: databuyclose,
          marker: {color: "brown",size: 9 },
        },
        {
          x: signalindex,
          y: datasell,
          mode: 'markers',
          type: 'scatter',
          name: 'Sell',
          text: datasell,
          marker: {color: "red",size: 9 },
        },
        {
          x: signalindex,
          y: datasellclose,
          mode: 'markers',
          type: 'scatter',
          name: 'Sellclose',
          text: datasellclose,
          marker: {color: "orange",size: 9 },
        }
        
        
      ];
  
      
      fig.config = {responsive:true}
      fig.layout = {
            responsive:true,
            autosize: true,
            margin: {
              l: 50,
              r: 50,
              b: 100,
              t: 100,
              pad: 4
            },
            paper_bgcolor: '#fff',
            plot_bgcolor: '#fcfcfc'
      }
            fig.layout.title = 'Portfolio Buy Sell Analysis';
            Plotly.newPlot('analysisgraph', fig.data, fig.layout, fig.config)
        
      }




     
    
    
});
