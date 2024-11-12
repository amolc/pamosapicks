app.controller(
  "robotsctrl",
  function ($scope, $http, $window, $location,$interval,$timeout, config) {
    $scope.baseurl = config.baseurl;
    $scope.logout = function (req, res) {
      localStorage.clear();
      location.href = "index.html";
    };

    $scope.portfolioId = 1;
    
    $scope.init = function (req, res) {
      console.log("robotsctrl");
      console.log(config.baseurl);

      var islogin = localStorage.getItem("islogin");

      if (islogin != "1") {
        location.href = "index.html";
      } else {
        $scope.customerId = localStorage.getItem("customerId");
        if( $scope.customerId == 1){
            $("#menu").load("menu-admin.html"); 
        }else{
            $("#menu").load("menu.html"); 
        }
        // $("#menu").load("menu.html"); 
        $("#general").addClass("active"); 
        $("#modelcategory").addClass("active"); 
        
        $scope.name = localStorage.getItem("name");
        $scope.email = localStorage.getItem('email');
        $scope.phone = localStorage.getItem("phone");
        console.log($scope.customerId);
        
        $("#createportfolio").addClass("hideblock");
        $("#createportfolio").fadeOut("slow");
        $("#intro").fadeIn("slow");
        $("#categorylist").fadeIn("slow");

        $scope.categorylist();
        console.log("init else loop");
      }
    };

    $scope.categorylist = function (req, res) {
      $http.get(config.baseurl + 'modelportfolio/')
      .success(function(res) {
          if (res.status == 'false') {} else {
              $scope.dataset = res.data;
              console.log('dataset: ', $scope.dataset);
          }
      }).error(function() {});
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

      // $("#categorylist").removeClass("showblock");
      $("#categorylist").fadeOut("slow");
      $("#intro").fadeOut("slow");
      $("#createportfolio").fadeIn("slow");   
      $("#intro").addClass("hideblock");
      $("#categorylist").addClass("hideblock");
      console.log("fadeout completed");
      console.log(  $scope.createportfolio)
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
         
          
          
          localStorage.setItem("portfolio_name",response.data.portfolio_name );
          localStorage.setItem("myportfolio_id",response.data.id  );
          localStorage.setItem("category_id",response.data.portfolio_id );
         
           $window.location.href = 'portfolio_detail.html';


        })
        .error(function (data, status, header, config) {
          console.log(data);
          $("#getportfolio-issue").modal("show");
        });
    };

        


   
  }
);
