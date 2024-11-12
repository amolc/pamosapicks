
app.factory('variable', function() {
  return {
    modulename: "signals",
  };
})


app.controller(
  "robot-portfolio-plans-ctrl",
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
        $scope.portfolioname = localStorage.getItem("portfolioname");

        

      //   $scope.data.freecapital = $scope.data.capital/0
      // $scope.data.quarterlycapital = 150
      // $scope.data.yearlycapital = 300
        

        
        $scope.getCustomerdemoBalance( $scope.customerId);
        $scope.getCustomerliveBalance( $scope.customerId);
        // $scope.getmodelportfolio();
        $scope.getUserPortfolioDetail($scope.modelportfolioId);
        console.log("init else loop");
        console.log($scope.data,"data else loop",$scope);
        // debugger
      }
    };

    
    $scope.getCustomerdemoBalance = function (customerId) {

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

    $scope.getUserPortfolioDetail = function (myportfolioId) {
      var data = {};
      data.myportfolioId = $scope.modelportfolioId;
      

      console.log(data);
      var urlconfig = {
        headers: {
          "Content-Type": "application/json;",
        },
      };
      // $http
      //   .post(
      //     $scope.baseurl + "roboportfoliolive/getUserPortfolioDetail",
      //     data,
      //     urlconfig
      //   )
      $http
        .post(
          $scope.baseurl + "modelportfolio/featured",
          data,
          urlconfig
        )
        .success(function (response, status, headers, config) {
          $scope.portfolioDetails = response.data;

          $scope.data.name = localStorage.getItem("name");
          $scope.data.email = localStorage.getItem('email');
          $scope.data.phone = localStorage.getItem("phone");
          $scope.data.fundingrequired = "False" ;
          $scope.data.fundingamount = 0 ;
          $scope.data.fundingtenure = 0 ;
          $scope.data.qty = 100;
          $scope.data.unitprice = 100 ;
          $scope.data.capital = $scope.data.qty *  $scope.data.unitprice ;
          // debugger


          console.log($scope.portfolioDetails);
          // debugger

          // $scope.getportfolio($scope.portfolioDetails.id);
          // $scope.gettransactions($scope.portfolioDetails.id);
          // $scope.profitlossbymyportfolioid($scope.portfolioDetails.id);
          // $scope.userportfolioaftercalculation($scope.portfolioDetails.id);
        })
        .error(function (data, status, header, config) {

          console.log(data);
          
          // debugger
        });
    };

    // $scope.getmodelportfolio = function() {
    // //  debugger
  
    //     var urlconfig = {
    //         headers: {
    //           "Content-Type": "application/json;"
    //         },
    //       };


        
          
  
    //       $http
    //         .get( $scope.baseurl + "modelportfolio/" + $scope.modelportfolioId , urlconfig)
    //         .success(function (response, status, headers, config) {  
            
    //           $scope.data = response.data ;
    //           $scope.data.name = localStorage.getItem("name");
    //           $scope.data.email = localStorage.getItem('email');
    //           $scope.data.phone = localStorage.getItem("phone");
    //           $scope.data.fundingrequired = "False" ;
    //           $scope.data.fundingamount = 0 ;
    //           $scope.data.fundingtenure = 0 ;
    //           $scope.data.balance = $scope.demobalance ;
    //           $scope.data.qty = 100;
    //           $scope.data.unitprice = 100 ;
    //           $scope.data.capital = $scope.data.qty *  $scope.data.unitprice ;
    //           console.log("....getmodelportfolio",$scope.data.portfolio_name              )
    //   // debugger
    //         })
    //         .error(function (data, status, header, config) {
    //           // debugger
    //           console.log(data);
    //         });
    
    // }

    $scope.amount = function (req, res) {
      // alert("..")
      // console.log("dashboard...")
      // localStorage.clear();
      // location.href = "/app/";
      data = {}
      $scope.data.freecapital = 0
      $scope.data.quarterlycapital = 150
      $scope.data.halfyearlycapital = 200
      $scope.data.yearlycapital = 300
      console.log("...")
    };
      

    $scope.updatecapital = function (data) {
      $scope.alertmessage = 0 ;
      $scope.data.capital = $scope.data.qty *  $scope.data.unitprice ;
      $scope.data.monthlycapital = $scope.data.capital / 12
      $scope.data.quarterlycapital = $scope.data.capital/3
      $scope.data.halfyearlycapital = $scope.data.capital/2
      $scope.data.yearlycapital = $scope.data.capital
      
      

      $scope.data.monthlycapital = $scope.data.monthlycapital.toFixed(2)
      $scope.data.quarterlycapital =  $scope.data.quarterlycapital.toFixed(2)
      $scope.data.halfyearlycapital =  $scope.data.halfyearlycapital.toFixed(2)
      $scope.data.yearlycapital = $scope.data.yearlycapital.toFixed(2)
      // Manual pricing
      $scope.data.freecapital = 0
      $scope.data.quarterlycapital = 150
      $scope.data.halfyearlycapital = 200
      $scope.data.yearlycapital = 300
      // $scope.data.quarterlycapital =  150
      // $scope.data.yearlycapital = 300

      console.log("....",$scope.data)


      if ($scope.data.capital < 1000){
        $scope.message  = "Minimum Capital Investment should be $1000" ;
        $scope.alertmessage = 1 ;
      
    
      }
      
    }

    
    $scope.submitcreateform = function (data) {
      $scope.loading = true;
        var urlconfig = {
          headers: {
            "Content-Type": "application/json;",
          },
        };
        
        console.log($scope.data) ;
        $http
          .post($scope.baseurl +  variable.modulename  + "/createuserportfolio", data, urlconfig)
          .success(function (response, status, headers, config) {
           
            $scope.loading = false;
            $scope.msg = response.msg ; 
            $scope.data = response.data ;
            console.log(response.data) ;

            // $window.location.href = 'mysignals-detail.html?myportfolioId='+ response.data.id;
            // $("#portfolioconfirm").modal("show");
            
  
          })
          .error(function (data, status, header, config) {
            console.log(data);
            $scope.loading = false;
            $("#getportfolio-issue").modal("show");
          });
      };

     
      $scope.apply = function (data,tenure,capital,plan) {
        // $scope.loading = true;
        
        console.log(tenure,"...tenture")
        console.log(capital)
        localStorage.setItem("tenure",tenure);
        localStorage.setItem("capital",capital);
        localStorage.setItem("plann",plan);
        var today = new Date();

        if (tenure == "12"){
          
          $scope.enddate = new Date(new Date().setDate(today.getDate() + 365));
          
          
        }
        if (tenure == "6"){
         $scope.enddate = new Date(new Date().setDate(today.getDate() + 180));
        }
        if (tenure == "4"){
         $scope.enddate = new Date(new Date().setDate(today.getDate() + 120));
        }
        if (tenure == "1"){
         $scope.enddate = new Date(new Date().setDate(today.getDate() + 30));
        }
        if (tenure == "0"){
         $scope.enddate = new Date(new Date().setDate(today.getDate() + 7));
        }
        localStorage.setItem("enddate",$scope.enddate);
        // debugger

        


        // localStorage.setItem('enddate', $scope.enddate);
        

        

        console.log(data)
        console.log($scope.$id)
        // debugger
        // setTimeout(function() {
        //   location.href = "robot-portfolio-apply.html?modelportfolioId=" + $scope.data.id ;
        //  }, 2000);

        setTimeout(function() {
          location.href = "robot-portfolio-apply.html?modelportfolioId=" + $scope.portfolioDetails.id ;
         }, 2000);
        //  setTimeout(function() {
        //   location.href = "robot-portfolio-apply.html?modelportfolioId=1";
        //  }, 2000);
      
        
          
        };

        


   
  }

  




);
