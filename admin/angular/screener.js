app.controller('screener-ctrl', function($scope, $http, $window, $location, $sce, $timeout, store, config) {


    
    $scope.data = {}
  
    $scope.init = function (req, res) {
        $scope.name = localStorage.getItem("name");
        console.log("indexctrl");
        console.log(config.baseurl);
        $scope.backtest = { "stock": "AAPL", "source": "NASDAQ"}
        $scope.list();
         
      };


    $scope.list = function(req, res) {
        $http.get(config.baseurl + 'stockdata/')
            .success(function(res) {
                if (res.status == 'false') {} else {
                    $scope.dataset = res.data;
                    console.log('dataset: ', $scope.dataset);
                }
            }).error(function() {});
    }


    $scope.backtestrobot = function(backtest) {
        console.log(backtest)
        // debugger
        location.href = "robot-detail.html?stock=" + backtest.stock  + "&source=" + backtest.source ;
    }


   


   
    

   

    
});
