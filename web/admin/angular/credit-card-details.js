
app.factory('variable', function() {
  return {
    modulename: "backtesting",
  };
})


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
            $("#menu").load("menu-demo.html"); 
        }       
        $("#modals").load("modals.html"); 
      
      
        $("#general").addClass("active"); 
        $("#modelcategory").addClass("active"); 
        
        $scope.name = localStorage.getItem("name");
        $scope.email = localStorage.getItem('email');
        $scope.phone = localStorage.getItem("phone");
        // $scope.getCustomerdemoBalance( $scope.customerId);
        // $scope.getCustomerliveBalance( $scope.customerId);


        // $scope.getmodelportfolio();
        console.log("init else loop");
        $scope.tenure = localStorage.getItem("tenure");

        // $scope.data.tenure = localStorage.getItem("tenure");
        console.log($scope.tenure,"tenure...." )

      }
    };

    
    

    

   

    



    $scope.subscribe = function (data) {
      
      // location.href = "payment-confirmation.html";
      $scope.data.whatsapp = localStorage.getItem("whatsapp");
         $scope.data.telegram = localStorage.getItem("telegram");
         $scope.data.portfolio_name = localStorage.getItem("portfolioname");
         $scope.data.org_id = localStorage.getItem("org_id");
         $scope.data.customer_name = localStorage.getItem("name");
         $scope.data.portfolio_name = localStorage.getItem("portfolio_name");
         $scope.data.cost = localStorage.getItem("cost");
         $scope.data.email = localStorage.getItem("email");
         $scope.data.customer_id = localStorage.getItem("customer_id");
         $scope.data.plan_name = localStorage.getItem("plann");
         var today = new Date();
        //  $scope.data.enddate = localStorage.getItem("enddate");

         $scope.tenure = localStorage.getItem("tenure");

        //  debugger
 
         if ($scope.tenure == "12"){
           $scope.data.enddate = new Date(new Date().setDate(today.getDate() + 365));
           
         }
         if ($scope.tenure == "6"){
          $scope.data.enddate = new Date(new Date().setDate(today.getDate() + 180));
          
         }
         if ($scope.tenure == "4"){
          $scope.data.enddate = new Date(new Date().setDate(today.getDate() + 120));
         }
         if ($scope.tenure == "1"){
          $scope.data.enddate = new Date(new Date().setDate(today.getDate() + 30));
         }
         if ($scope.tenure == "0"){
          $scope.data.enddate = new Date(new Date().setDate(today.getDate() + 7));
         }

         
         var urlconfig = {
          headers: {
            "Content-Type": "application/json;"
          },
        };



      $http
           .post($scope.baseurl +  "stockdata/subscribePortfolio", $scope.data, urlconfig)
           .success(function (response, status, headers, config) {
            // debugger
             $scope.loading = false;
             $scope.msg = response.msg ; 
             $scope.data = response.data ;
             console.log(response.data)
             $("#personaldetails").modal('hide');
             $("#subscribe1").modal("show");
             
             
             
   
           })
           .error(function (data, status, header, config) {
             console.log(data);
            //  debugger
             $("#getportfolio-issue").modal("show");
           });


      
    }

    
    

    $scope.cdetails = function (carddata) {
      
      $("#subscribe").modal('hide');
      $("#personaldetails").modal("show");
      $scope.creditcard = carddata
    }




      $scope.dashboard = function (req, res) {
        
        location.href = "/app/";
      };



      // $scope.submitcreateformupdated = function (data) {
      //   $scope.loading = true;
      //   console.log($scope.data,"....userdetails data")
      //   $scope.data["customer_name"] = $scope.data.name
      //   var today = new Date();

      //    var urlconfig = {
      //      headers: {
      //        "Content-Type": "application/json;",
      //      },
      //    };
      //    $scope.data.tenure = $scope.tenure
 
      //    if ($scope.tenure == "12"){
      //      $scope.data.cost = 300
      //      $scope.data.plan_name = "Yearly"
      //      $scope.data.enddate = new Date(new Date().setDate(today.getDate() + 360));
           
      //    }
      //    if ($scope.tenure == "6"){
      //     $scope.data.cost = 200
      //     $scope.data.plan_name = "Half Yearly"
      //     $scope.data.enddate = new Date(new Date().setDate(today.getDate() + 180));
          
      //    }
      //    if ($scope.tenure == "4"){
      //     $scope.data.cost = 150
      //     $scope.data.plan_name = "Quarterly"
      //     $scope.data.enddate = new Date(new Date().setDate(today.getDate() + 120));
      //    }
      //    if ($scope.tenure == "0"){
      //     $scope.data.cost = 0
      //     $scope.data.plan_name = "Free"
      //     $scope.data.enddate = new Date(new Date().setDate(today.getDate() + 29));
      //    }
      //    console.log($scope.data) ;
         
      //   //  debugger
      //    $http
      //      .post($scope.baseurl +  variable.modulename  + "/subscribePortfolio", $scope.data, urlconfig)
      //      .success(function (response, status, headers, config) {
            
      //        $scope.loading = false;
      //        $scope.msg = response.msg ; 
      //        $scope.data = response.data ;
      //        console.log(response.data)
      //        $("#personaldetails").modal('hide');
      //        $("#subscribe1").modal("show");
      //        // alert("Your subscribed successfully!");
      //        // debugger
 
      //        // url = "myinvestment-detail.html?myportfolioId=" + response.data.id
      //        // url = "ready-portfolio.html"
      //        // console.log(url)
 
      //        // $window.location.href = url;
             
             
   
      //      })
      //      .error(function (data, status, header, config) {
      //        console.log(data);
      //        $("#getportfolio-issue").modal("show");
      //      });
      //  };
        


   
  }
);
