app.controller('stocklistCtrl', function($scope, $http, $window,$location, config) {

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

                  $scope.list();

              }

    }


    $scope.list = function(req, res) {
      $http.get(config.baseurl + 'stockdata/')
          .success(function(res) {
              if (res.status == 'false') {} else {
                  $scope.dataset = res.data;
                 
                  
                  console.log('dataset: ', $scope.dataset);
              }
          }).error(function() {});
  }


  $scope.add = function(req, res) {

      console.log($scope.data);
      console.log("add")

      if ($scope.data.id != "") {
          $scope.url = config.baseurl + 'stockdata/' + $scope.data.id  ;
          console.log($scope.url);
          $http.patch($scope.url , $scope.data)
              .success(function(res) {
                  if (res.status == 'false') {} else {
                      $scope.response = res.data;
                      console.log('message: ', $scope.response);
                      $scope.list();
                  }
              }).error(function() {});
      }else {
          console.log($scope.data);
          $http.post(config.baseurl + 'stockdata/' , $scope.data)
          .success(function(res) {
              if (res.status == 'false') {} else {
                  $scope.response = res.data;
                  console.log('message: ', $scope.response);

                  $scope.list();
              }
          }).error(function() {});

      }
     

  }


  $scope.update = function(id) {
      $http.get(config.baseurl + 'stockdata/' + id)
          .success(function(res) {
              if (res.status == 'false') {} else {
                  $scope.data = res.data;
                  $scope.data.starttime = new Date(res.data.starttime);
                  $scope.data.endtime = new Date(res.data.endtime);

                  console.log('data: ', $scope.data);
              }
          }).error(function() {});
         
         
  }

  $scope.delete = function(id) {
      $http.delete(config.baseurl + 'stockdata/' + id)
          .success(function(res) {
              if (res.status == 'false') {} else {
                  $scope.response = res.data;
                  console.log('data: ', $scope.response);
              }
          }).error(function() {});
          $scope.list();
          $window.location.reload();
     
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