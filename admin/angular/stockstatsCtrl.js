app.controller('stockstatsCtrl', function($scope, $http, $window,$location, config) {

    $scope.baseurl = config.baseurl ;

    $scope.logout = function (req, res) {
            localStorage.clear();
            location.href = "index.html";
          };

    $scope.init = function(req, res) {
         console.log("stockCtrl");
         console.log(config.baseurl);
         var islogin = localStorage.getItem("islogin");

         if (islogin != "1") {
                location.href = "index.html";
              }else{
               $scope.name = localStorage.getItem("name");
                 $scope.customerId = localStorage.getItem("customerId");
                 console.log($scope.customerId);

                  $scope.getstockstatsdata();

              }

    }


    $scope.getstockstatsdata = function(){
      var data = {}
      var urlconfig = {
          headers: {
            "Content-Type": "application/json;"
          },
        };
        $scope.url = $scope.baseurl + "stockdata/stockdataByStats"
        console.log( $scope.url)
        $http
          .get( $scope.url , data, urlconfig)
          .success(function (response, status, headers, config) {
            $scope.dataset = response.data ;
           
          
          })
          .error(function (data, status, header, config) {
            console.log("error in getting the data");
          });

    }




});