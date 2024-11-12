app.controller('portfolioDetail', function ($scope, $http, $window, $location, config) {

    $scope.baseurl = config.baseurl;
    console.log(config)
  
    $scope.init = function (req, res) {
      console.log("portfolioDetail");
      console.log(config.baseurl);
     
  
      $scope.portfolioList()
      $scope.portfolioStockList()
      $scope.getUserPortfolioDetail()
    }
    $scope.currentPage = 1; // Current page number
    $scope.itemsPerPage = 3; // Number of items per page

   

    $scope.portfolioList = function (req, res) {
      $http
        .get($scope.baseurl + "modelportfolio/featured")
        .success(function (res) {
          if (res.status == "false") {
            
          } else {
            // $scope.mangoes = res;
            $scope.dataset = res.data;

            // Calculate the starting index and ending index for the last three items
            var startIndex = Math.max($scope.dataset.length - 3, 0);
            var endIndex = $scope.dataset.length;

            // Calculate the number of pages
            $scope.totalPages = Math.ceil($scope.dataset.length / $scope.itemsPerPage);

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

    $scope.getUserPortfolioDetail = function (req, res) {
      
      var data = {};
      var searchParams = new URLSearchParams($window.location.search);
      var portfolioId = searchParams.get('id');
      data.myportfolioId = portfolioId;

      console.log(data);
      var urlconfig = {
        headers: {
          "Content-Type": "application/json;",
        },
      };
      $http
        .post(
          $scope.url =
          config.baseurl  +  "modelportfolio/featured",
          data,
          urlconfig
        )
        .success(function (response, status, headers, config) {
          $scope.portfolioDetails = response.data;
          // if ($scope.portfolioDetails.portfolio_enddate) {
          //     $scope.portfolioDetails.portfolio_enddate = new Date(parseInt($scope.portfolioDetails.portfolio_enddate)).toISOString();
          // }
          $scope.enddate = $scope.portfolioDetails.portfolio_enddate
          var durationInMilliseconds = $scope.enddate - $scope.portfolioDetails.portfolio_startdate;

          // Calculate the duration in days
          var durationInDays = durationInMilliseconds / (1000 * 60 * 60 * 24);

          // Store the duration in your scope variable
          $scope.duration = durationInDays;
          var dateObj = new Date($scope.enddate);

          // Extract year, month, and day components
          var year = dateObj.getFullYear();
          var month = String(dateObj.getMonth() + 1).padStart(2, '0');  // Month is zero-based
          var day = String(dateObj.getDate()).padStart(2, '0');

          // Format the components into yyyy-mm-dd format
          $scope.formattedEndDate = year + '-' + month + '-' + day;
          
          localStorage.setItem('portfolioname', response.data.portfolio_name);



          console.log($scope.portfolioDetails);

          // $scope.getportfolio($scope.portfolioDetails.id);
          // $scope.gettransactions($scope.portfolioDetails.id);
        
          // $scope.userportfolioaftercalculation($scope.portfolioDetails.id);
          $scope.getStockSignals(response.data.portfolio_name);
          $scope.analysisgraph($scope.portfolioDetails);
          $scope.winratechart($scope.portfolioDetails.total,$scope.portfolioDetails.win);
          // $scope.profitlossbymyportfolioid($scope.portfolioDetails.id);

        })
        .error(function (data, status, header, config) {
          // debugger
          console.log(data);
        });
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
debugger
    $scope.portfolioStockList = function () {
      debugger
      var searchParams = new URLSearchParams($window.location.search);
      var portfolioId = searchParams.get('id');
      $http
        .get($scope.baseurl + "modelportfolio/stocks/" + portfolioId)
        .success(function (res) {
          if (res.status == "false") {
          } else {
            $scope.portfoliostocks = res.data;
            //console.log($scope.portfoliostocks);
            debugger
            //console.log($scope.stockData)

            $('#example').DataTable();
          }
        })
        .error(function () {});
    };
    debugger
    //$scope.portfolioStockList();

    $scope.goToPortfolioPage = function(portfolioId) {
      var portfolioUrl = 'portfolio.html?id=' + portfolioId;
      // Navigate to the Portfolio page
      location.href = portfolioUrl;
    };


    $scope.analysisgraph = function(data) {
    dataindex = [];
    dataclose = [];

    for (let i = 0; i < data.portfolioroi.length; i++) {
        dataindex.push(i); // Assuming the x-axis should be the index
        dataclose.push(data.portfolioroi[i]);
    }

    var fig = {};

    fig.data = [
        {
            x: dataindex,
            y: dataclose,
            smoothness: 1.3,
            line_smoothing: 1.3,
            mode: 'line+marker',
            marker: { color: "#143443", size: 1 },
            name: 'Portfolio Roi'
        }
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

    fig.layout.title = 'Portfolio ROI';

    Plotly.newPlot('analysisgraph', fig.data, fig.layout);
};

$scope.signals = [
      {
        symbol: "AAPL",
        portfolio_name: "Tech",
        signals: "Buy",
        close: 150.0,
        datetime: "23-8-23",
        profitloss: 20.0,
        tp1: 155.0,
        tp2: 160.0,
        tp3: 165.0,
        lp1: null,
        lp2: null,
        lp3: null,
      },
      {
        symbol: "GOOGL",
        portfolio_name: "Tech",
        signals: "Sell",
        close: 2800.0,
        datetime: "24-8-23",
        profitloss: -30.0,
        tp1: null,
        tp2: null,
        tp3: null,
        lp1: 2850.0,
        lp2: 2900.0,
        lp3: 2950.0,
      },
    ];

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
          // debugger

          // $scope.getportfolio($scope.portfolioDetails.id);
          // $scope.gettransactions($scope.portfolioDetails.id);
          // $scope.profitlossbymyportfolioid($scope.portfolioDetails.id);
          // $scope.userportfolioaftercalculation($scope.portfolioDetails.id);
          // $scope.analysisgraph($scope.stockSignals);
        })
        .error(function (data, status, header, config) {
          console.log("Error status:", status);
          console.log("Error data:", data);
          console.log(data);
        });
    };

  $scope.subscribe = function(req, res) {
    var searchParams = new URLSearchParams($window.location.search);
    var portfolioId = searchParams.get('id');
    const subscribeId = portfolioId;
    localStorage.setItem('subscribe-id', subscribeId);

    // Navigate to the login page
    // this.router.navigate(['fresh/login.html']);
    location.href = "/app/login.html";
  }

  $scope.login = function(req, res) {
    location.href = "/app/login.html";
  }
    
  
    $scope.logout = function (req, res) {
      localStorage.clear();
      location.href = "app/login.html";
    };
  });