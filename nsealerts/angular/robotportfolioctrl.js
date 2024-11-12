app.controller('robotportfolioctrl', function($scope, $http, $window,$location, config) {

    $scope.baseurl = config.baseurl ;

    $scope.init = function(req, res) {
         console.log("brokerCtrl");
         console.log(config.baseurl);
         var islogin = localStorage.getItem("islogin");


        //  if (islogin != "1") {
        //         location.href = "index.html";
        //       }else{
        //        $scope.name = localStorage.getItem("name");
        //          $scope.customerId = localStorage.getItem("customerId");
        //         console.log($scope.customerId);
        //          $scope.getportfolio($scope.customerId);

        //       }

    }



    $scope.getportfolio = function(customerId){
        var data = {}
        data.customer_id = customerId ;


          var config = {
              headers: {
                "Content-Type": "application/json;"
              },
            };

            $http
              .post( $scope.baseurl + "roboportfolio/getinitialportfolio", data, config)
              .success(function (data, status, headers, config) {
                $scope.dataset = data.data ;
              })
              .error(function (data, status, header, config) {
                console.log(data);
              });

    }



         $scope.logout = function (req, res) {
            localStorage.clear();
            location.href = "index.html";
          };







});