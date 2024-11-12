app.controller(
  "customerList",
  function ($scope, $http, $window, $location, config) {
    $scope.baseurl = config.baseurl;
    $scope.wssurl = config.wssurl;
    console.log(config);

    $scope.init = function (req, res) {
      $scope.show = false
      
      
      var islogin = localStorage.getItem("islogin");
      if (islogin != "1") {
        location.href = "login.html";
      } 

      

      $scope.getCustomerList();

    };

    $scope.getCustomerList = function () {
      var urlconfig = {
        headers: {
          "Content-Type": "application/json;",
        },
      };
      $http
        .get(
          ($scope.url =
            config.baseurl + `customer/get-all-customers/`),
          urlconfig
        )
        .success(function (response, status, headers, config) {
          
          console.log(response.data)
          $scope.allCustomerList = response.data;

          
        })
        .error(function (data, status, header, config) {
          console.log(data);
        });
    };


}

);

