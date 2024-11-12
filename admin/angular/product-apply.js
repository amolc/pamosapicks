app.controller(
  "product-apply-ctrl",
  function ($scope, $http, $window, $location,$interval,$timeout, config) {
    $scope.baseurl = config.baseurl;
   
    const urlParams = new URLSearchParams($window.location.search);
    $scope.modelportfolioId = urlParams.get('modelportfolioId');
    console.log( $scope.modelportfolioId );


    $scope.init = function () {
      $("#modals").load("modals.html"); 
      
      $scope.data = {};
      $scope.name = localStorage.getItem("name");
      $scope.email = localStorage.getItem('email');
      $scope.phone = localStorage.getItem("phone");

      $scope.getmodelportfolio($scope.modelportfolioId)
    }
    

    $scope.updatefunding = function (data) {

      $scope.data.fundingamount = data.capital ;

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
            .success(function (response, status, headers, config) {
              
              $scope.data = response.data ;
              console.log(response.data)
              $scope.data.name = localStorage.getItem("name");
              $scope.data.email = localStorage.getItem('email');
              $scope.data.phone = localStorage.getItem("phone");

              $scope.data.fundingrequired = "False" ;
              $scope.data.capital = response.data.capital ;
              $scope.data.fundingamount = 0 ;
              $scope.data.fundingtenure = 0 ;
            })
            .error(function (data, status, header, config) {
              console.log(data);
             
            });
    
    }

    $scope.submitcreateform = function (data) {
      console.log(data);

      var urlconfig = {
        headers: {
          "Content-Type": "application/json;",
        },
      };

      $http
        .post($scope.baseurl + "roboportfolio/createuserportfolio", data, urlconfig)
        .success(function (response, status, headers, config) {
         

          
          $scope.msg = response.msg ;

          $("#success").modal("show");
          // console.log(response.data);
         
          
          
          // localStorage.setItem("portfolio_name",response.data.portfolio_name );
          // localStorage.setItem("myportfolio_id",response.data.id  );
          // localStorage.setItem("category_id",response.data.portfolio_id );
         
          //  $window.location.href = 'portfolio_detail.html';


        })
        .error(function (data, status, header, config) {
          console.log(data);
          $("#getportfolio-issue").modal("show");
        });
    };

        


   
  }
);
