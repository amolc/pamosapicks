app.controller(
    'logout-ctrl', function($scope, $http, $window,$location, config) {
    console.log(config.baseurl);


   
    $scope.logout = function (req, res) {
        localStorage.clear();
        location.href = "../index.html";
      };


});