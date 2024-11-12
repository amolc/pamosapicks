app.controller('aliceblue-portfolio-ctrl', function($scope, $http, $window, $location, $sce, $timeout, store, config) {

  $scope.close = function(req,res){
    $('.modal').modal("hide")
  }
    
    $scope.data = {}
  
    $scope.init = function (req, res) {
        console.log("roboctrl");
        console.log(config.baseurl);
        $scope.baseurl=config.baseurl;
        var islogin = localStorage.getItem("islogin");

        if (islogin != "1") {
          location.href = "index.html";
        } else {
            $scope.customerId = localStorage.getItem("customerId");
            if( $scope.customerId == 1){
                $("#menu").load("menu-admin.html"); 
            }else{
                $("#menu").load("menu-simple.html"); 
            }
            // $("#menu").load("menu.html"); 
            $("#general").addClass("active"); 
            $("#category").addClass("active"); 
            $("#modelcategory").addClass("active"); 
          $scope.aliceblueportfolio($scope.customerId)
          $scope.name = localStorage.getItem("name");
          // $scope.getalicebluestatus('aliceblue',$scope.customerId );
        }
        
        $scope.getalicebluestatus('aliceblue',$scope.customerId );

      };


    $scope.aliceblueportfolio = function(customerId) {
        $http.get(config.baseurl + "stockdata/aliceblueportfolio/" + customerId  )
            .success(function(res) {
                if (res.status == 'false') {} else {
                    $scope.dataset = res.data;
                    console.log('dataset: ', $scope.dataset);
                }
            }).error(function() {});
    }


    $scope.list = function(req, res) {
        $http.get(config.baseurl + 'stockdata/')
            .success(function(res) {
                if (res.status == 'false') {} else {
                    $scope.dataset = res.data;

            
                    console.log('dataset: ', $scope.dataset);
                }
            }).error(function() {});
    }





    $scope.startaliceblue = function () {
        
      $scope.data = {}
      $scope.data.stock = "TATA" ;
      $scope.data.source = "NSE" ;
      $scope.data.aliceblue ="TATA"
      $scope.data.length = 5000 ;
      $scope.data.interval = 1 ;
      $scope.data.qty = 1 ;
      $scope.data.deviationfactor = 0.7 ;

      console.log($scope.data);
      $("#startaliceblue").modal("show");
    };


    $scope.alicebluesubmit = function(data) {
        data["customerId"] = $scope.customerId ;

        $http.post(config.baseurl + 'stockdata/savealicebluerobot', data)
            .success(function(res) {
                if (res.status == 'false') {
                  console.log("data is not saved")
                } else {
                  $("#startaliceblue").modal("hide");
                  $scope.aliceblueportfolio($scope.customerId)

                  console.log("data is saved.")
                }
            }).error(function() {});
        
    }

    $scope.deleteid = function(id) {
      console.log("delete idsssss");
      console.log(id);
      $http.get(config.baseurl + 'stockdata/aliceblue/del/' + id)
          .success(function(res) {
              if (res.status == 'false') {} else {
                
                  // $scope.alpacaportfolio($scope.customerId);

              }
          }).error(function(error_response) {
              console.log(error_response);
          });
      $window.location.reload();
  }

  $scope.editid = function(id,data) {
      console.log("edit id");
      console.log(id);
      $http.post(config.baseurl + 'stockdata/aliceblue/edit', data)
          .success(function(res) {
              if (res.status == 'false') {} else {
                  $("#editform").modal("hide");
                  $scope.alpacaportfolio($scope.customerId);

              }
          }).error(function(error_response) {
              console.log(error_response);
          });
  }



    $scope.setbrokersetting = function (brokername, customerId, data) {

        console.log("setbrokersetting");
    
        data.customer_id = customerId;
        data.broker_name = brokername;
        console.log(data)
    
        var config = {
          headers: {
            "Content-Type": "application/json;"
          },
        };
    
        $http
          .patch($scope.baseurl + "broker/" + brokername + "/" + data["id"], data, config)
          .success(function (data, status, headers, config) {
            console.log(data);
            $scope.data = data;
            console.log($scope.data);
            if ($scope.data['status'] == 'alert') {
              $("#alpacasetting").modal("hide");
              $scope.alertmessage = $scope.data['msg']
              setTimeout(function () {
                $("#alert").modal("show");
    
              }, 1000);
              setTimeout(function () {
                $("#alert").modal("hide");
              }, 10000);
    
            } else {
              $("#alpacasetting").modal("hide");
              $window.location.reload();
            }
    
    
          })
          .error(function (data, status, header, config) {
            console.log(data);
          });
    
      }


    $scope.editbrokersettingsmodal = function (brokername, customerId) {
        console.log(brokername, customerId)
        if(brokername=='aliceblue'){
          console.log($scope.alicebluesetting);
          $("#alicebluesetting").modal("show");
        }
      }


     

      $scope.getalicebluestatus = function (brokername, customerId) {
        console.log("brokersetting");
        console.log(brokername);
        console.log(customerId);
    
        var data = {}
        data.customer_id = customerId;
        data.broker = brokername;
        console.log(data);
    
        var config = {
          headers: {
            "Content-Type": "application/json;"
          },
        };
    
      $scope.get_broker_details_url = $scope.baseurl + "broker/aliceblue/connectionstatus/" + customerId ;
        console.log($scope.get_broker_details_url);
        $http
          .get($scope.get_broker_details_url, data, config)
          .success(function (response, status, headers, config) {
            console.log(response);   
            if(brokername=='aliceblue'){
                $scope.alicebluesettings = response.data ;
                console.log( $scope.alicebluesetting )
                if ($scope.alicebluesettings['api_status'] == 1) {
                  $scope.aliceblue_status = "Connected";
                  $scope.aliceblue_balance = $scope.alicebluesettings['account_balance'];
                  console.log( $scope.aliceblue_status);
                  console.log($scope.aliceblue_balance);
                  $("#alicebluestatus").removeClass("connectionpending");
                  $("#alicebluestatus").addClass("connectionworking");
                } else  {
                  $scope.aliceblue_status = "Pending";
                  $scope.aliceblue_balance = 0 ;
                  $("#alicebluestatus").removeClass("connectionworking");
                  $("#alicebluestatus").addClass("connectionpending");
                }
            }
            
    
          })
          .error(function (data, status, header, config) {
            console.log(data);
          });
      }








   

    $scope.delete = function(id) {
        console.log("delete idsssss");
        console.log(id);
        $http.delete(config.baseurl + 'stockdata/' + id)
            .success(function(res) {
                if (res.status == 'false') {} else {
                    // $scope.list();

                }
            }).error(function(error_response) {
                console.log(error_response);
            });
        $window.location.reload();
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

      $scope.addform = function () {
        
        $scope.data = {}
        $("#editform").modal("show");
      };

      $scope.onsubmit  = function (data) {
        
        $scope.data = data
        console.log($scope.data.id);
      
        if($scope.data.id != ''){ 
            console.log("addform")
            $scope.add( $scope.data);
        }else{
            console.log("updateform")
            $scope.update( $scope.data);
        }
        
        $("#editform").modal("hide");
      };
  



      
  
      //orderCtrl ends
    



    //orderCtrl ends
});
