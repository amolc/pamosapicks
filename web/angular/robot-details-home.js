app.controller('robotdetails-ctrl', function ($scope, $http, $window, $location, $interval, config) {

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
  
  
  
  
     
  
  
  
  
  
  
  
  $scope.backtest = function(data) {
    $http.post(config.baseurl + 'stockdata/backtest', data)
        .success(function(res) {
            if (res.status == 'false') {} else {
              
  
              $scope.df = res.df ;
              $scope.sf = res.sf ;
              $scope.tf = res.tf ;
              $scope.total_trades = res.total_trades ;
              $scope.total_profit = res.total_profit ;
              $scope.winrate = res.winrate ;
  
              // console.log('df: ', res.df);
              console.log('sf: ', res.sf);
              // console.log('total_trades: ', res.total_trades);
              // console.log('winrate: ', res.winrate);
              // console.log('total_profit: ', res.total_profit);
              
            }
        }).error(function() {});
  }
  
  
  $scope.startalpaca = function (data) {
    console.log(data);
    $scope.data = data;
    console.log($scope.data);
    $("#startalpaca").modal("show");
  };
  
  
  $scope.alpacasubmit = function(data) {
      data["customerId"] = $scope.customerId ;
  
      $http.post(config.baseurl + 'stockdata/savealpacarobot', data)
          .success(function(res) {
              if (res.status == 'false') {
                console.log("data is not saved")
              } else {
                console.log("data is saved.")
              }
          }).error(function() {});
      
  }
  
  
  $scope.startig = function (data) {
    console.log(data);
    $scope.data = data;
    console.log($scope.data);
    $("#startig").modal("show");
  };
  
  
  $scope.igsubmit = function(data) {
      data["customerId"] = $scope.customerId ;
  
      $http.post(config.baseurl + 'stockdata/saveigrobot', data)
          .success(function(res) {
              if (res.status == 'false') {
                console.log("issue with saving the ig data")
              } else {
                console.log("data is saved.")
              }
          }).error(function() {});
      
  }
  
  $scope.startaliceblue = function (data) {
    console.log(data);
    $scope.data = data;
    console.log($scope.data);
    $("#startaliceblue").modal("show");
  };
  
  
  $scope.alicebluesubmit = function(data) {
      data["customerId"] = $scope.customerId ;
  
      $http.post(config.baseurl + 'stockdata/savealicebluerobot', data)
          .success(function(res) {
              if (res.status == 'false') {
                console.log("issue with saving the ig data")
              } else {
                console.log("data is saved.")
              }
          }).error(function() {});
      
  }
  
   
  });