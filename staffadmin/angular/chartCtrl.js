app.controller('chart-ctrl', function ($scope, $http, $window, $location, $interval, config) {

  $scope.baseurl = config.baseurl;
  const urlParams = new URLSearchParams($window.location.search);
  const stock = urlParams.get('stock');
  console.log(stock);
  var stockname = stock.toUpperCase();

  $scope.logout = function (req, res) {
    localStorage.clear();
    location.href = "index.html";
  };

  $scope.init = function (req, res) {

    console.log("brokerCtrl");
    console.log(config.baseurl);
    var islogin = localStorage.getItem("islogin");
    $scope.backtest();
    if (islogin != "1") {
      location.href = "index.html";
    } else {
      $scope.customerId = localStorage.getItem("customerId");
      $("#menu").load("menu-admin.html"); 
      $("#menu").load("menu.html"); 
      $("#general").addClass("active"); 
      $("#modelcategory").addClass("active"); 
      $scope.name = localStorage.getItem("name");
      $scope.stockdetails(stockname);
     
    
     
    }
  }
  

  $scope.stockdetails = function(stockname) {
    console.log("stockdetails called")
    $http.get(config.baseurl + 'stockdata/details/' + stockname, $scope.data)
        .success(function(res) {
            if (res.status == 'false') {} else {
                $scope.stockdetails = res.data;
                console.log('data: ', $scope.data);
              
            }
        }).error(function() {});
  }



  $scope.onedit = function (data) {
    console.log(data);
    $scope.data = data;
    console.log($scope.data);
    $("#editform").modal("show");
  };



  $scope.onstartrobot = function (data) {
    console.log(data);
    $scope.data = data;
    console.log($scope.data);
    $("#startrobot").modal("show");
  };

  $scope.onsubmit  = function (data) {
        
    $scope.data = data
    console.log($scope.data);
    console.log("updateform")
    $scope.update($scope.data);
    $("#editform").modal("hide");
  };

  $scope.update = function(data) {
    console.log(config.baseurl + 'stockdata/' + data.id)
    $http.patch(config.baseurl + 'stockdata/' + data.id, $scope.data)
        .success(function(res) {
            if (res.status == 'false') {} else {
              $scope.stockdetails = res.data;
              console.log('data: ', $scope.stockdetails);
              
            }
        }).error(function() {});
}




// $scope.backtest = function(data) {
//   $http.post(config.baseurl + 'stockdata/backtest', data)
//       .success(function(res) {
//           if (res.status == 'false') {} else {
            

//             $scope.df = res.df ;
//             $scope.sf = res.sf ;
//             $scope.tf = res.tf ;
//             $scope.total_trades = res.total_trades ;
//             $scope.total_profit = res.total_profit ;
//             $scope.winrate = res.winrate ;

//                     console.log('sf: ', res.sf);
         
            
//           }
//       }).error(function() {});
// }


$scope.backtest = function(data) {
 

  $http.post(config.baseurl + 'stockdata/backtest',data)
      .success(function(res) {
          if (res.status == 'false') {
           
          } else {
            

            $scope.df = res.df ;
            $scope.sf = res.sf ;
            $scope.tf = res.tf ;
            $scope.total_trades = res.total_trades ;
            $scope.total_profit = res.total_profit ;
            $scope.winrate = res.winrate ;
            $scope.getprofitloss(data);
            $scope.getanalysisdata(data);
           
            console.log('sf: ', res.sf);
           
            
          }
      }).error(function() {});
}



$scope.getprofitloss = function (data) {
  var urlconfig = {
    headers: {
      "Content-Type": "application/json;",
    },
  };
  
 
  $http
    .post(variable.baseurl + "getprofitloss", data, urlconfig)
    .success(function (response, status, headers, config) {
    
      $scope.chart(response) ;
      // 

    })
    .error(function (data) {
      console.log("error")
      console.log(data);

      
    });
};


$scope.getanalysisdata = function (data) {
  var urlconfig = {
    headers: {
      "Content-Type": "application/json;",
    },
  };
  
  console.log(data)

  $http
    .post(variable.baseurl + "graphdata", data, urlconfig)
    .success(function (response, status, headers, config) {
      
     
      $scope.analysisgraph(response) 

    })
    .error(function (data) {
      console.log("error")
      console.log(data);
    });
};














  
});