app.controller('ig-portfolio-ctrl', function($scope, $http, $window, $location, $sce, $timeout, store, config) {


    
    $scope.data = {}
  
    $scope.init = function (req, res) {
        console.log("ig-portfolio-ctrl");
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
           $scope.igportfolio($scope.customerId);
          $scope.name = localStorage.getItem("name");
          $scope.getigstatus('alpaca',$scope.customerId );
        }
      };

      $scope.close = function(req,res){
        $('.modal').modal("hide")
      }

      $scope.igportfolio = function(customerId) {
        $http.get(config.baseurl + "stockdata/igportfolio/" + customerId  )
            .success(function(res) {
                if (res.status == 'false') {} else {
                    $scope.dataset = res.data;

            
                    console.log('dataset: ', $scope.dataset);
                }
            }).error(function() {});
    }


    $scope.update = function(id,data) {
        console.log(data.id)
        console.log(data)
        $http.patch(config.baseurl + 'stockdata/igportfolio/crud/' + id, data)
            .success(function(res) {
                if (res.status == 'false') {} else {
                    $scope.data = res.data;
                    console.log('data: ', $scope.data);
                    $("#editig").modal("hide");
                  
                }
            }).error(function() {});
    }



    
    $scope.delete = function(id) {
      console.log("delete idsssss");
      console.log(id);
      $http.delete(config.baseurl + 'stockdata/igportfolio/crud/' + id)
          .success(function(res) {
              if (res.status == 'false') {} else {
                  // $scope.list();
                  $("#deleteform").modal("hide");

                  $scope.igportfolio($scope.customerId);
              }
          }).error(function(error_response) {
              console.log(error_response);
          });
     
  }




    $scope.editbrokersettingsmodal = function (brokername, customerId) {
        console.log(brokername, customerId)
        if(brokername=='ig'){
          console.log($scope.alicebluesetting);
          $("#igsetting").modal("show");
        }
      }

  


      $scope.getigstatus = function (brokername, customerId) {
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
    
        $scope.get_broker_details_url = $scope.baseurl + "broker/ig/connectionstatus/" + customerId ;
        console.log($scope.get_broker_details_url);
        $http
          .get($scope.get_broker_details_url, data, config)
          .success(function (response, status, headers, config) {
            console.log(response);   
            if(brokername=='alpaca'){
                $scope.igsetting = response.data ;
                console.log( $scope.igsetting )
                if ($scope.igsetting['api_status'] == 1) {
                  $scope.igstatus = "Connected";
                  $scope.ig_balance = $scope.igsetting['account_balance'];
    
                  $("#igstatus").removeClass("connectionpending");
                  $("#igstatus").addClass("connectionworking");
                } else  {
                  $scope.connectionstatus = "Pending";
                  $scope.alpaca_cash = 0
                  $("#igstatus").removeClass("connectionworking");
                  $("#igstatus").addClass("connectionpending");
                }
            }
            
    
          })
          .error(function (data, status, header, config) {
            console.log(data);
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
      

      

    $scope.redirect = function() {
        //console.log("redirect");
        location.href = '/app/';
    }


    $scope.onedit = function (data) {
        console.log(data);
        $scope.data = data;
        console.log($scope.data);
        $("#editig").modal("show");
      };


    
$scope.igrecordedit = function(data,newrecord) {
      $scope.newrecord = newrecord ;

      $("#startig").modal("hide");
         $scope.searchdata =  $scope.igsetting ;
            $scope.searchdata.epic = data.stock 
            $scope.searchdata.igid = data.id

            $http.post(config.baseurl + 'stockdata/ig/searchepic', $scope.searchdata)
            .success(function(res) {
                if (res.status == 'false') {
                  console.log("issue with saving the ig data")
                } else {
                  console.log("epic list")
                  console.log(res.data)
                  $scope.epicset = res.data ;
                  $scope.igid  =  $scope.searchdata.igid
                  $("#listepics").modal("show");


                }
            }).error(function() {});


  
}






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

     
  



$scope.startig = function (req,res) {
  $scope.data = {}
  $scope.data.stock = "APPL" ;
  $scope.data.source = "NASDAQ" ;
  $scope.data.ig ="APPL"
  $scope.data.length = 5000 ;
  $scope.data.interval = 1 ;
  $scope.data.qty = 1 ;
  $scope.data.deviationfactor = 0.7 ;

  $("#startig").modal("show");
};


$scope.igsubmit = function(data) {
    data["customerId"] = $scope.customerId ;

    $http.post(config.baseurl + 'stockdata/saveigrobot', data)
        .success(function(res) {
            if (res.status == 'false') {
              console.log("issue with saving the ig data")
             
            } else {
              console.log("data is saved.")
              $scope.igportfolio($scope.customerId);
              $("#startig").modal("hide");

            }
        }).error(function() {});
    
}


$scope.igpatch = function(data) {

  console.log(data)


  
}





$scope.selectepic = function(epic,newrecord) {
 
  $scope.data.ig = epic.epic
  $("#listepics").modal("hide");

  if ($scope.newrecord ==1){
    $("#startig").modal("show");
  }else{
    $("#editig").modal("show");
  }
 




}




$scope.searchepics  = function (req,res) {
 
  $scope.searchdata =  $scope.igsetting ;
  $("#searchepics").modal("show");
};


$scope.igepicsearch = function(searchdata) {

    console.log(searchdata);

    $http.post(config.baseurl + 'stockdata/ig/searchepic', $scope.searchdata)
    .success(function(res) {
        if (res.status == 'false') {
          console.log("issue with saving the ig data")
        } else {
          console.log("epic list")
          console.log(res.data)
          $scope.epicset = res.data ;

          $("#searchepics").modal("show");


        }
    }).error(function() {});



  
}



  
      //orderCtrl ends
    



    //orderCtrl ends
});
