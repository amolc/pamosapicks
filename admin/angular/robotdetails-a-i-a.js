app.controller('robot-detail-ctrl-a-i-a', function($scope, $http, $window, $location, $sce, $timeout, store, config) {

    $scope.baseurl = config.baseurl;
    const urlParams = new URLSearchParams($window.location.search);
    const stock = urlParams.get('stock');
    const source = urlParams.get('source');
    const deviation = urlParams.get('deviation');
    console.log(stock);
    console.log(source);
    stock.toUpperCase();
    source.toUpperCase();
    
    
  
    $scope.init = function (req, res) {
        console.log("robot-detail-ctrl-a-i-a");
        console.log(config.baseurl);
        $scope.data = {}
        $scope.data.stock = stock ;
        $scope.data.source = source ;
        $scope.data.length = 5000 ;
        $scope.data.interval = 1 ;
        $scope.data.qty = 1 ;
        $scope.data.deviationfactor = 0.7 ;
        $scope.showDiv1Flag = true;
        $scope.showDiv2Flag = false;
        $scope.backtest($scope.data)
        
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
        console.log(data)
        $http.post(config.baseurl + 'stockdata/backtest',data)
            .success(function(res) {
                if (res.status == 'false') {
                 
                } else {
                  
                  $scope.df = res.df ;
                  $scope.sf = res.sf ;
                  $scope.tf = res.tf ;
                  
                  $scope.total_profit = res.total_profit ;
                 
                  $scope.total_trades = res.total_trades ;
                  $scope.winrate = res.winrate ;
                //    $scope.getprofitloss(data);
                //   $scope.getanalysisdata(data);
                //   console.log('sf: ', res.sf);

                  console.log('df: ', res.df);
                  console.log('sf: ', res.sf);
                  console.log('tf: ', res.tf);

                $scope.profitloss(res.sf);
                $scope.winratechart($scope.total_trades ,  $scope.winrate  );
                $scope.analysisgraph(res.df);

                  
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
        
        for (i; i < data.length; i += 1) {
            
            xarray.push(i);
            profitloss.push(data[i]["profit_loss"]);
           
          if (data[i]["profit_loss"] > 0 ){
              winrate = winrate + 1 ;
            }

         }
        
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
        };
        
        Plotly.newPlot('profitlossdiv', data, layout);
        
      };

      $scope.winratechart = function (totaltrades,winrate) {
      //  Lets draw the pie-chart
        var loserate = totaltrades - winrate
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
          height: 300,
          width: 368,
          showlegend: false,
          grid: {rows: 1, colums: 1}
        };
        
        Plotly.newPlot('winratediv', data, layout);
   
      }

    
      $scope.analysisgraph = function (data) {
        
        dataindex = []
        datadatetime = []
        dataclose = []
        datama = []
        dataema = []
        databuy = []
        databuyclose = []
        datasell = []
        datasellclose = []
        
        i = 0;
       
       
        console.log(data)


        for (i; i < data.length; i += 1) {

           
            // var dtdate = new moment(response.data[i]['datetime']).format("YYYY-MM-DD HH:MM");
            dataindex.push(data[i]["index"])
            dataclose.push(data[i]["close"]);
            datama.push(data[i]["ma"]);
            dataema.push(data[i]["ema"]);
            databuy.push(data[i]["buy"]);
            databuyclose.push(data[i]["buyclose"]);
            datasell.push(data[i]["sell"]);
            datasellclose.push(data[i]["sellclose"]);
        
          }
       
   
        var fig = {}
  
          fig.data = [
        {
          x: dataindex,
          y: dataclose,
          smoothness :1.3,
          line_smoothing:1.3,
          mode: 'line+marker',
          marker: {color: "blue",size: 1 },
          name: 'close'
        },

        {
          x: dataindex,
          y: datama,
          smoothness :1.3,
          line_smoothing:1.3,
          mode: 'line+marker',
          marker: {color: "orange",size: 1 },
          name: 'ma'
        },

        {
          x: dataindex,
          y: datama,
          smoothness :1.3,
          line_smoothing:1.3,
          mode: 'line+marker',
          marker: {color: "orange",size: 1 },
          name: 'ma'
        },

        {
          x: dataindex,
          y: databuy,
          mode: 'markers',
          type: 'scatter',
          name: 'Buy',
          text: databuy,
          marker: {color: "green",size: 6 },
        },
        {
          x: dataindex,
          y: databuyclose,
          mode: 'markers',
          type: 'scatter',
          name: 'Buy Close',
          text: databuyclose,
          marker: {color: "brown",size: 6 },
        },
        // {
        //   x: dataindex,
        //   y: datasell,
        //   mode: 'markers',
        //   type: 'scatter',
        //   name: 'Sell',
        //   text: datasell,
        //   marker: {color: "red",size: 6 },
        // },
        // {
        //   x: dataindex,
        //   y: datasellclose,
        //   mode: 'markers',
        //   type: 'scatter',
        //   name: 'Sell',
        //   text: datasellclose,
        //   marker: {color: "orange",size: 6 },
        // }
        
        
      ];
  
    
      fig.config = {responsive: true}
      fig.layout = {
            autosize: true,
            width: 800,
            height: 500,
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
