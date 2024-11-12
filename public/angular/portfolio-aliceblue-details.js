app.controller(
  "portfolioDetail",
  function ($scope, $http, $window, $location, config) {
    $scope.baseurl = config.baseurl;
    $scope.wssurl = config.wssurl;
    console.log(config);


    $scope.investment_amount = 0

    var searchParams = new URLSearchParams($window.location.search);
    $scope.portfolioId  = searchParams.get("id");
    
    $scope.customerName = localStorage.getItem("customerName");
    $scope.init = function (req, res) {
      $scope.show = false
      // $scope.alpaca();
      
      
      console.log("portfolioDetail");
      console.log(config.baseurl);
      var islogin = localStorage.getItem("isCustomerlogin");
      if (islogin != "1") {
        location.href = "login.html";
      } 

      var customerId = localStorage.getItem("customer_Id");
      // $scope.accountSocket();
      $scope.getUserPortfolioDetail();
      $scope.getSubscriberStocks();
      $scope.getSubscriberInactiveStocks();
      $scope.getSubscriberTranscation();
    
      
      
    };

    // new
    $scope.getSubscriberSignals = function () {
      var searchParams = new URLSearchParams($window.location.search);
      var portfolioId = searchParams.get("id");
      var customerId = localStorage.getItem("customer_Id");
      var portfolioname = localStorage.getItem("portfolioname");
      $scope.url = config.baseurl + `stockdata/alpacasubscribersignal?customerId=${customerId}&portfolioName=${portfolioname}`

      
      var urlconfig = {
        headers: {
          "Content-Type": "application/json;",
        },
      };
      $http
        .get(
          ($scope.url =
            config.baseurl + `stockdata/alpacasubscribersignal?customerId=${customerId}&portfolioName=${portfolioname}`),
          urlconfig
        )
        .success(function (response, status, headers, config) {
          

          $scope.signals = response;
          console.log($scope.signals);

          
        })
        .error(function (data, status, header, config) {
          console.log(data);
        });
    };


    $scope.getSubscriberStocks = function () {
      var searchParams = new URLSearchParams($window.location.search);
      var portfolioId = searchParams.get("id");
      var customerId = localStorage.getItem("customer_Id");
      // debugger

      
      var urlconfig = {
        headers: {
          "Content-Type": "application/json;",
        },
      };

      $http
        .get(
          ($scope.url =
            config.baseurl + `stockdata/subscriberportfoliostocks?customerId=${customerId}&portfolioId=${portfolioId}&robot=aliceblue&status=1`),
          urlconfig
        )
        .success(function (response, status, headers, config) {
          $scope.stockData  = response.data;
          console.log( $scope.stockData ,"...stockdata")
          console.log( response.chart_data ,"...chart_data")
          $scope.sharePercentageChart(response.chart_data)
          $scope.portfoliostocks = $scope.stockData
          $scope.stockvalue = true
          
        })
        .error(function (data, status, header, config) {
          console.log(data);
        });
    };

    $scope.getSubscriberInactiveStocks = function () {
      var searchParams = new URLSearchParams($window.location.search);
      var portfolioId = searchParams.get("id");
      var customerId = localStorage.getItem("customer_Id");
      // debugger

      
      var urlconfig = {
        headers: {
          "Content-Type": "application/json;",
        },
      };

      $http
        .get(
          ($scope.url =
            config.baseurl + `stockdata/subscriberportfoliostocks?customerId=${customerId}&portfolioId=${portfolioId}&robot=aliceblue&status=0`),
          urlconfig
        )
        .success(function (response, status, headers, config) {
          $scope.InactivestockData  = response.data;
          console.log( $scope.InactivestockData ,"...InactivestockData")
          // $scope.portfoliostocks = $scope.stockData
          // $scope.stockvalue = true
          
        })
        .error(function (data, status, header, config) {
          console.log(data);
        });
    };

    // newend
    $scope.currentPage = 1; // Current page number
    $scope.itemsPerPage = 3; // Number of items per page
    $scope.name = localStorage.getItem("name");

   

    $scope.getSubscriberDetails = function (data) {
      console.log(data);
      var urlconfig = {
        headers: {
          "Content-Type": "application/json;",
        },
      };
      // debugger
      $http
        .get(
          ($scope.url =
            config.baseurl + `stockdata/subscriberportfolio/?customerId=${data}`),
          data,
          urlconfig
        )
        .success(function (response, status, headers, config) {
          $scope.customers = response;

          console.log($scope.customers);
          // debugger
          // var portfolioname = localStorage.getItem("portfolioname");
          // $scope.show = false
          // for(var i=0;i<$scope.customers.length;i++){
          //   console.log($scope.customers[i].portfolio_name,"...", portfolioname, "....", $scope.portfolio_name)
          //   if($scope.customers[i].portfolio_name==portfolioname){
          //     $scope.show = true
          //     }
          // }
          // console.log($scope.show)

          // debugger

          
        })
        .error(function (data, status, header, config) {
          // debugger
          console.log(data);
        });
    };



    $scope.getSubscriberTranscation = function () {
      $scope.imLoading = true;
      var searchParams = new URLSearchParams($window.location.search);
      var portfolioId = searchParams.get("id");
      var customerId = localStorage.getItem("customer_Id");
      // debugger
    
      
      var urlconfig = {
        headers: {
          "Content-Type": "application/json;",
        },
      };
      $http
        .get(
          ($scope.url =
            config.baseurl + `stockdata/get-robot-transaction/?subscriber_id=${portfolioId}&robot=aliceblue`),
          urlconfig
        )
        .success(function (response, status, headers, config) {
          $scope.transactionData  = response.data;
          console.log( $scope.transactionData ,"...transaction")
          $scope.portfoliostocks = $scope.stockData ;
          $scope.stockvalue = true ;
          $scope.analysisgraph($scope.transactionData);
          // $scope.profitloss($scope.transactionData);
          // $scope.winratechart($scope.transactionData);
    
          // $scope.analysisgraph($scope.transactionData);
          $scope.imLoading = false;
          
        })
        .error(function (data, status, header, config) {
          $scope.imLoading = false;
          // debugger
          console.log(data);
        });
    };

    

    // $scope.portfolioList = function (req, res) {
    //   $http
    //     .get($scope.baseurl + "modelportfolio/featured")
    //     .success(function (res) {
    //       if (res.status == "false") {
    //       } else {
    //         $scope.mangoes = res;
    //         $scope.dataset = $scope.mangoes.data;

            

    //         // Calculate the starting index and ending index for the last three items
    //         var startIndex = Math.max($scope.dataset.length - 3, 0);
    //         var endIndex = $scope.dataset.length;

    //         // Calculate the number of pages
    //         $scope.totalPages = Math.ceil(
    //           $scope.dataset.length / $scope.itemsPerPage
    //         );

    //         // Set currentPage to the last page if it's beyond the total pages
    //         if ($scope.currentPage > $scope.totalPages) {
    //           $scope.currentPage = $scope.totalPages;
    //         }

    //         // Slice the dataset to show only the last three items
    //         $scope.displayedItems = $scope.dataset.slice(startIndex, endIndex);
    //       }
    //     })
    //     .error(function () {});
    // };


    
  $scope.addAPIDetails = function (data) {

    $("#addAPIModal").modal('show')
    }
    

  
    $scope.onaddAPISubmit = function (data) {
      $scope.imLoading = true
        var searchParams = new URLSearchParams($window.location.search);
        var portfolioId = searchParams.get("id");
      
        var urlconfig = {
          headers: {
            "Content-Type": "application/json;",
          },
        };
        $http
          .put(
            ($scope.url =
              config.baseurl + `stockdata/put-details/${portfolioId}/?robot=aliceblue`),
              data,
            urlconfig
          )
          .success(function (response, status, headers, config) {
            $scope.getUserPortfolioDetail();
            $scope.imLoading = false
            alert("Saved Successfully")
            $("#addAPIModal").modal('hide')
            // $("#igUserDetaiDiv").removeClass('d-none')
            // $("#igUserFormDiv").addClass('d-none')
            
            
          })
          .error(function (data, status, header, config) {
            alert(data.data)
            $scope.imLoading = false
            $("#addAPIModal").modal('hide')
            console.log(data);
          });
        
  }

    $scope.getUserPortfolioDetail = function (req, res) {
      var data = {};
      var searchParams = new URLSearchParams($window.location.search);
      var portfolioId = searchParams.get("id");
      data.myportfolioId = portfolioId;

      console.log(data);
      var urlconfig = {
        headers: {
          "Content-Type": "application/json;",
        },
      };
      // debugger
      $http
        .get(
          ($scope.url = config.baseurl + "stockdata/subscribedetail/"+portfolioId+"/?robot=aliceblue"),
          urlconfig
        )
        .success(function (response, status, headers, config) {
          $scope.portfolioDetails = response.data;
          $scope.addapidata = response.data;
          console.log("profitlossgraph----------",response.data)

          $scope.investment_amount = response.data['investment_amount'] ;

          localStorage.setItem('investment_amount',  $scope.investment_amount);

          console.log("investment_amount",$scope.investment_amount)
          $scope.enddate = $scope.portfolioDetails.enddate;
          var durationInMilliseconds =
            $scope.enddate - $scope.portfolioDetails.startdate;

          // Calculate the duration in days
          var durationInDays = durationInMilliseconds / (1000 * 60 * 60 * 24);

          // Store the duration in your scope variable
          $scope.duration = durationInDays;
          var dateObj = new Date($scope.enddate);

          // Extract year, month, and day components
          var year = dateObj.getFullYear();
          var month = String(dateObj.getMonth() + 1).padStart(2, "0"); // Month is zero-based
          var day = String(dateObj.getDate()).padStart(2, "0");

          // Format the components into yyyy-mm-dd format
          $scope.formattedEndDate = year + "-" + month + "-" + day;

          localStorage.setItem("portfolioname", response.data.portfolio_name);
          // Stop signals  
          // $scope.getStockSignals(response.data.portfolio_name);
          // $scope.analysisgraph($scope.portfolioDetails);

          console.log($scope.customers);
          var portfolioname = $scope.portfolioDetails.portfolio_name
          
          
          // console.log($scope.customers.length,"...legth",$scope.customers)
          // for(var i=0;i<$scope.customers.length;i++){

          //   // console.log($scope.customers[i].portfolio_name,"...", portfolioname)
            
          //   if($scope.customers[i].portfolio_name==portfolioname){
              
          //     $scope.show = true
          //     $scope.plan_name = $scope.customers[i].plan_name
          //     $scope.cost = $scope.customers[i].cost

          //     $scope.startdate = $scope.customers[i].startdate
          //     $scope.enddate = $scope.customers[i].enddate
          //     // console.log($scope.customers[i].plan_name,"..plan name")
          //     // debugger
          //     return
          //     }
          //   else{
          //     $scope.show = false
          //   }

          //   $scope.portfolioname = localStorage.getItem("portfolioname");
          //   if (portfolioname == "USSMALLSTOCKS"){

          //   }
          //   console.log(portfolioname,"..nameport")



          // }
          
        })
        .error(function (data, status, header, config) {
          // debugger
          console.log(data);
        });
    };

    
    $scope.getStockSignals = function (data) {
      console.log(data);
      var urlconfig = {
        headers: {
          "Content-Type": "application/json;",
        },
      };
      // debugger
      $http
        .get(
          ($scope.url =
            config.baseurl + `stockdata/signals/?portfolio_name=${data}`),
          data,
          urlconfig
        )
        .success(function (response, status, headers, config) {
          $scope.signals = response;
         
          console.log($scope.signals);
         
        })
        .error(function (data, status, header, config) {
          // debugger
          console.log(data);
        });
    };

    $scope.portfolioStockList = function (req, res) {
      var searchParams = new URLSearchParams($window.location.search);
      var portfolioId = searchParams.get("id");
      $http
        .get($scope.baseurl + "modelportfolio/stocks/" + portfolioId)
        .success(function (res) {
          if (res.status == "false") {
          } else {
            $scope.mangoes = res;
            $scope.stockData = $scope.mangoes.data;
            console.log($scope.stockData);
          }
        })
        .error(function () {});
    };

    $scope.goToPortfolioPage = function (portfolioId) {
      var portfolioUrl = "portfolio.html?id=" + portfolioId;
      // Navigate to the Portfolio page
      location.href = portfolioUrl;
    };

    $scope.subscribe = function (req, res) {
      var searchParams = new URLSearchParams($window.location.search);
      var portfolioId = searchParams.get("id");
      const subscribeId = portfolioId;
      localStorage.setItem("subscribe-id", subscribeId);

      // Navigate to the login page
      // this.router.navigate(['fresh/login.html']);
      location.href = "/app/plans.html";
    };

    $scope.login = function (req, res) {
      location.href = "/app/login.html";
    };
    $scope.logout = function (req, res) {
      localStorage.clear();
      location.href = "login.html";
    };



    $scope.alpaca = function (req, res) {
      localStorage.setItem("robot", "alpaca");
      
    

      location.href = "/app/alpaca-plans.html";
    };


    $scope.ig = function (req, res) {
      localStorage.setItem("robot", "ig");
      location.href = "/app/robot-plans.html";
    };

    $scope.aliceblue = function (req, res) {
      localStorage.setItem("robot", "aliceblue");
      location.href = "/app/robot-plans.html";
    };

    $scope.addstock_modal = function ( customer_id, ig_subscriber_id, portfolioId,
      username, investment_amount, api_key, password,  acc_type) 
    {
      $("#addstock").modal("show");
      var data = {}
    
      var urlconfig = {
        headers: {
          "Content-Type": "application/json;"
        },
      };
    
      
    $scope.addstock = {}
    $scope.addstock.customerId = customer_id;
    $scope.addstock.ig_subscriber_id = ig_subscriber_id ;
    $scope.addstock.portfolioId = portfolioId ;
    $scope.addstock.username = username ;
    $scope.addstock.password = password ;
    $scope.addstock.api_key = api_key ;
    $scope.addstock.acc_type = acc_type ;
    $scope.addstock.investment_amount = investment_amount ;
    
    
    
    console.log("......",$scope.addstock)
    
    // $scope.url = $scope.baseurl + "stockdata/portfolio/" + stockdataId +"/" ;
    $scope.url = $scope.baseurl + "stockdata/" ;
    console.log($scope.url,".....")
    
    
    $http.get( $scope.url , data, urlconfig)
            .success(function (response, status, headers, config) {
              console.log("...sucess")
              $scope.stockdata_list = response.data ;
              console.log($scope.stockdata_list,"...") ;
              $("#addstock").modal("show");
          })
          .error(function (response, status, header, config) {
            
            console.log("...fail")
              console.log(response);
              $scope.errormsg = "We were not able to get the stockdata. Please try again after some time.";
              $("#stockdata-issue").modal('show');
          });
      
    };
    

    $scope.onaddstockSubmit = function (data) {
      debugger;
      console.log("addnewstock");
      console.log("customer_id");
      console.log("portfolio_id");
      console.log(addstock);
      
  
      if(data.portfolioId == 7){
        data.asset_class = "CRYPTO";
      }else{
        data.asset_class = "STOCK";
      }
  
  
      console.log(data);
        var urlconfig = {
            headers: {
              "Content-Type": "application/json;"
            },
          };
  
  
          $http
            .post( $scope.baseurl + "stockdata/add-stocks/", data, urlconfig)
            .success(function (data, status, headers, config) {
              $scope.addstock = data.data ;
              $("#addstock").modal("hide");
              // location.reload();
              $scope.getSubscriberStocks();
              $scope.getSubscriberInactiveStocks();
            })
            .error(function (data, status, header, config) {
              console.log(data, "--error---");
            });
  };


  $scope.deletestockmodal = function (id, id_sub_id) {
    $scope.data = {}
    $scope.data.id =  id
    $scope.data.sub_id =  id_sub_id
  
     $("#deletestock").modal("show");
  };

  $scope.deletestock = function (data) {
      var urlconfig = {
          headers: {
            "Content-Type": "application/json;"
          },
        };
        $http
          .delete( $scope.baseurl + "stockdata/delete-stocks/?id="+data['id']+"&sub_id="+data['sub_id'], data, urlconfig)
          .success(function (data, status, headers, config) {
            // $scope.edit = data.data ;
            $("#deletestock").modal("hide");
            $scope.getSubscriberStocks();
            $scope.getSubscriberInactiveStocks();
          })
          .error(function (data, status, header, config) {
            console.log(data);
          });
  };

  $scope.editstockmodal = function (data, customer_id, subscriber_id, portfolioId,
     investment_amount, ) {
      $scope.data = data
      $scope.data.investment_amount = parseInt(investment_amount)
      $scope.data.customerId = customer_id;
      $scope.data.ct_subscriber_id = subscriber_id ;
      $scope.data.portfolioId = portfolioId ;


     $("#editstock").modal("show");
};

$scope.editstockSumbit = function (data) {
  console.log(data, "===data====");
  if ($("#stkStatus").prop("checked")) {
    data['status'] = 1
} else {
  data['status'] = 0
}
  percentage = data['qty']
  data['percentage'] = percentage

    var urlconfig = {
        headers: {
          "Content-Type": "application/json;"
        },
      };
      $http
        .patch( $scope.baseurl + "stockdata/add-stocks/?robot=cttrade", data, urlconfig)
        .success(function (data, status, headers, config) {
          $scope.edit = data.data ;
          $("#editstock").modal("hide");
          $scope.getSubscriberStocks();
          $scope.getSubscriberInactiveStocks();
        })
        .error(function (data, status, header, config) {
          console.log(data);
        });
};





$scope.sharePercentageChart = function(chart_data) {
 
  // Extract stocks and allocated values
    var stocks = chart_data.map(function(item) {
      return item.stock;
  });
  var allocated_values = chart_data.map(function(item) {
      return item.allocated_value;
  });

  // Define the data for the pie chart
  var data = [{
      values: allocated_values,
      labels: stocks,
      marker: {
          'colors': [
              'rgb(0, 204, 0)',  
              'rgb(215, 11, 11)' 
          ]
      },
      domain: {column: 0},
      hoverinfo: 'label+percent+name',
      hole: 0.4,
      type: 'pie'
  }];
  
  // Define the layout with increased size
  var layout = {
      title:{
        text: 'Allocation Values',
      font: {
        size: 24,              // Font size of the title
        color: '#FFA500'       // Color of the title text
    }
  },
      annotations: [
          {
              font: {
                  size: 18,
                  color: '#237D97' // Color of the title text
              },
              
              showarrow: false,
              text: '',
              x: 0.17,
              y: 0.5
          }
      ],
      showlegend: false,
      grid: {rows: 1, columns: 1},
      // Increase height and width
      height: 350,  // Increased height
      width: 350,   // Increased width
      // Set background colors
      paper_bgcolor: "#132935", // Set the background color of the entire graph
      plot_bgcolor: "#132935",  // Set the background color of the plot area
      
  };

  // Plot the chart
  Plotly.newPlot('sharePerDiv', data, layout);
 
}

  $scope.onaddIgSubmit = function (data) {

  var searchParams = new URLSearchParams($window.location.search);
  var portfolioId = searchParams.get("id");

  var urlconfig = {
    headers: {
      "Content-Type": "application/json;",
    },
  };
  $http
    .put(
      ($scope.url =
        config.baseurl + `stockdata/put-details/${portfolioId}/?robot=ig`),
        data,
      urlconfig
    )
    .success(function (response, status, headers, config) {
      $scope.getUserPortfolioDetail();
      alert("Saved Successfully")


      
    })
    .error(function (data, status, header, config) {
      alert(data)
      console.log(data);
    });
  
  }

  $scope.onIgUserEdit = function (div) {

    if (div == 1){

      $("#igUserFormDiv").removeClass('d-none')
      $("#igUserDetaiDiv").addClass('d-none')
    }
    else if (div == 2){
      $("#igUserDetaiDiv").removeClass('d-none')
      $("#igUserFormDiv").addClass('d-none')

    }
  }

  $scope.closeModal = function(modalId) {

    $("#"+modalId).modal("hide");
    $("#addstock")
  }


  // edit calculation function
  $scope.calcAllocatedVal = function() {
    allocated_percentage = $("#allocated_percentage").val();
    investment_amount = $("#investment_amount").val();

    share_percentage = allocated_percentage / 100 
    allocatedvalue = investment_amount * share_percentage
    $("#allocated_value").val(allocatedvalue.toFixed(2));
    $scope.data.allocated_value = allocatedvalue.toFixed(2)
    
    margin = $scope.data.margin
    margin_25 = margin * 1.25
    allocated_qty = allocatedvalue / margin_25
    allocated_qty = allocated_qty
    $("#allocated_qty").val(allocated_qty.toFixed(0));
    $scope.data.allocated_qty = allocated_qty.toFixed(0)
    
    buying_ratio = $("#buying_ratio").val();
    buying_qty = allocated_qty / buying_ratio
    $("#buying_qty").val(buying_qty.toFixed(0));
    $scope.data.buying_qty = buying_qty.toFixed(0)
  }

    $scope.calcBuyingQTY = function() {
      allocated_qty = $("#allocated_qty").val();
      buying_ratio = $("#buying_ratio").val();
      buying_qty = allocated_qty / buying_ratio
      $("#buying_qty").val(buying_qty.toFixed(0));
      $scope.data.buying_qty = buying_qty.toFixed(0)
    }
  
  $scope.calcMarginVal = function() {
    lastprice = $("#lastprice").val();
    margin_percentage = $("#margin_percentage").val();
    multiple_factor = $scope.data.multiple_factor
  m_share_price = lastprice * multiple_factor
  
  margin = m_share_price * margin_percentage
  $("#margin").val(margin.toFixed(2));
  $scope.data.margin = margin.toFixed(2)
  }

  $scope.calcMultiFactor = function() {
    lastprice = $("#lastprice").val();
    margin_percentage = $("#margin_percentage").val();
    multiple_factor = $("#multiple_factor").val();
  m_share_price = lastprice * multiple_factor
  
  margin = m_share_price * margin_percentage
  $("#margin").val(margin.toFixed(2));
  $scope.data.margin = margin.toFixed(2)
  $scope.calcAllocatedVal()
  }

  $scope.updateLastPrice = function(stockId) {
    var searchParams = new URLSearchParams($window.location.search);
    var portfolioId = searchParams.get("id");
  
    var urlconfig = {
      headers: {
        "Content-Type": "application/json;",
      },
    };
    $http
      .put(
        ($scope.url =
          config.baseurl + `stockdata/put-last-price/?stock_id=${stockId}&portfolio_id=${portfolioId}`),
        urlconfig
      )
      .success(function (response, status, headers, config) {
        console.log("--last-price---", response.data); response.data
        $("#allocated_value").val(response.data.allocated_value.toFixed(2));
        $("#allocated_qty").val(response.data.allocated_qty.toFixed(0));
        $("#buying_qty").val(response.data.buying_qty.toFixed(0));
        $("#margin").val(response.data.margin.toFixed(2));
        $("#margin_percentage").val(response.data.margin_percentage);
        $("#lastprice").val(response.data.lastprice.toFixed(2));
        $("#m_share_price").val(response.data.m_share_price.toFixed(2));
        $scope.getSubscriberStocks();
        $scope.getSubscriberInactiveStocks();
      })
      .error(function (data, status, header, config) {
        // debugger
        console.log(data);
      });
    

  }

  $scope.buyAndsellOpenPosistion = function(stockId,customerId, portfolioId, api_user_id, direction) {
    if (api_user_id == null  || api_user_id == '' ){
      alert("Enter API Details to Trade")
    }
    else {
      $scope.imLoading = true;
    var searchParams = new URLSearchParams($window.location.search);
    var portfolioId = searchParams.get("id");
    data = {'trade_type': direction}
    var urlconfig = {
      headers: {
        "Content-Type": "application/json;",
      },
    };
    $http
      .post(
        ($scope.url =
          config.baseurl + `stockdata/post-aliceblue-trading-views/?stock_id=${stockId}&portfolio_id=${portfolioId}`),
          data, urlconfig
      )
      .success(function (response, status, headers, config) {
        $scope.imLoading = false;
        alert("Success")
      })
      .error(function (data, status, header, config) {
        $scope.imLoading = false;
        alert("Failure")
        console.log(data);
      });
    }
  }
  

  
  $scope.editIgPosition = function (dealId, stop_level, limit_level) {
    $scope.dealId = dealId ;
    $scope.editpositionModel = {
      stop_level: stop_level,
      limit_level: limit_level,
      
    };
    $("#editpositionModel").modal("show");
    
  };
  
  
  $scope.editPositionSubmit = function (data) {
    data['deal_id'] = $scope.dealId 
    var searchParams = new URLSearchParams($window.location.search);
    var portfolioId = searchParams.get("id");
    var urlconfig = {
      headers: {
        "Content-Type": "application/json;"
      },
    };
    
    
    $http
    .put( $scope.baseurl + `stockdata/update-robot-ig-trading/?portfolio_id=${portfolioId}`, data, urlconfig)
    .success(function (data, status, headers, config) {
      console.log(data, "--success--");
      alert("Success")
      $("#editpositionModel").modal("hide");
    })
    .error(function (data, status, header, config) {
      console.log(data, "--error--");
      alert("Failure")
          });
};

  $scope.closePosition = function (dealId) {
    $scope.dealId =  dealId

     $("#closeOpenPositionMdl").modal("show");
  };
  
  $scope.confrimClosePosition = function () {

    var searchParams = new URLSearchParams($window.location.search);
    var portfolioId = searchParams.get("id");

    var data = {}

    var dealId = $scope.dealId 
    data = {"dealId": dealId}
    console.log("dealId", dealId);
      var urlconfig = {
          headers: {
            "Content-Type": "application/json;"
          },
        };
        $http
          .patch( $scope.baseurl + `stockdata/close-robot-ig-trading/?portfolio_id=${portfolioId}`, data, urlconfig)
          .success(function (data, status, headers, config) {
            alert("Success")
            console.log(data, "--success--");
            $("#closeOpenPositionMdl").modal("hide");
          })
          .error(function (data, status, header, config) {
            console.log(data);
            alert("Failure")
          });
  };


  $scope.testIgAccount = function () {

    var searchParams = new URLSearchParams($window.location.search);
    var portfolioId = searchParams.get("id");
  
    var urlconfig = {
      headers: {
        "Content-Type": "application/json;",
      },
    };
    $http
      .get(
        ($scope.url =
          config.baseurl + `stockdata/test-details/?portfolio_id=${portfolioId}&robot=ig`),
        urlconfig
      )
      .success(function (response, status, headers, config) {
        alert("Account verfied")
      })
      .error(function (data, status, header, config) {
        alert(data)
        console.log(data);
      });
    
    }

    
    // $scope.backtest = function(data) {
    //   $scope.imLoading = true;

    //   $http.post(config.baseurl + 'stockdata/backtest',data)
    //       .success(function(res) {
    //           if (res.status == 'false') {
               
    //           } else {

                
    //             $scope.imLoading = false;
    //             $scope.df = res.df ;
    //             $scope.sf = res.sf ;
    //             $scope.tf = res.tf ;
                
    //             $scope.total_profit = res.total_profit ;
               
    //             $scope.total_trades = res.total_trades ;
    //             $scope.winrate = res.winrate ;

    //             console.log('tf: ', res.tf);
    //             console.log('stats: ', res.stats);
    //             $scope.stats = res.stats;

    //           $scope.profitloss(res.sf);
    //           $scope.winratechart($scope.total_trades ,  $scope.winrate  );
    //           $scope.analysisgraph(res.df,res.tf);

                
    //           }
    //       }).error(function() {});
    // }

        
    $scope.profitloss = function (data) {
      var xarray = [];
      var profitloss = [];
      $scope.total = 0;
  
      for (var i = 0; i < data.length; i++) {
          if (data[i].profitloss > 0) { // Use the correct comparison operator
              xarray.push(i);
              profitloss.push(data[i].profitloss);
              $scope.total += data[i].profitloss;
          }
      }
  
      $scope.total = Math.round($scope.total * 100) / 100;
      console.log("we are in profit and loss graph");

      var trace1 = {
          x: xarray,
          y: profitloss,
          type: 'bar',
          name: 'Primary Product',
          marker: {
              color: '#4e8dc9',
              opacity: 0.8,
          }
      };
  
      var data = [trace1];
  
      var layout = {
          title: 'Profitloss Report',
          xaxis: {
              tickangle: -45
          },
          barmode: 'group',
          showlegend: false,
          responsive: true,
         
      };
  
      Plotly.newPlot('profitlossgraph', data, layout);
  };

    $scope.winratechart = function (data) {

      totaltrades = data.length ;
      winrate = 0 ;

        for (var i = 0; i < data.length; i++) {
          if (data[i].profitloss > 0) { // Use the correct comparison operator
             winrate = winrate + 1
          }
      }


    //  Lets draw the pie-chart
      var loserate = totaltrades - winrate

      $scope.winratepercentage = winrate/totaltrades * 100 ;

      var data = [{
        values: [winrate, loserate],
        labels: ['Winrate', 'Loserate' ],
        marker: {'colors': [
          'rgb(0, 204, 0)',  
          'rgb(215, 11, 11)' 
         ]},
        domain: {column: 0},
        name: 'Winrate',
        hoverinfo: 'label+percent+name',
        hole: .4,
        type: 'pie'
      }];
      
      var layout = {
        title: 'Winrate',
        annotations: [
          {
            font: {
              size: 18
            },
            showarrow: false,
            text: '',
            x: 0.17,
            y: 0.5
          }
        ],
        showlegend: false,
        grid: {rows: 1, colums: 1},
        height: 300,
        width: 300,
      };


      Plotly.newPlot('winratediv', data, layout );
 
    };

    $scope.analysisgraph = function(data) {
  
      let dataindex = []; // This will hold the dates
      let portfolioroi = [];
  
      let totalprofit = 0;
      let finalamount = 0;
      let investmentAmount = parseFloat(localStorage.getItem('investment_amount'));
  
      for (let i = 0; i < data.length; i++) {
          if (data[i].profitloss >> 0) {
              totalprofit = totalprofit + data[i].profitloss;
              finalamount = investmentAmount + totalprofit;
              let roi = ((finalamount - investmentAmount) / investmentAmount) * 100;
              dataindex.push(data[i].datetime); // Assuming the x-axis should be the datetime
              portfolioroi.push(roi);
          }
      }
  
      var fig = {};
  
      fig.data = [
          {
              x: dataindex,
              y: portfolioroi,
              type: 'scatter',
              mode: 'lines+markers',
              marker: { color: '#237D97', size: 4 },
              name: 'Portfolio ROI',
              hoverinfo: 'x+y',
              hovertemplate: 'Date: %{x}<br>ROI: %{y:.2f}%<extra></extra>'
          }
      ];
  
      fig.layout = {
          responsive: true,
          autosize: true,
          margin: { l: 50, r: 50, b: 100, t: 100, pad: 4 },
          paper_bgcolor: '#132935',
          plot_bgcolor: '#132935',
          showlegend: true,
          legend: { x: 0, y: 1, font: { color: '#237D97' } },
          title: { text: 'Stock ROI', font: { color: '#FFA500' } },
          xaxis: {
              title: { text: 'Date', font: { color: '#FFA500' } },
              tickfont: { color: '#237D97' },
              type: 'category', // Assuming dataindex are categorical labels
              automargin: true
          },
          yaxis: {
              title: { text: 'ROI', font: { color: '#FFA500' } },
              tickfont: { color: '#237D97' },
              automargin: true
          }
      };
  
      Plotly.newPlot('analysisgraph', fig.data, fig.layout);
      
  };
  




  
   

});

