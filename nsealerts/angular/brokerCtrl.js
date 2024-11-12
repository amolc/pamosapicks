app.controller('brokerCtrl', function($scope, $http, $window,$location, config) {

    $scope.baseurl = config.baseurl ;

    $scope.init = function(req, res) {
         console.log("brokerCtrl");
         console.log(config.baseurl);
         var islogin = localStorage.getItem("islogin");


        //  if (islogin != "1") {
        //         location.href = "index.html";
        //       }else{
        //        $scope.name = localStorage.getItem("name");
        //      $scope.customerId = localStorage.getItem("customerId");
        //      console.log($scope.customerId);
        //       }

    }



    $scope.getbrokersetting = function(brokername,customerId){
        var data = {}
        data.customer_id = customerId ;
        console.log(data);

          var config = {
              headers: {
                "Content-Type": "application/json;"
              },
            };

            $http
              .post( $scope.baseurl + "brokeralp/getAlpacaApiKey", data, config)
              .success(function (data, status, headers, config) {
                console.log(data);
                $scope.data = data.data
//                console.log($scope.data['api_key'])
//                console.log($scope.data['api_secret'])
                 $("#alpacasetting").modal("show");
              })
              .error(function (data, status, header, config) {
                console.log(data);
              });

    }

    $scope.setbrokersetting = function(brokername,customerId,data){

           console.log(data);
           data.customer_id = customerId ;
           data.broker_name = brokername ;

          var config = {
              headers: {
                "Content-Type": "application/json;"
              },
            };

            $http
              .post($scope.baseurl + "brokeralp/addUpdateApiKey", data, config)
              .success(function (data, status, headers, config) {
                console.log(data);
                $scope.data = data.data
                 $("#alpacasetting").modal("hide");

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