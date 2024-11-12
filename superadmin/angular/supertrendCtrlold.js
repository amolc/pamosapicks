app.controller('supertrendCtrl', function($scope, $http, $window, $timeout , $interval,config) {

    console.log(config)
    $scope.baseurl = config.baseurl;


    // $scope.data = {'stock': ETHUSD}
    const queryString = window.location.search;
    console.log(queryString);
    const urlParams = new URLSearchParams(queryString);
    const stock = urlParams.get('stock');
    console.log(stock);
    stockdata = stock.toUpperCase();

    $scope.charturl =  $scope.baseurl + "adx/supertrendchart?name=" + stockdata + "&format=json"
    console.log($scope.charturl)
    $scope.datasetOverride = [
                              { label: "close",type: 'line', fill: false,borderColor: "#8e5ea2",tension: 0.7,pointColor : "#000",pointStrokeColor : "#fff",radius:0},
                                {
                                label: "negative",
                                type: 'line',
                                fill: false,
                                borderColor: "#F72119",
                                tension: 0.7,
                                pointColor : "#000",
                                pointStrokeColor : "#fff",
                                radius:0
                              },
                              {
                                label: "positive",
                                type: 'line',
                                fill: false,
                                borderColor: "#136207",
                                tension: 0.7,
                                pointColor : "#000",
                                pointStrokeColor : "#fff",
                                radius:0
                              },

                               {
                                label: "highprice",
                                type: 'line',
                                fill: false,
                                borderColor: "#1338BE",
                                tension: 0.7,
                                pointColor : "#000",
                                pointStrokeColor : "#1338BE",
                                radius:1
                              },

                               {
                                label: "buy",
                                type: 'scatter',
                                fill: false,
                                backgroundColor: '#d1001f',
                                pointRadius: 5,

                              },

                              {
                                label: "buyclose",
                                type: 'scatter',
                                fill: false,
                                backgroundColor: '#2E8B57',
                                pointRadius: 5,

                              },



                            ];








    $scope.datachartinit = function(req, res) {
        console.log("AlgoTrading");
        console.log(config.baseurl);

        $http.get($scope.charturl)
                .success(function(res) {
                    if (res.status == 'error') {} else {
                          $scope.dataset = res ;
                         $scope.labels = res.map(function(e) {return e.datetime;});
                         $scope.data1 = res.map(function(e) {return e.close;});
                         $scope.data4 = res.map(function(e) {return e.final_upperband;});
                         $scope.data5 = res.map(function(e) {return e.final_lowerband;});
                         $scope.data6 = res.map(function(e) {return e.highprice;});
                         $scope.data7 = res.map(function(e) {return e.buy;});
                         $scope.data8 = res.map(function(e) {return e.buyclose;});
//                         $scope.data5 = res.map(function(e) {return e.volume;});
                        console.log('$scope.labels: ',   $scope.labels);
                        console.log('$scope.data1: ',   $scope.data1);
                        console.log( $scope.trend)
                        $scope.graphdata = [$scope.data1,$scope.data4,$scope.data5,$scope.data6,$scope.data7,$scope.data8 ];

                    }
                }).error(function() {});
    }

    var datachartinterval = $interval(function () {
        console.log("AlgoTrading after interval");
        console.log($scope.charturl);
        $http.get($scope.charturl)
                 .success(function(res) {
                    if (res.status == 'error') {} else {
                         $scope.data = res ;
                         $scope.labels = res.map(function(e) {return e.datetime;});
                         $scope.data1 = res.map(function(e) {return e.close;});
                         $scope.data4 = res.map(function(e) {return e.final_upperband;});
                         $scope.data5 = res.map(function(e) {return e.final_lowerband;});
                         $scope.data6 = res.map(function(e) {return e.highprice;});
                         $scope.data7 = res.map(function(e) {return e.buy;});
                         $scope.data8 = res.map(function(e) {return e.buyclose;});
                        console.log('$scope.labels: ',   $scope.labels);
                        console.log('$scope.data1: ',   $scope.data1);
                        console.log( $scope.trend)
                        $scope.graphdata = [$scope.data1,$scope.data4,$scope.data5,$scope.data6,$scope.data7,$scope.data8 ];

                    }
                }).error(function() {});
      }, 60000);





});