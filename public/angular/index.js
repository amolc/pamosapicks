app.controller(
  "publicindexCtrl",
  function ($scope, $http, $window, $location, config) {
    $scope.baseurl = config.baseurl;
    console.log(config);



    $scope.init = function (req, res) {
     
    };


    $scope.baseurl = config.baseurl;


    

  }
);

