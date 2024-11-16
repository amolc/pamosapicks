app.controller(
    "propertyDetailCtrl",
    function ($scope, $http, $window, $location, config) {
      $scope.baseurl = config.baseurl;
  
  
      $scope.logout = function (req, res) {
        localStorage.clear();
        location.href = "index.html";
      };
  
  
      
      
      
    
      
      $scope.init = function (req, res) {
        var islogin = localStorage.getItem("islogin");
        
  
        
  
        if (islogin != "1") {
          location.href = "index.html";
        } else {
          $scope.customerId = localStorage.getItem("AdminId");
  
          $scope.getPropertyList();
          
        }
      
      }
  
  
  
  
      $scope.getPropertyList = function() {
        var data = {}
      
          var urlconfig = {
              headers: {
                "Content-Type": "application/json;"
              },
            };
            
    
            $http
              .get( $scope.baseurl + "property/get-property/"  , urlconfig)
              .success(function (data, status, headers, config) {
              
                $scope.portfoliostocks = data.data ;
    
                console.log( $scope.portfolioDetails);
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
      
  
  
  
    $scope.addstock_modal = function () {
      $("#addstock").modal("show");
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
  
      // data['created_by'] = localStorage.getItem('AdminId');
      
  
  
  
      console.log(data,"....dataaa");
        var urlconfig = {
            headers: {
              "Content-Type": "application/json;"
            },
          };
  
  
          $http
            .post( $scope.baseurl + "property/create-property/", data, urlconfig)
            .success(function (data, status, headers, config) {
              $scope.addstock = data.data ;
              $("#addstock").modal("hide");
              // location.reload();
              $scope.getPropertyList();
            })
            .error(function (data, status, header, config) {
              console.log(data);
              // $("#addstock").modal("hide");
            });
  };
  
  
  $scope.deletestockmodal = function (id) {
  
  
    $scope.data = {}
    $scope.delete_property_id = id
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
    var id = $scope.delete_property_id 
      var urlconfig = {
          headers: {
            "Content-Type": "application/json;"
          },
        };
        $http
          .delete( $scope.baseurl + `property/delete-property/?property_id=${id}`, urlconfig)
          .success(function (data, status, headers, config) {
            $("#deletestock").modal("hide");
            $scope.getPropertyList();
          })
          .error(function (data, status, header, config) {
            console.log(data);
          });
  };
  
    $scope.editstockmodal = function (data) {
      $scope.data = data
        $("#editstock").modal("show");
  
  
  };
  
  $scope.editstock = function (data) {
      console.log(data);
      var id = data.id
  
        var urlconfig = {
            headers: {
              "Content-Type": "application/json;"
            },
          };
          $http
            .put( $scope.baseurl + `property/update-property/?property_id=${id}`, data, urlconfig)
            .success(function (data, status, headers, config) {
              $scope.edit = data.data ;
              $("#editstock").modal("hide");
              $scope.getPropertyList();
              
            })
            .error(function (data, status, header, config) {
              console.log(data);
              
            });
  };
  
  
  
  
  
      });
  