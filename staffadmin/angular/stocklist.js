app.controller(
  "stocklistfinalctrl",
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
    


   


  $scope.getportfoliostocks = function() {
    var data = {}
  
      var urlconfig = {
          headers: {
            "Content-Type": "application/json;"
          },
        };
        

        $http
          .get( $scope.baseurl + "modelportfolio/get-all-stocks/"  , urlconfig)
          .success(function (data, status, headers, config) {
          
            $scope.portfoliostocks = data.data ;

            console.log( $scope.portfolioDetails);
          })
          .error(function (data, status, header, config) {
            console.log(data);
           
          });
  
  }


  $scope.addstock_modal = function () {
    var data = {}
  
    var urlconfig = {
      headers: {
        "Content-Type": "application/json;"
      },
    };


    $http.get(  $scope.baseurl + "modelportfolio/get-all-category/" , data, urlconfig)
            .success(function (response, status, headers, config) {
              console.log("...sucess")
              $scope.category_list = response.data ;
              console.log($scope.category_list,"..category_list.") ;
              $("#addstock").modal("show");
          })
          .error(function (response, status, header, config) {
            $("#addstock").modal("show");
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

    $scope.addstock = {}

    data['created_by'] = localStorage.getItem('customerId');
    



    console.log(data,"....dataaa");
      var urlconfig = {
          headers: {
            "Content-Type": "application/json;"
          },
        };


        $http
          .post( $scope.baseurl + "modelportfolio/post-stocks/", data, urlconfig)
          .success(function (data, status, headers, config) {
            $scope.addstock = data.data ;
            $("#addstock").modal("hide");
            // location.reload();
            $scope.getportfoliostocks(addstock.myportfolioId);
          })
          .error(function (data, status, header, config) {
            console.log(data);
            // $("#addstock").modal("hide");
          });
};


$scope.deletestockmodal = function (id) {
  console.log("deletestockmodal")


  $scope.data = {}
  $scope.data.id =  id

   $("#deletestock").modal("show");
};

$scope.updatestocksource = function (stock) { 
  
    var matchedStockData = $scope.stockdata_list.find(function(stockData) { 
      return stockData.stock === stock;
    }); 
    
    if (matchedStockData) {
      $scope.addstock.source = matchedStockData.source;
    } else {
      $scope.addstock.source = ""; 
      console.error("No matching stock found for:", stock);
    }
};

$scope.deletestock = function (data) {
  console.log("editstock")
  console.log(data);
  var id = data.id
    var urlconfig = {
        headers: {
          "Content-Type": "application/json;"
        },
      };
      $http
        .delete( $scope.baseurl + `modelportfolio/delete-stocks/?stock_id=${id}`, urlconfig)
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
    console.log("addnewstock")
    $scope.data = data
    var urlconfig = {
      headers: {
        "Content-Type": "application/json;"
      },
    };
    $http.get(  $scope.baseurl + "modelportfolio/get-all-category/" , data, urlconfig)
    .success(function (response, status, headers, config) {
      console.log("...sucess")
      $scope.category_list = response.data ;
      console.log($scope.category_list,"..category_list.") ;
      $("#editstock").modal("show");
  })
  .error(function (response, status, header, config) {
    $("#editstock").modal("show");
    console.log("...fail")
      console.log(response);
      $scope.errormsg = "We were not able to get the stockdata. Please try again after some time.";
      $("#stockdata-issue").modal('show');
  });

     
      // $scope.data.percentage = parseInt(data.percentage)
      // $scope.data.capital = parseInt(capital)
      // $scope.data.portfolio.id = data.modelportfolio_id
      // $scope.data.portfolio.portfolio_name = data.modelportfolio_name
    


};

$scope.editstock = function (data) {
    console.log("editstock")
    console.log(data);
    var id = data.id

      var urlconfig = {
          headers: {
            "Content-Type": "application/json;"
          },
        };
        $http
          .put( $scope.baseurl + `modelportfolio/put-stocks/?stock_id=${id}`, data, urlconfig)
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
