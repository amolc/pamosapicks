app.controller(
    "cartCtrl",
    function ($scope, $http, $window, $location, config) {
       
        $scope.init = function () {
            $scope.baseurl = config.baseurl;
            console.log(config);
        };
            
 }); 
  