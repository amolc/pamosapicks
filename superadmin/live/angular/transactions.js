app.factory('variable', function() {
  return {
    modulename: "roboportfoliolive",
    bankmodule: "livebank",

  };
})

app.controller('transactions-ctrl', function($scope, $http, $window,$location, config,variable) {

    $scope.baseurl = config.baseurl ;

    $scope.init = function(req, res) {
         console.log("brokerCtrl");
         console.log(config.baseurl);
         var islogin = localStorage.getItem("islogin");


         if (islogin != "1") {
                location.href = "index.html";
              }else{
               $scope.name = localStorage.getItem("name");
               $scope.customerId = localStorage.getItem("customerId");
               if( $scope.customerId == 1){
                   $("#menu").load("menu-admin.html"); 
               }else{
                   $("#menu").load("./menu.html"); 
               }       
               // $("#menu").load("menu.html"); 
               $("#general").addClass("active"); 
               $("#modelcategory").addClass("active"); 
               $scope.name = localStorage.getItem("name");
               $scope.email = localStorage.getItem('email');
               $scope.phone = localStorage.getItem("phone");
               
               $scope.getCustomerBalance($scope.customerId);
               $scope.getCustomerfinanceinfo($scope.customerId);
 
              
                  $scope.gettransactions($scope.customerId);

              }

    }

    $scope.getCustomerBalance = function (customerId) {
      console.log(customerId)
      $scope.data = {}
      $scope.data.customerId = customerId
      console.log($scope.data )
      $scope.getbalanceurl = $scope.baseurl + variable.bankmodule +"/getCustomerBalance" ;
      console.log($scope.getbalanceurl);
      $http.post($scope.getbalanceurl ,$scope.data)
        .success(function (response, status) {
          $scope.balancedata = response.data
          console.log($scope.balancedata.cash_balance);
          $scope.bankbalance = $scope.balancedata.cash_balance
         
          console.log($scope.tradebalance);
          console.log($scope.leveragebalance);
  
        })
        .error(function (erroresponse, status) {
          console.log(erroresponse)
          return NaN ;
        });
     
  
    };

  $scope.getCustomerfinanceinfo = function (customerId) {

      console.log(customerId)
      $scope.data = {}
      $scope.data.customerId = customerId
      console.log($scope.data )
      $scope.getbalanceurl = $scope.baseurl + variable.bankmodule + "/getCustomerfinanceinfo" ;
      console.log($scope.getbalanceurl);
      $http.post($scope.getbalanceurl ,$scope.data)
        .success(function (response, status) {
          $scope.financeinfo = response
          console.log($scope.financeinfo)
        })
        .error(function (erroresponse, status) {
          console.log(erroresponse)
          return NaN ;
        });
    
    };


        $scope.gettransactions = function(customerId){
        var data = {}
        data.customerId = customerId ;
        console.log(data);
          var urlconfig = {
              headers: {
                "Content-Type": "application/json;"
              },
            };

            $http
              .post( $scope.baseurl  + variable.bankmodule +"/getCustomerTransactions", data, urlconfig)
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