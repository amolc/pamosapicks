app.controller('telegram-portfolio-ctrl', function($scope, $http, $window, $location, $sce, $timeout, store, config) {


    
    $scope.data = {}
  
    $scope.init = function (req, res) {

        console.log("telegram-portfolio-ctrl");
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
                // $scope.getalpacastatus('alpaca',$scope.customerId );
            }
            // $("#menu").load("menu.html"); 
           
          $scope.alpacaportfolio($scope.customerId);
          $scope.name = localStorage.getItem("name");
          $scope.getalpacastatus('alpaca',$scope.customerId );
            
          $scope.broker = "telegramrobot"
        }
        

      };

     
      
     

    $scope.alpacaportfolio = function(customerId) {
        $http.get(config.baseurl + "stockdata/" + $scope.broker + "/list/" + customerId  )
            .success(function(res) {
                if (res.status == 'false') {} else {
                    $scope.dataset = res.data;

            
                    console.log('dataset: ', $scope.dataset);
                }
            }).error(function() {});
    }


   

    $scope.getalpacastatus = function (brokername, customerId) {
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
    
        $scope.get_broker_details_url = $scope.baseurl + "broker/alpaca/connectionstatus/" + customerId ;
        console.log($scope.get_broker_details_url);
        $http
          .get($scope.get_broker_details_url, data, config)
          .success(function (response, status, headers, config) {
            console.log(response);   
            if(brokername=='alpaca'){
                $scope.alpacasetting = response.data ;
                console.log( $scope.alpacasetting )
                if ($scope.alpacasetting['api_status'] == 1) {
                  $scope.connectionstatus = "Connected";
                  $scope.alpaca_cash = $scope.alpacasetting['alpaca_cash'];
    
                  $("#alpacastatus").removeClass("connectionpending");
                  $("#alpacastatus").addClass("connectionworking");
                } else  {
                  $scope.alpacasetting = {}
                  $scope.alpacasetting.org_id = 1 ;
                  $scope.alpacasetting.customer_id = customerId ;
                  $scope.alpacasetting.broker_name = "alpaca";
                

                  $scope.connectionstatus = "Pending";
                  $scope.alpaca_cash = 0
                  $("#alpcastatus").removeClass("connectionworking");
                  $("#alpacastatus").addClass("connectionpending");
                }
            }
            
    
          })
          .error(function (data, status, header, config) {
            console.log(data);
          });
      }
    
      


    $scope.deleteid = function(id) {
        console.log("delete idsssss");
        console.log(id);
        $http.get(config.baseurl + "stockdata/" + $scope.broker + "/delete/" + id)
            .success(function(res) {
                if (res.status == 'false') {} else {
                  $("#deleteform").modal("hide");
                  $scope.alpacaportfolio($scope.customerId);

                }
            }).error(function(error_response) {
                console.log(error_response);
            });
        $window.location.reload();
    }

    $scope.editid = function(id,data) {
        console.log("edit id");
        console.log(id);
        $http.post(config.baseurl + 'stockdata/demorobot/edit/' + id , data)
            .success(function(res) {
                if (res.status == 'false') {} else {
                  $("#editform").modal("hide");
                  $scope.alpacaportfolio($scope.customerId);

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

     

      $scope.editbrokersettingsmodal = function (brokername, customerId) {
        console.log(brokername, customerId)
        if(brokername=='alpaca'){
          console.log($scope.alpacasetting);
          $("#alpacasetting").modal("show");
        }
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


      //  The add stock to the alpaca robot

     
 


      $scope.startalpaca = function () {
        
        $scope.data = {}
        $scope.data.stock = "APPL" ;
        $scope.data.source = "NASDAQ" ;
        $scope.data.alpaca ="APPL"
        $scope.data.length = 5000 ;
        $scope.data.interval = 1 ;
        $scope.data.qty = 1 ;
        $scope.data.deviationfactor = 0.7 ;

        console.log($scope.data);
        $("#startalpaca").modal("show");
      };


      $scope.alpacasubmit = function(data) {
          data["customerId"] = $scope.customerId ;

          $http.post(config.baseurl + 'stockdata/demorobot/save', data)
              .success(function(res) {
                  if (res.status == 'false') {
                    console.log("data is not saved")
                  } else {
                    $("#startalpaca").modal("hide");
                    $scope.alpacaportfolio($scope.customerId);

                    console.log("data is saved.")
                  }
              }).error(function() {});
          
      }



    
      
  
      //orderCtrl ends
    



    //orderCtrl ends
});
