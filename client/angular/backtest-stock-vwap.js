app.controller('robot-detail-ctrl', function($scope, $http, $window, $location, $sce, $timeout, store, config) {

    $scope.baseurl = config.baseurl;
    const urlParams = new URLSearchParams($window.location.search);

    let deviation = null;
    let timing = null;
    const stock = urlParams.get('stock');
    const source = urlParams.get('source');
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
        if (timing == null ){timing = 3 } ;

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
        
      };


    $scope.backtest = function(data) {
        console.log(data)
        $scope.imLoading = true;

        $http.post(config.baseurl + 'stockdata/bollinger-backtest',data)
            .success(function(res) {
                if (res.status == 'false') {
                 
                } else {

                  
                  $scope.imLoading = false;

                  console.log(res);
                  $scope.df = res.df ;
                  $scope.sf = res.sf ;
                  $scope.tf = res.tf ;
                  
                  $scope.total_profit = res.total_profit ;
                 
                  $scope.total_trades = res.total_trades ;
                  $scope.winrate = res.winrate ;


                  console.log('dfdfdfdfdfdfdfdf: ', res.df);
                  // console.log('sf: ', res.sf);
                  console.log('tf: ', res.tf);
                  console.log('stats: ', res.stats);
                  $scope.stats = res.stats ;
                  // debugger
                  console.log('df: ', res.df);


                $scope.profitloss(res.tf);
                $scope.winratechart(res.tf,$scope.total_trades ,$scope.winrate  );
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
            profitloss.push(data[i]["profitloss"]);
            $scope.total += data[i]["profitloss"];

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

  $scope.winratechart = function (data,totaltrades,winratepercentage) {
        //  Lets draw the pie-chart

         
  
          $scope.winratepercentage = winratepercentage ;
  
          var lossrate = 0 ;
          var i = 0
  
          for (i; i < data.length; i += 1) {
              
            if (data[i]["profitloss"] < 0){
              console.log("Loss");
              lossrate = lossrate + 1 ;
              console.log(lossrate)
            }
            
  
          }
  
          var winrate = totaltrades - lossrate
          console.log(winrate)
  
  
  
          var data = [{
            values: [winrate, lossrate],
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


    $scope.analysisgraph = function (data) {
        
          dataindex = []
          datadatetime = []
          dataprice = []
          datavwap = []
          dataupperregression = []
          datalowerregression = []
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
              datadatetime.push(data[i]["datetime"]);
              dataprice.push(data[i]["price"]);
              datavwap.push(data[i]["vwap"]);
              dataupperregression.push(data[i]["upperregression"]);
              datalowerregression.push(data[i]["lowerregression"]);
              databuy.push(data[i]["buy"]);
              databuyclose.push(data[i]["buyclose"]);
              datasell.push(data[i]["sell"]);
              datasellclose.push(data[i]["sellclose"]);
          
            }
         
     
          var fig = {}
    
            fig.data = [
          {
            x: datadatetime,
            y: dataprice,
            smoothness :1.3,
            line_smoothing:1.3,
            mode: 'line+marker',
            marker: {color: "grey",size: 1 },
            name: 'close'
          },
  
          {
            x: datadatetime,
            y: datavwap,
            smoothness :1.3,
            line_smoothing:1.3,
            mode: 'line+marker',
            marker: {color: "blue",size: 1 },
            name: 'middle'
          },
  
          {
            x: datadatetime,
            y: databuy,
            mode: 'markers',
            type: 'scatter',
            name: 'Buy',
            text: databuy,
            marker: {color: "green",size: 9 },
          },
          {
            x: datadatetime,
            y: databuyclose,
            mode: 'markers',
            type: 'scatter',
            name: 'Buy Close',
            text: databuyclose,
            marker: {color: "brown",size: 9 },
          },
          {
            x: datadatetime,
            y: datasell,
            mode: 'markers',
            type: 'scatter',
            name: 'Sell',
            text: datasell,
            marker: {color: "red",size: 9 },
          },
          {
            x: datadatetime,
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
