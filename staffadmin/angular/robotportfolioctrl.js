app.controller(
  "robotportfolioctrl",
  function ($scope, $http, $window, $location, config) {
    $scope.baseurl = config.baseurl;
    $scope.logout = function (req, res) {
      localStorage.clear();
      location.href = "index.html";
    };

    $scope.portfolioId = 1;
    
    $scope.init = function (req, res) {
      console.log("roboctrl");
      console.log(config.baseurl);
      var islogin = localStorage.getItem("islogin");


      if (islogin != "1") {
        location.href = "index.html";
      } else {
        $scope.categorylist();
        $scope.name = localStorage.getItem("name");
        $scope.customerId = localStorage.getItem("customerId");

       
       
        console.log($scope.customerId);
      }
    };

    $scope.categorylist = function (req, res) {
      $http
        .get(config.baseurl + "category/")
        .success(function (res) {
          if (res.status == "false") {
          } else {
            $scope.categoryset = res.data;
            console.log("dataset: ", $scope.categoryset);
            $("#categorylist").removeClass("ng-hide");
            $("#createportfolio").addClass("ng-hide");
          }
        })
        .error(function () {});
    };

    $scope.createportfolioform = function (
      customerId,
      portfolioId,
      portfolio_name
    ) {
      $scope.customerId = customerId;
      $scope.portfolioId = portfolioId;
      $scope.portfolio_name = portfolio_name;

      $scope.createportfolio = {};
      $scope.createportfolio.customer_id = customerId;
      $scope.createportfolio.portfolio_id = portfolioId;
      $scope.createportfolio.portfolio_startdate = new Date();
      
      console.log(  $scope.createportfolio)
      $("#categorylist").addClass("ng-hide");
      $("#createportfolio").removeClass("ng-hide");
    };

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
          $scope.msg = response.msg;


          $("#success").modal("show");
          console.log(response.data);
         
          var myportfolioId = response.data.id ;
          var portfolioId = response.data.portfolio_id ;
          var customerId = response.data.customer_id ;
          var portfolioName = response.data.portfolio_name ;
          var capital = response.data.portfolio_capital ;

          console.log(myportfolioId, portfolioId, customerId, portfolioName,capital)
          localStorage.setItem("portfolioName",portfolioName );
          localStorage.setItem("myportfolioId",myportfolioId );
          localStorage.setItem("portfolioId",portfolioId );
          localStorage.setItem("capital",capital );
          $window.location.href = 'portfolio_detail.html';


        })
        .error(function (data, status, header, config) {
          console.log(data);
          $("#getportfolio-issue").modal("show");
        });
    };




   
  }
);
