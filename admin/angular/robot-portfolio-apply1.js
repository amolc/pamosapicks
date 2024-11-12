
app.factory('variable', function() {
  return {
    modulename: "roboportfoliolive",
    bankmodule: "livebank",

  };
})

app.controller('loadController',['$scope',function($scope){
  $scope.$on('LOAD',function(){
    
    $scope.loading=true;
    $("#loader").modal("show");
  
  });
  $scope.$on('UNLOAD',function(){
    $scope.loading=false;
    $("#loader").modal("show");
  
  });
}])

app.controller(
  "robot-portfolio-apply-ctrl",
  function ($scope, $http, $window, $location,$interval,$timeout, config,variable) {
    $scope.baseurl = config.baseurl;


    const urlParams = new URLSearchParams($window.location.search);
    $scope.modelportfolioId = urlParams.get('modelportfolioId') || 1;

  
    $scope.logout = function (req, res) {
      localStorage.clear();
      location.href = "index.html";
    };

   
    
    $scope.init = function (req, res) {
      console.log("robotsctrl");
      console.log(config.baseurl);

      var islogin = localStorage.getItem("islogin");

      if (islogin != "1") {
        location.href = "index.html";
      } else {
        $scope.customerId = localStorage.getItem("customerId");
        if( $scope.customerId == 1){
            $("#menu").load("../menu-admin.html"); 
        }else{
            $("#menu").load("./menu.html"); 
        }       
        $("#modals").load("modals.html"); 
        $("#general").addClass("active"); 
        $("#modelcategory").addClass("active"); 

        
        $scope.name = localStorage.getItem("name");
        $scope.email = localStorage.getItem('email');
        $scope.phone = localStorage.getItem("phone");
        $scope.tenure = localStorage.getItem("tenure");
        $scope.capital = localStorage.getItem("capital");
       
        console.log("initfunction");
        console.log($scope.tenure );
        console.log($scope.capital);


        $scope.getmodelportfolio();

      }
    };


    $scope.getmodelportfolio = function() {
     
  
      var urlconfig = {
          headers: {
            "Content-Type": "application/json;"
          },
        };
        

        $http
          .get( $scope.baseurl + "modelportfolio/" + $scope.modelportfolioId , urlconfig)
          .success(function (response, status, headers, config) {  
          
            $scope.data = response.data ;
            $scope.data.name = localStorage.getItem("name");
            $scope.data.email = localStorage.getItem('email');
            $scope.data.phone = localStorage.getItem("phone");
            $scope.data.capital = localStorage.getItem("capital");
            $scope.data.tenure = localStorage.getItem("tenure");
            if( $scope.data.tenure == 1){
              $scope.data.fundingrequired = 0
              $scope.data.fundingamount = 0 
              $scope.data.fundingtenure = 0
            }
          
    
          })
          .error(function (data, status, header, config) {
            console.log(data);
          });
  
  }



    $scope.submitcreateform = function (data) {
        
  
        var urlconfig = {
          headers: {
            "Content-Type": "application/json;",
          },
        };
        
        console.log($scope.data) ;
        $scope.$emit('LOAD')
        $http
          .post($scope.baseurl +  variable.modulename  + "/createuserportfolio", data, urlconfig)
          .success(function (response, status, headers, config) {
            $scope.msg = response.msg ; 
            $scope.data = response.data ;
            console.log(response.data)
            $scope.$emit('UNLOAD');
            $("#portfolioconfirm").modal("show");
  
          })
          .error(function (data, status, header, config) {
            console.log(data);
            $("#getportfolio-issue").modal("show");
          });
      };

   
  }
);
