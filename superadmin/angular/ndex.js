app.controller(
  "welcomectrl",
  function ($scope, $http, $window, $location, config) {
    $scope.baseurl = config.baseurl;
    $scope.logout = function (req, res) {
      localStorage.clear();
      location.href = "index.html";
    };

    $scope.portfolioId = 1;
    
    $scope.init = function (req, res) {
      console.log("welcomectrl");
      console.log(config.baseurl);
      var islogin = localStorage.getItem("islogin");

      if (islogin != "1") {
        location.href = "index.html";
      } else {
        $scope.customerId = localStorage.getItem("customerId");
        if( $scope.customerId == 1){
            $("#menu").load("menu-admin.html"); 
        }else{
            $("#menu").load("menu-welcome.html"); 
        }        
        // $("#menu").load("menu.html"); 
        $("#general").addClass("active"); 
        $("#modelcategory").addClass("active"); 
        $scope.categorylist();
        $scope.name = localStorage.getItem("name");
        $scope.email = localStorage.getItem('email');
        $scope.phone = localStorage.getItem("phone");
      }
    };

    $scope.openlink = function (pagename) {
        console.log(pagename);
        window.location.href = pagename ;
    }


    
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
      $scope.createportfolio.name = $scope.name ;
      $scope.createportfolio.email = $scope.email;
      $scope.createportfolio.phone_number = $scope.phone;
      $scope.createportfolio.portfolio_id = portfolioId;
      $scope.createportfolio.portfolio_name = portfolio_name;
      $scope.createportfolio.portfolio_startdate = new Date();
      $scope.createportfolio.promocode = 0;
      console.log(  $scope.createportfolio)

      $("#categorylist").addClass("ng-hide");
      $("#createportfolio").removeClass("ng-hide");
      $("#intro").addClass("ng-hide");
    };

    $scope.submitcreateform = function (data) {
      console.log(data);

      var urlconfig = {
        headers: {
          "Content-Type": "application/json;",
        },
      };

      $http
        .post($scope.baseurl + "roboportfolio/createUserSignalPortfolio", data, urlconfig)
        .success(function (response, status, headers, config) {
          $scope.msg = response.msg;


          $("#success").modal("show");
          console.log(response.data);
         
          
          localStorage.setItem("signalportfolio_id",response.data.id );
          localStorage.setItem("portfolio_name",response.data.portfolio_name );
          localStorage.setItem("signalportfolio_id",response.data.id  );
          localStorage.setItem("category_id",response.data.portfolio_id );
         
          $window.location.href = 'signalportfolio_detail.html';


        })
        .error(function (data, status, header, config) {
          console.log(data);
          $("#getportfolio-issue").modal("show");
        });
    };

        


   
  }
);
