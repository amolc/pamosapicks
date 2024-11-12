
app.controller('dashboardCtrl', function ($scope, $http, $window, $location, config) {

  $scope.baseurl = config.baseurl;
  console.log(config)

  $scope.init = function (req, res) {
    console.log("dashboardCtrl");
    console.log(config.baseurl);
    var islogin = localStorage.getItem("islogin");


    if (islogin != "1") {
      location.href = "index.html";
    } else {

      $scope.name = localStorage.getItem("name");
      $scope.customerId = localStorage.getItem("customerId");
      $scope.isStaff = localStorage.getItem("isStaff");
      console.log($scope.customerId);
      console.log($scope.isStaff);
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
      
      $("#createportfolio").addClass("hideblock");
      $("#createportfolio").fadeOut("slow");
      $("#intro").fadeIn("slow");
      $("#categorylist").fadeIn("slow"); 
      // $scope.getCustomerdemoBalance( $scope.customerId);
      // $scope.getCustomerliveBalance( $scope.customerId);

    
      // $scope.getalicebluestatus('alpaca',$scope.customerId );
      // $scope.getbrokersetting('ig',$scope.customerId )
      // $scope.getbrokersetting('aliceblue',$scope.customerId )

     }
  }

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




  $scope.editbrokersettingsmodal = function (brokername, customerId) {

    console.log(brokername, customerId)
    
    if(brokername=='alpaca'){
      console.log($scope.alpacasetting);
      $("#alpacasetting").modal("show");
    }else if(brokername=='ig'){
      console.log($scope.igsetting)
      $("#igsetting").modal("show");
    }
    else if(brokername=='aliceblue'){
      console.log($scope.alicebluesetting)
      $("#alicebluesetting").modal("show");
    }

    
    
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
              $scope.alpa
           
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

  $scope.setigbrokersetting = function (brokername, customerId, data) {

    console.log("setigbrokersetting");
    data.customer_id = customerId;
    data.broker_name = brokername;

    var config = {
      headers: {
        "Content-Type": "application/json;"
      },
    };

    $http
      .post($scope.baseurl + "brokerig/addUpdateApiKey", data, config)
      .success(function (data, status, headers, config) {
        console.log(data);
        $scope.data = data;
        console.log($scope.data);


      })
      .error(function (data, status, header, config) {
        console.log(data);
      });

  }

  $scope.setalicebluebrokersetting = function (brokername, customerId, data) {

    console.log("setalicebluebrokersetting");
    data.customer_id = customerId;
    data.broker_name = brokername;
    console.log(data);

    var config = {
      headers: {
        "Content-Type": "application/json;"
      },
    };

    $http
      .post($scope.baseurl + "brokeraliceblue/addUpdateApiKey", data, config)
      .success(function (response, status, headers, config) {
        console.log(response);
        $scope.response = response;
        console.log($scope.response);
        $("#alicebluesetting").modal("hide");

      })
      .error(function (data, status, header, config) {
        console.log(data);
      });

  }

  $scope.logout = function (req, res) {
    localStorage.clear();
    location.href = "index.html";
  };







});