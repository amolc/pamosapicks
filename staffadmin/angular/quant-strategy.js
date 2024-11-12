app.controller(
  "quantStrategy",
  function ($scope, $http, $window, $location, config) {
    $scope.baseurl = config.baseurl;


    $scope.logout = function (req, res) {
      localStorage.clear();
      location.href = "index.html";
    };

    const urlParams = new URLSearchParams($window.location.search);
    $scope.modelportfolioId = urlParams.get('modelportfolioId');
    console.log( $scope.modelportfolioId );
    
    
    
  
    
    $scope.init = function (req, res) {
      console.log("portfoliodetailctrl");
      console.log(config.baseurl);
      var islogin = localStorage.getItem("islogin");
      $scope.stockdatalist = [];
      

      

      if (islogin != "1") {
        location.href = "index.html";
      } else {
        $scope.customerId = localStorage.getItem("customerId");
        if( $scope.customerId == 1){
            $("#menu").load("menu-admin.html"); 
        }else{
            $("#menu").load("menu-demo.html"); 
        }
        // $("#menu").load("menu.html"); 
        $("#general").addClass("active"); 
        $("#modelcategory").addClass("active");
        console.log( $scope.modelportfolioId) 
        $scope.getmodelportfolio($scope.modelportfolioId);
        $scope.getportfoliostocks($scope.modelportfolioId);
        
      }
    
    }


    $scope.getmodelportfolio = function(modelportfolioId) {
      var data = {}
      data.modelportfolioId = modelportfolioId ;
    
      console.log(data);
        var urlconfig = {
            headers: {
              "Content-Type": "application/json;"
            },
          };
          

          $http
            .get( $scope.baseurl + "modelportfolio/", urlconfig)
            .success(function (data, status, headers, config) {
            
              $scope.portfolioDetails = data.data ;
              $scope.portfolioDetails.portfolio_startDate = new Date($scope.portfolioDetails.portfolio_startDate);
              // $scope.portfolioDetails.stockdataId = 1;
              // console.log( $scope.portfolioDetails.stockdataId)
              console.log(data.data);
            })
            .error(function (data, status, header, config) {
              console.log(data);
             
            });
    
    }

    
    $scope.onedit = function () {
        $scope.data = $scope.portfolioDetails ;
       
        $scope.data.portfolio_startDate = new Date($scope.data.portfolio_startDate);
        $scope.data.initial_value = 0 ;
        $scope.data.last_value = 0 ;
        $scope.data.roi = 0 ;
     
        console.log( $scope.data);
      
        console.log($scope.data);
        $("#editform").modal("show");
      };

      $scope.ondelete = function () {
        $scope.data = $scope.portfolioDetails ;
       
        $scope.data.portfolio_startDate = new Date($scope.data.portfolio_startDate);
        $scope.data.initial_value = 0 ;
        $scope.data.last_value = 0 ;
        $scope.data.roi = 0 ;
     
        console.log( $scope.data);
      
        console.log($scope.data);
        $("#deleteportfolio").modal("show");
      };




      $scope.deleteportfolio = function (data) {
        console.log("delete portfolio")
        console.log(data);
          var urlconfig = {
              headers: {
                "Content-Type": "application/json;"
              },
            };
            // $http
            //   .post( $scope.baseurl + "modelportfolio/stocks/deletestock", data, urlconfig)
            //   .success(function (data, status, headers, config) {
            //     $scope.edit = data.data ;
            //     $("#deletestock").modal("hide");
            //     $scope.getportfoliostocks($scope.myportfolioId);
            //   })
            //   .error(function (data, status, header, config) {
            //     console.log(data);
            //   });

              $http.delete(config.baseurl + 'modelportfolio/' + data['id'])
              .success(function(res) {
                  if (res.status == 'false') {} else {
                      // $scope.list();
                      location.href = 'modelportfolio.html';
  
                  }
              }).error(function(error_response) {
                  console.log(error_response);
              });
      };




      $scope.onsubmit  = function (data) {
        
        $scope.data = data
        console.log($scope.data.id);
      
        if($scope.data.id != ''){ 
            console.log("addform")
            $scope.update( $scope.data);
        }else{
            console.log("updateform")
            $scope.update( $scope.data);
        }
        
        $("#editform").modal("hide");
      };


      $scope.update = function(data) {

        var id = data.id ;
        $http.patch(config.baseurl + 'modelportfolio/' + id,data)
            .success(function(res) {
                if (res.status == 'false') {} else {
                    $scope.data = res.data;
                    console.log('data: ', $scope.data);
                  
                }
            }).error(function() {});
    }
    


   


  $scope.getportfoliostocks = function(modelportfolioId) {
    var data = {}
    data.modelportfolioId = modelportfolioId ;
  
    console.log(data);
      var urlconfig = {
          headers: {
            "Content-Type": "application/json;"
          },
        };
        

        $http
          .get( $scope.baseurl + "modelportfolio/get-all-strategy/"  , urlconfig)
          .success(function (data, status, headers, config) {
          
            $scope.portfoliostocks = data.data ;

            console.log( $scope.portfolioDetails);
          })
          .error(function (data, status, header, config) {
            console.log(data);
           
          });
  
  }


  $scope.addstock_modal = function ( stockdataId,modelportfolioId, portfolio_name, capital) {
    console.log("show_add_stock_modal");
    
    var data = {}
  
    var urlconfig = {
      headers: {
        "Content-Type": "application/json;"
      },
    };

    
  $scope.addstock = {}

  $scope.url = $scope.baseurl + "modelportfolio/get-all-strategy-portfolio/" ;
  console.log($scope.url,".....")


  $http.get( $scope.url , data, urlconfig)
          .success(function (response, status, headers, config) {
            console.log("...sucess", response.data)
            $scope.portfolio_list = response.data ;
            console.log($scope.portfolio_list,"...") ;
            $("#addstock").modal("show");
        })
        .error(function (response, status, header, config) {
          
          console.log("...fail")
            console.log(response);
            $scope.errormsg = "We were not able to get the stockdata. Please try again after some time.";
            $("#stockdata-issue").modal('show');
        });
    
  };



  $scope.updateSelectedPortfolio = function() {
    var selectedValue = $scope.addstock.selectedPortfolio;
    
    if (selectedValue) {
        var parts = selectedValue.split(':');
        data.modelportfolio_id = parts[0];
        data.modelportfolio_name = parts[1];
    }
};

  $scope.onaddstockSubmit = function (data) {
    $scope.addstrategy = data
    console.log(data, "==data===", );
    if (data.tradeType == "CFD") {
      $scope.addstrategy.CFD = true
    }
    else if (data.tradeType == "India") {
      $scope.addstrategy.india = true
    }
    else if (data.tradeType == "US") {
      $scope.addstrategy.US = true
    }
    else if (data.tradeType == "Options") {
      $scope.addstrategy.options = true
    }

    console.log(data,"....dataaa");
      var urlconfig = {
          headers: {
            "Content-Type": "application/json;"
          },
        };
        console.log("......neww",data['capital'] )


        $http
          .post( $scope.baseurl + "modelportfolio/post-strategy/", $scope.addstrategy, urlconfig)
          .success(function (data, status, headers, config) {
            // $scope.addstock = data.data ;
            $("#addstock").modal("hide");
            // location.reload();
            $scope.getportfoliostocks(addstock.myportfolioId);
          })
          .error(function (data, status, header, config) {
            console.log(data);
          });
};


$scope.deletestockmodal = function (id) {
  console.log("deletestockmodal")


  $scope.data = {}
  $scope.strategyid =  id

   $("#deletestock").modal("show");
};



$scope.deletestock = function () {
  console.log("editstock")
  strategyid =$scope.strategyid 

    var urlconfig = {
        headers: {
          "Content-Type": "application/json;"
        },
      };
      $http
        .delete( $scope.baseurl + `modelportfolio/delete-strategy/?strategy_id=${strategyid}`, urlconfig)
        .success(function (data, status, headers, config) {
          $scope.edit = data.data ;
          $("#deletestock").modal("hide");
          $scope.getportfoliostocks($scope.myportfolioId);
        })
        .error(function (data, status, header, config) {
          console.log(data);
        });
};

  $scope.editstockmodal = function (data) {

    $scope.strategyid =  data.id
    console.log("addnewstock")
    $scope.url = $scope.baseurl + "modelportfolio/get-all-strategy-portfolio/" ;

    var urlconfig = {
      headers: {
        "Content-Type": "application/json;"
      },
    };
      $scope.data = data
      $http.get( $scope.url , data, urlconfig)
      .success(function (response, status, headers, config) {
        console.log("...sucess", response.data)
        $scope.editportfolio_list = response.data ;
        console.log($scope.editportfolio_list,"...") ;
        $("#editstock").modal("show");
    })
    .error(function (response, status, header, config) {
      
      console.log("...fail")
        console.log(response);
        $scope.errormsg = "We were not able to get the stockdata. Please try again after some time.";
        $("#stockdata-issue").modal('show');
    });

};

$scope.editstock = function (data) {
  $scope.addstrategy = data
  if (data.tradeType == "CFD") {
    $scope.addstrategy.CFD = true
  }
  else if (data.tradeType == "India") {
    $scope.addstrategy.india = true
  }
  else if (data.tradeType == "US") {
    $scope.addstrategy.US = true
  }
  else if (data.tradeType == "Options") {
    $scope.addstrategy.options = true
  }
  strategyid =$scope.strategyid 
    console.log("editstock")
    console.log(data);
    data.capital = 0
    var id = data.id

      var urlconfig = {
          headers: {
            "Content-Type": "application/json;"
          },
        };
        $http
          .patch( $scope.baseurl + `modelportfolio/put-strategy/?strategy_id=${strategyid}`, $scope.addstrategy, urlconfig)
          .success(function (data, status, headers, config) {
            $scope.edit = data.data ;
            $("#editstock").modal("hide");
            $scope.getportfoliostocks($scope.myportfolioId);
            
          })
          .error(function (data, status, header, config) {
            console.log(data);
            
          });
};





    });
