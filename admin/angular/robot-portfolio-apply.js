
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
        $scope.getCustomerdemoBalance( $scope.customerId);
        $scope.getCustomerliveBalance( $scope.customerId);

        // debugger


        $scope.getmodelportfolio();
        console.log("init else loop");
        $scope.tenure = localStorage.getItem("tenure");

        // $scope.data.tenure = localStorage.getItem("tenure");
        console.log($scope.tenure,"tenture...." )

      }
    };

    
    $scope.getCustomerdemoBalance = function (customerId) {

      console.log(customerId)
      $scope.data = {}
      $scope.data.customerId = customerId
      console.log($scope.data )
      $scope.getbalanceurl = $scope.baseurl + "demobank/getCustomerBalance" ;
      console.log($scope.getbalanceurl);
      $http.post($scope.getbalanceurl ,$scope.data)
        .success(function (response, status) {
          $scope.balancedata = response.data
          console.log($scope.balancedata.cash_balance);
          $scope.demobalance = $scope.balancedata.cash_balance
          $scope.leveragebalance = $scope.tradebalance * 4  
          console.log($scope.tradebalance);
          console.log($scope.leveragebalance);
  
        })
        .error(function (erroresponse, status) {
          console.log(erroresponse)
          return NaN ;
        });
     
  
    };

    $scope.getCustomerliveBalance = function (customerId) {

      console.log(customerId)
      $scope.data = {}
      $scope.data.customerId = customerId
      console.log($scope.data )
      $scope.getbalanceurl = $scope.baseurl + "livebank/getCustomerBalance" ;
      console.log($scope.getbalanceurl);
      $http.post($scope.getbalanceurl ,$scope.data)
        .success(function (response, status) {
          $scope.balancedata = response.data
          console.log($scope.balancedata.cash_balance);
          $scope.livebalance = $scope.balancedata.cash_balance
         
          console.log($scope.tradebalance);
          console.log($scope.leveragebalance);
  
        })
        .error(function (erroresponse, status) {
          console.log(erroresponse)
          return NaN ;
        });
     
  
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
              // debugger
              $scope.data.fundingrequired = "False" ;
              $scope.data.capital = response.data.capital ;
              $scope.data.fundingamount = 0 ;
              $scope.data.fundingtenure = 0 ;
              $scope.data.balance = $scope.demobalance ;
              
      
            })
            .error(function (data, status, header, config) {
              console.log(data);
            });
    
    }

    $scope.updatefunding = function (data) {
      console.log("update funding called...");
     
     

      
      if( data.capital > data.balance ){
        console.log(data.capital);
        console.log(data.balance);
       
           console.log("update funding alert")
           $scope.msg = "You account balance is less. Please add funds."
          
           $("#portfolioconfirm").modal("show");
      }

      $scope.data.fundingamount = data.capital ;

    }



    $scope.subscribe = function (data) {
      localStorage.setItem('whatsapp', data.whatsapp);
      localStorage.setItem('telegram', data.telegram);
      // debugger
      // location.href = "credit-card-details.html";
      location.href =  "payment-confirmation.html";
      // $("#subscribe").modal("show");
      $scope.user_updated_data = data
    }

    
    

    $scope.cdetails = function (carddata) {
      
      $("#subscribe").modal('hide');
      $("#personaldetails").modal("show");
      $scope.creditcard = carddata
    }




    
    // $scope.submitcreateform = function (data) {
    //    $scope.loading = true;
    //    console.log($scope.data,"....userdetails data")
    //    $("#personaldetails").modal('hide');
    //    $("#subscribe1").modal("show");
    //    debugger
  
    //     var urlconfig = {
    //       headers: {
    //         "Content-Type": "application/json;",
    //       },
    //     };
    //     $scope.data.tenure = $scope.tenure

    //     if ($scope.tenure == "12"){
    //       $scope.data.amount = 300
          
    //     }
    //     if ($scope.tenure == "6"){
    //       $scope.data.amount = 200
         
    //     }
    //     if ($scope.tenure == "4"){
    //       $scope.data.amount = 150
    //     }
    //     if ($scope.tenure == "0"){
    //       $scope.data.amount = 0
    //     }
    //     console.log($scope.data) ;
        
    //     // debugger
    //     $http
    //       .post($scope.baseurl +  variable.modulename  + "/createuserportfolio", data, urlconfig)
    //       .success(function (response, status, headers, config) {
           
    //         $scope.loading = false;
    //         $scope.msg = response.msg ; 
    //         $scope.data = response.data ;
    //         console.log(response.data)
    //         $("#subscribe").modal("show");
    //         // alert("Your subscribed successfully!");
    //         // debugger

    //         // url = "myinvestment-detail.html?myportfolioId=" + response.data.id
    //         // url = "ready-portfolio.html"
    //         // console.log(url)

    //         // $window.location.href = url;
            
            
  
    //       })
    //       .error(function (data, status, header, config) {
    //         console.log(data);
    //         $("#getportfolio-issue").modal("show");
    //       });
    //   };


      $scope.dashboard = function (req, res) {
        
        location.href = "/app/";
      };



      $scope.submitcreateformupdated = function (data) {
        $scope.loading = true;
        console.log($scope.data,"....userdetails data")
        $scope.data["customer_name"] = $scope.data.name
        var today = new Date();

         var urlconfig = {
           headers: {
             "Content-Type": "application/json;",
           },
         };
         $scope.data.tenure = $scope.tenure
 
         if ($scope.tenure == "12"){
           $scope.data.cost = 300
           $scope.data.plan_name = "Yearly"
           $scope.data.enddate = new Date(new Date().setDate(today.getDate() + 360));
           
         }
         if ($scope.tenure == "6"){
          $scope.data.cost = 200
          $scope.data.plan_name = "Half Yearly"
          $scope.data.enddate = new Date(new Date().setDate(today.getDate() + 180));
          
         }
         if ($scope.tenure == "4"){
          $scope.data.cost = 150
          $scope.data.plan_name = "Quarterly"
          $scope.data.enddate = new Date(new Date().setDate(today.getDate() + 120));
         }
         if ($scope.tenure == "0"){
          $scope.data.cost = 0
          $scope.data.plan_name = "Free"
          $scope.data.enddate = new Date(new Date().setDate(today.getDate() + 29));
         }
         console.log($scope.data) ;
         
        //  debugger
         $http
           .post($scope.baseurl +  variable.modulename  + "/subscribePortfolio", $scope.data, urlconfig)
           .success(function (response, status, headers, config) {
            
             $scope.loading = false;
             $scope.msg = response.msg ; 
             $scope.data = response.data ;
             console.log(response.data)
             $("#personaldetails").modal('hide');
             $("#subscribe1").modal("show");
             // alert("Your subscribed successfully!");
             // debugger
 
             // url = "myinvestment-detail.html?myportfolioId=" + response.data.id
             // url = "ready-portfolio.html"
             // console.log(url)
 
             // $window.location.href = url;
             
             
   
           })
           .error(function (data, status, header, config) {
             console.log(data);
             $("#getportfolio-issue").modal("show");
           });
       };
        


   
  }
);
