app.controller('subscriber-ctrl', function($scope, $http, $window, $location, $sce, $timeout, store, config) {


    
  $scope.data = {}

  $scope.init = function (req, res) {
    console.log(config.baseurl, "....")
    $scope.name = localStorage.getItem("name");
        // debugger
  

    // $http.get(config.baseurl + "customer/" )
    //       .success(function(res) {
    //           if (res.status == 'false') {} else {
    //               $scope.dataset = res.data;

    //               console.log('dataset: ', $scope.dataset);
    //           }
    //       }).error(function() {});


    $http.get(config.baseurl + "stockdata/robotsubscriberportfolio" )
    .success(function(res) {
        if (res.status == 'false') {} else {

            $scope.dataset = res.data;
            // t = $scope.dataset.enddate.timestamp.strftime("%I:%M%p %d%b%Y")
            // debugger

            console.log('dataset: ', $scope.dataset);
        }
    }).error(function(data) {
      debugger
    });

      
      $scope.baseurl=config.baseurl;
      var islogin = localStorage.getItem("islogin");
      console.log("..")

      if (islogin != "1" || isStaff != true) {

        location.href = "index.html";
      } else {
        // $scope.name = localStorage.getItem("name");


          $scope.customerId = localStorage.getItem("customerId");
         
          // $("#menu").load("menu.html"); 
         
        // $scope.getbrokersettings('alertsignal',$scope.customerId );


        // $scope.userportfolio('alertsignal',$scope.customerId);
        // $scope.name = localStorage.getItem("name");
        // debugger
      
        // $scope.broker = "alertsignal"


      }
      

    };

   
  $scope.close = function(req,res){
    $('.modal').modal("hide")
  }
  
 


  $scope.deleteid = function(id) {
      console.log("delete idsssss");
      console.log(id);
      $http.delete(config.baseurl + "customer/"  + id)
          .success(function(res) {
              if (res.status == 'false') {} else {
                console.log("......")
                $("#deleteform").modal("hide");
                // $scope.userportfolio($scope.customerId);

              }
          }).error(function(error_response) {
              console.log(error_response);
          });
      $window.location.reload();
  }

  $scope.editid = function(id,data) {
      console.log("edit id");
      console.log(id);
      $http.patch(config.baseurl + "customer/" + id , data)
          .success(function(res) {
              if (res.status == 'false') {} else {
                $("#editform").modal("hide");
                // $scope.userportfolio($scope.customerId);

              }
          }).error(function(error_response) {
              console.log(error_response);
          });
  }



  $scope.redirect = function() {
      //console.log("redirect");
      location.href = '/app/';
  }


   $scope.onedit = function (data) {
      console.log(data);
      $scope.data = data;
      console.log($scope.data);
      $("#editform").modal("show");
    };

    $scope.ondelete = function (data) {
      console.log("delete modal");
      $scope.data = {}
      $scope.data.id = data.id ;
      $scope.data.stock = data.stock 

      $("#deleteform").modal("show");
    };

   



    $scope.startuser = function () {
      
      $scope.data = {}
      // $scope.data.stock = "APPL" ;
      // $scope.data.source = "NASDAQ" ;
      // $scope.data.user ="APPL"
      // $scope.data.length = 5000 ;
      // $scope.data.interval = 1 ;
      // $scope.data.qty = 1 ;
      // $scope.data.deviationfactor = 0.7 ;

      console.log($scope.data);
      $("#startuser").modal("show");
    };


    $scope.usersubmit = function(data) {
        data["customerId"] = $scope.customerId ;
      
        data["org_id"] = config.orgId
        console.log(".....", config.orgId)

        $http.post(config.baseurl + "customer/", data)
            .success(function(res) {
                if (res.status == 'false') {
                  console.log("data is not saved")
                } else {
                  $("#startuser").modal("hide");
                  // $scope.userportfolio( $scope.broker, $scope.customerId);

                  console.log("data is saved.")
                }
            }).error(function() {});
        
    }


    $scope.logout = function (req, res) {
      localStorage.clear();
      location.href = "index.html";
    };



  
    


});