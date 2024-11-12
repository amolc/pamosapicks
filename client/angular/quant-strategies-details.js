app.controller(
  "quant-strategies-details",
  function ($scope, $http, $window, $location, config) {
    $scope.baseurl = config.baseurl;
    console.log(config);


    $scope.init = function (req, res) {
      $scope.getportfoliostratiges()
    };

  
$scope.getportfoliostratiges= function() {
  $scope.imLoading = true

    var urlconfig = {
        headers: {
          "Content-Type": "application/json;"
        },
      };
      

      $http
        .get( $scope.baseurl + "modelportfolio/get-all-strategy-portfolio/"  , urlconfig)
        .success(function (data, status, headers, config) {
          console.log("++++data++++++", data)
          $scope.portfolioStrategy = data.data ;
          $scope.imLoading = false

        })
        .error(function (data, status, header, config) {
          console.log(data);
          $scope.imLoading = false
        });

}

    $scope.logout = function (req, res) {
      localStorage.clear();
      location.href = "index.html";
    };
  }
);
