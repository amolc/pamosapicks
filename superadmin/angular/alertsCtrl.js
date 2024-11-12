app.controller('alertsCtrl', function($scope, $http, $window,$location, config) {

    $scope.baseurl = config.baseurl ;

    $scope.logout = function (req, res) {
            localStorage.clear();
            location.href = "index.html";
          };

    $scope.init = function(req, res) {
         console.log("brokerCtrl");
         console.log(config.baseurl);
         var islogin = localStorage.getItem("islogin");

         if (islogin != "1") {
                location.href = "index.html";
              }else{
               $scope.name = localStorage.getItem("name");
                 $scope.customerId = localStorage.getItem("customerId");
                 console.log($scope.customerId);

                  $scope.getsignalsdata();

              }

    }


    $scope.getsignalsdata = function(){
      var data = {}
      var urlconfig = {
          headers: {
            "Content-Type": "application/json;"
          },
        };
        
        $scope.url = $scope.baseurl + "adx/sendallsignals"
        console.log( $scope.url)
        $http
          .get( $scope.url , data, urlconfig)
          .success(function (response, status, headers, config) {
            $scope.dataset = response.signaldata ;
            console.log($scope.dataset)
          
          })
          .error(function (data, status, header, config) {
            console.log("error in getting the data");
          });

    }




});