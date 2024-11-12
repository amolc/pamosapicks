
app.factory("variable", function () {
  return {
    modulename: "roboportfoliolive",
  };
});

app.directive("sparklinechart", function () {

  return {

      restrict: "E",

      scope: {

          data: "@"

      },

      compile: function (tElement, tAttrs, transclude) {

          tElement.replaceWith("<span>" + tAttrs.data + "</span>");

          return function (scope, element, attrs) {

              attrs.$observe("data", function (newValue) { 
                  console.log(newValue)
                  newValue = newValue.replace("[","");
                  newValue = newValue.replace("]","");
                  var array = newValue.split(",");
                  console.log(array);
                  console.log(typeof array);
                  element.sparkline(array , { type: 'line', width: '96%', height: '100px', 
                  lineWidth:3,
                  changeRangeMin: -10, 
                  chartRangeMax: 10,
                  lineColor:"#90EE90" ,
                  fillColor: false});

              });

          };

      }

  };

});

app.controller(
  "myinvestment-detail-chart-ctrl",
  function ($scope, $http, $window, $location, config, variable) {
    $scope.baseurl = config.baseurl;

    const urlParams = new URLSearchParams($window.location.search);
    $scope.myportfolioId = urlParams.get("myportfolioId");
    console.log($scope.myportfolioId);


    $scope.stock= urlParams.get("stock");
    console.log($scope.stock);


    $scope.charturl = $scope.baseurl + variable.modulename + "/supertrendchart?stock=" + $scope.stock + "&myportfolio_id=" + $scope.myportfolioId;
    $scope.logout = function (req, res) {
      localStorage.clear();
      location.href = "index.html";
    };

    
    $scope.init = function (req, res) {
      console.log("portfoliodetailctrl");
      console.log(config.baseurl);
      var islogin = localStorage.getItem("islogin");

      
        $scope.customerId = localStorage.getItem("customerId");
        $("#modals").load("../modals.html");
        $("#general").addClass("active");
        $("#modelcategory").addClass("active");

        $scope.name = localStorage.getItem("name");
        $scope.email = localStorage.getItem("email");
        $scope.phone = localStorage.getItem("phone");
        // $scope.getCustomerdemoBalance($scope.customerId);

        $scope.getUserPortfolioDetail($scope.myportfolioId);
        $scope.portfoliolist();

        $scope.profitlossbymyportfolioidandStock($scope.stock,$scope.myportfolioId);
        $scope.getdemo_trades_By_MyPortfolioIdandStock($scope.stock,$scope.myportfolioId);
        $scope.getchartData($scope.myportfolioId);
      
        


    };

    $scope.portfoliolist = function (req, res) {
      $scope.customerId = 37 ;
      console.log($scope.customerId);
      $scope.url =
        config.baseurl  +  "roboportfoliolive/getFeaturedRoi" ;
      console.log( $scope.url)
      $http
         .get($scope.url)
         .success(function (res) {
          if (res.status == "false") {
          } else {
            $scope.portfoliolist = res.data;

            for (var i=0; i<res.data.length; i++) {
                  console.log(res.data[i].id)
                 
                 
            }


            console.log("portfoliolist: ", $scope.portfoliolist);
            $("#portfoliolist").removeClass("ng-hide");
          }
        })
        .error(function () { });
    };



    $scope.getUserPortfolioDetail = function (myportfolioId) {
      var data = {};
      data.myportfolioId = $scope.myportfolioId;

      console.log(data);
      var urlconfig = {
        headers: {
          "Content-Type": "application/json;",
        },
      };
      $http
        .post(
          $scope.baseurl + variable.modulename + "/getUserPortfolioDetail",
          data,
          urlconfig
        )
        .success(function (response, status, headers, config) {
          $scope.portfolioDetails = response.data;

          console.log($scope.portfolioDetails);

        })
        .error(function (data, status, header, config) {
          console.log(data);
        });
    };

    // pnldata  - This data needs to be by stock and from the portfolio data

    $scope.profitlossbymyportfolioidandStock = function(stock,myportfolioId) {

      var data = {}
      data.myportfolio_id = myportfolioId ;
      data.stock = stock ;
    
      console.log(data);
        var urlconfig = {
            headers: {
              "Content-Type": "application/json;"
            },
          };
         
          $http
            .post( $scope.baseurl + variable.modulename + "/profitlossbymyportfolioidandstock" , data, urlconfig)
            .success(function (response, status, headers, config) {
              $scope.pnldata = response.data ;
              console.log($scope.pnldata)
            })
            .error(function (responseerror, status, header, config) {
              console.log(responseerror);
            });
    
    }

    $scope.getdemo_trades_By_MyPortfolioIdandStock = function(stock,myportfolioId) {

      var data = {}
      data.stock = stock ;
      data.myportfolio_id = myportfolioId ;
    
      console.log(data);
        var urlconfig = {
            headers: {
              "Content-Type": "application/json;"
            },
          };
          
          $scope.transactionUrl = $scope.baseurl + variable.modulename +  "/getdemo_trades_By_MyPortfolioIdandStock" ;
          $http
            .post($scope.transactionUrl  , data, urlconfig)
            .success(function (response, status, headers, config) {
              $scope.transactionsdata = response.data ;
              console.log($scope.transactionsdata )
            })
            .error(function (data, status, header, config) {
              console.log(data);
              $("#getportfolio-issue").modal('show');
            });
    
    }

    

    $scope.getchartData = function (myportfolio_id) {
      
      $scope.data = {};
      $scope.data.myportfolio_id = myportfolio_id;
      console.log($scope.data);
      console.log($scope.charturl)

      $http
        .get($scope.charturl, $scope.data)
        .success(function (response, status) {
          console.log("#################")
          console.log(response);

          $scope.createplotlygraph(response);
        })
        .error(function (erroresponse, status) {
          console.log(erroresponse);
          return NaN;
        });
    };

    $scope.createplotlygraph = function (response) {
      
      c2 = []
      dtdatetime = []
      slowma = []
      slowanchorma = []
      mediumanchorma = []
      veryslowanchorma = []
      ptrend = []
      ntrend = []

      i = 0;
      for (i; i < response.data.length; i += 1) {
        
          dtdatetime.push(new moment(response.data[i][1]).format("YYYY-MM-DD HH:MM"));
          c2.push(response.data[i][3]);
          slowma.push(response.data[i][7]);
          slowanchorma.push(response.data[i][8]);
          mediumanchorma.push(response.data[i][9]);
          veryslowanchorma.push(response.data[i][10]);
          ptrend.push(response.data[i][11]);
          ntrend.push(response.data[i][12]);
          slowma.push(response.data[i][3]);
          slowanchorma.push(response.data[i][5]);
          mediumanchorma.push(response.data[i][6]);
       }
      sa = 0;
      selldatadate = []
      selldata=[]
      for (sa; sa < response.selldataset.length; sa += 1) { 
          var dtdate = new moment(response.selldataset[sa][0]).format("YYYY-MM-DD HH:MM");
          selldatadate.push(dtdate);
          selldata.push(response.selldataset[sa][1]);
       }
       sc = 0;
       sellclosedatadate = []
       sellclosedata = []
      for (sc; sc < response.sellclosedataset.length; sc += 1) { 
          var dtdate = new moment(response.sellclosedataset[sc][0]).format("YYYY-MM-DD HH:MM");
          sellclosedatadate.push(dtdate);
          sellclosedata.push(response.sellclosedataset[sc][1]);
       }

       ba = 0;
       buydatadate = []
       buydata =[]
      for (ba; ba < response.buydataset.length; ba += 1) { 
          var dtdate = new moment(response.buydataset[ba][0]).format("YYYY-MM-DD HH:MM");
          buydatadate.push(dtdate);
          buydata.push(response.buydataset[ba][1]);
       }
       bc = 0;
       buyclosedatadate =[]
       buyclosedata= []
       for (bc; bc < response.buyclosedataset.length; bc += 1) { 
           var dtdate = new moment(response.buyclosedataset[bc][0]).format("YYYY-MM-DD HH:MM");
           buyclosedatadate.push(dtdate);
           buyclosedata.push(response.buyclosedataset[bc][1]);
        }
 


      var fig = {}

      // dtdatetime.push(new moment(response.data[i][1]).format("YYYY-MM-DD HH:MM"));
      // c2.push(response.data[i][3]);
      // slowma.push(response.data[i][7]);
      // slowanchorma.push(response.data[i][8]);
      // mediumanchorma.push(response.data[i][9]);
      // veryslowanchorma.push(response.data[i][10]);
      // ptrend.push(response.data[i][11]);
      // ntrend.push(response.data[i][12]);
      // slowma.push(response.data[i][3]);
      // slowanchorma.push(response.data[i][5]);
      // mediumanchorma.push(response.data[i][6]);

        fig.data = [
      {
        x: dtdatetime,
        y: c2,
        smoothness :1.3,
        line_smoothing:1.3,
        mode: 'line+marker',
        marker: {color: "#009628",size: 0.6 },
        name: 'close'
      },
      // {
      //   x: dtdatetime,
      //   y: slowma,
      //   smoothness :1.3,
      //   line_smoothing:1.3,
      //   mode: 'line',
      //   marker: {color: "#c763fb",size: 0.7 },
      //   name: 'slowma'
      // },
      // {
      //   x: dtdatetime,
      //   y: slowanchorma,
      //   smoothness :1.3,
      //   line_smoothing:1.3,
      //   mode: 'line+marker',
      //   marker: {color: "#4c90fb",size: 0.7 },
      //   name: 'slowanchorma'
      // },
      {
        x: dtdatetime,
        y: ptrend,
        smoothness :1.3,
        line_smoothing:1.3,
        mode: 'line',
        marker: {color: "#009628",size: 0.8 },
        name: 'ptrend'
      },
      {
        x: dtdatetime,
        y: ntrend,
        smoothness :1.3,
        line_smoothing:1.3,
        mode: 'line',
        marker: {color: "#c763fb",size: 0.9 },
        name: 'ntrend'
      },
      
      
      {
        x: selldatadate,
        y: selldata,
        type: 'scatter',
        mode: 'markers',
        name: 'sell',
        marker: {color: "red",size: 8 }
      },
      {
        x: sellclosedatadate,
        y: sellclosedata,
        type: 'scatter',
        mode: 'markers',
        name: 'sellclose',
        marker: {color: "brown",size: 8 }
      },
      {
        x: buydatadate,
        y: buydata,
        type: 'scatter',
        mode: 'markers',
        name: 'buy',
        marker: {color: "green",size: 8 }
      },
      {
        x: buyclosedatadate,
        y: buyclosedata,
        type: 'scatter',
        mode: 'markers',
        name: 'buyclose',
        marker: {color: "orange",size: 8 }
      }
   
      
    ];

    console.log(fig.data);

    fig.layout = {}

    fig.layout.title = 'Portfolio Tracking';
    
    
    
        
    Plotly.newPlot('myDiv', fig.data, fig.layout);




    }

  
  
  
});
