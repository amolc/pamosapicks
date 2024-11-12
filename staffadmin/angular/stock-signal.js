app.controller('signal-portfolio-ctrl', function($scope, $http, $window, $location, $sce, $timeout, store, config) {


    
    $scope.data = {}
  
    $scope.init = function (req, res) {

        console.log("signal-portfolio-ctrl");
        console.log(config.baseurl);
        $scope.baseurl=config.baseurl;
        var islogin = localStorage.getItem("islogin");

        // if (islogin != "1") {

        //   location.href = "index.html";
        // } else {


            $scope.customerId = localStorage.getItem("customerId");
           
            // $("#menu").load("menu.html"); 
           
          $scope.getbrokersettings('alertsignal',$scope.customerId );


          $scope.alpacaportfolio('alertsignal',$scope.customerId);
          $scope.getStockSignals();
          $scope.name = localStorage.getItem("name");
        
          $scope.broker = "alertsignal"


        // }
        

      };
    $scope.currentPage = 1; // Current page number
    $scope.itemsPerPage = 3; // Number of items per page

     
    $scope.close = function(req,res){
      $('.modal').modal("hide")
    }
    
    $scope.getbrokersettings = function (brokername, customerId) {
        console.log("getbrokersettings");
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
    
        $scope.get_broker_details_url = $scope.baseurl + "broker/" + brokername + "/connectionstatus/" + customerId ;
        console.log($scope.get_broker_details_url);
        $http
          .get($scope.get_broker_details_url, data, config)
          .success(function (response, status, headers, config) {
            console.log(response.data);   
            $scope.setting = response.data ;
                
          })
          .error(function (data, status, header, config) {
            console.log(data);
          });
      }
    



    $scope.alpacaportfolio = function(brokername,customerId) {
        $http.get(config.baseurl + "stockdata/" + brokername + "/list/" + customerId  )
            .success(function(res) {
                if (res.status == 'false') {} else {
                    $scope.dataset = res.data;

                    console.log('dataset: ', $scope.dataset);
                }
            }).error(function() {});
    }


  

    $scope.deleteid = function(id) {
        console.log("delete idsssss");
        console.log(id);
        //console.log(config.baseurl + "stockdata/" + $scope.broker + "/delete/" + id)
        
        $http.get(config.baseurl + "stockdata/stocksignals/delete/" + id)
            .success(function(res) {
                if (res.status == 'false') {} else {
                  $("#deleteform").modal("hide");
                  $scope.alpacaportfolio($scope.customerId);

                }
            }).error(function(error_response) {
                console.log(error_response);
            });
        // $window.location.reload();
    }

    $scope.editid = function(id,data) {
        console.log("edit id");
        console.log(id);
        $http.post(config.baseurl + "stockdata/" + $scope.broker + "/edit/" + id , data)
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
          console.log($scope.alpacasetting);
          $("#brokersetting").modal("show");
        
      }

      $scope.setbrokersetting = function (brokername, customerId, data) {

        console.log($scope.setbrokersetting);
    
        
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
              $("#brokersetting").modal("hide");
             
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

          $http.post(config.baseurl + "stockdata/"+ $scope.broker + "/save", data)
              .success(function(res) {
                  if (res.status == 'false') {
                    console.log("data is not saved")
                  } else {
                    $("#startalpaca").modal("hide");
                    $scope.alpacaportfolio( $scope.broker, $scope.customerId);

                    console.log("data is saved.")
                  }
              }).error(function() {});
          
      }



    
      
  
      //orderCtrl ends
    



    //orderCtrl ends


    $scope.getStockSignals = function () {
      var urlconfig = {
        headers: {
          "Content-Type": "application/json;",
        },
      };
      // debugger
      $http
        .get(
          ($scope.url =
            config.baseurl + `stockdata/stocksignals`),
          urlconfig
        )
        .success(function (response, status, headers, config) {
          $scope.signals = response;

          console.log($scope.signals);
          // debugger

          // $scope.getportfolio($scope.portfolioDetails.id);
          // $scope.gettransactions($scope.portfolioDetails.id);
          // $scope.profitlossbymyportfolioid($scope.portfolioDetails.id);
          // $scope.userportfolioaftercalculation($scope.portfolioDetails.id);
          // $scope.analysisgraph($scope.stockSignals);
        })
        .error(function (data, status, header, config) {
          // debugger
          console.log(data);
          // debugger
        });
    };
});




