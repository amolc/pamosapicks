app.controller('productetfCtrl', function($scope, $http, $window, config) {

    var vm = this;
    var register = this;

    $scope.data = {}

    $scope.baseurl = config.baseurl;
    console.log($scope.baseurl)
    const urlParams = new URLSearchParams($window.location.search);
    $scope.modelportfolioId = urlParams.get('modelportfolioId') || 1;

    $scope.init = function (req, res) {

        $scope.getmodelportfolio($scope.modelportfolioId);
        $scope.getportfoliostocks($scope.modelportfolioId);
    }

    $scope.getmodelportfolio = function(modelportfolioId) {
        var data = {}
        data.modelportfolioId = modelportfolioId ;
      
        console.log(data);
          var urlconfig = {
              headers: {
                "Content-Type": "application/json;"
              },
            };
            
  
            $http
              .get( $scope.baseurl + "modelportfolio/" + $scope.modelportfolioId , urlconfig)
              .success(function (data, status, headers, config) {
              
                $scope.portfolioDetails = data.data ;
                
                $scope.portfolioDetails.portfolio_startDate = new Date($scope.portfolioDetails.portfolio_startDate);
                // $scope.portfolioDetails.stockdataId = 1;
                // console.log( $scope.portfolioDetails.stockdataId)
                console.log(data.data);
              })
              .error(function (data, status, header, config) {
                console.log(data);
               
              });
      
      }


   

    $scope.getportfoliostocks = function(modelportfolioId) {
        var data = {}
        data.modelportfolioId = modelportfolioId ;
      
        console.log(data);
          var urlconfig = {
              headers: {
                "Content-Type": "application/json;"
              },
            };
            
    
            $http
              .get( $scope.baseurl + "modelportfolio/stocks/" + $scope.modelportfolioId , urlconfig)
              .success(function (data, status, headers, config) {  
                $scope.portfoliostocks = data.data ;
                $scope.portfolioname = data.data[0].modelportfolio_name ;
              })
              .error(function (data, status, header, config) {
                console.log(data);
              });
      
      }


    //orderCtrl ends
});