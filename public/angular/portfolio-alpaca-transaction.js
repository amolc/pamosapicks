app.controller(
  "portfolioDetail",
  function ($scope, $http, $window, $location, config) {
    $scope.baseurl = config.baseurl;
    $scope.wssurl = config.wssurl;
    console.log(config);


    $scope.investment_amount = 0 ;
    var searchParams = new URLSearchParams($window.location.search);
    $scope.portfolioId  = searchParams.get("id");

    $scope.init = function (req, res) {
      $scope.show = false
      // $scope.alpaca();
      
      
      console.log("portfolioDetail");
      console.log(config.baseurl);
      var islogin = localStorage.getItem("isCustomerlogin");
      if (islogin != "1") {
        location.href = "login.html";
      } 
      $scope.customerName = localStorage.getItem("customerName");
      var customerId = localStorage.getItem("customer_Id");
      // $scope.accountSocket();
      $scope.getUserPortfolioDetail();
      $scope.getSubscriberStocks();
      $scope.getSubscriberInactiveStocks();
      $scope.getSubscriberTranscation();
      // $scope.sharePercentageChart();
    
      
      
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
            config.baseurl + `stockdata/subscriberportfoliostocks?customerId=${customerId}&portfolioId=${portfolioId}&robot=ig&status=1`),
          urlconfig
        )
        .success(function (response, status, headers, config) {
          $scope.stockData  = response.data;
          console.log( $scope.stockData ,"...stockdata")
          console.log( response.chart_data ,"...chart_data")
          // $scope.sharePercentageChart(response.chart_data)
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
            config.baseurl + `stockdata/subscriberportfoliostocks?customerId=${customerId}&portfolioId=${portfolioId}&robot=ig&status=0`),
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
      $http
        .get(
          ($scope.url = config.baseurl + "stockdata/subscribedetail/"+portfolioId+"/?robot=alpaca"),
          data,
          urlconfig
        )
        .success(function (response, status, headers, config) {
          $scope.portfolioDetails = response.data;
          $scope.addapidata = response.data;
          console.log("response.data", response.data);
          console.log("profitlossgraph",response.data['profitlossgraph'])

          console.log("datetimegraph",response.data['datetimegraph'])
          
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

          console.log($scope.customers);
          var portfolioname = $scope.portfolioDetails.portfolio_name
          
          console.log($scope.customers.length,"...legth",$scope.customers)
          for(var i=0;i<$scope.customers.length;i++){

            // console.log($scope.customers[i].portfolio_name,"...", portfolioname)
            
            if($scope.customers[i].portfolio_name==portfolioname){
              
              $scope.show = true
              $scope.plan_name = $scope.customers[i].plan_name
              $scope.cost = $scope.customers[i].cost

              $scope.startdate = $scope.customers[i].startdate
              $scope.enddate = $scope.customers[i].enddate

              return
              }
            else{
              $scope.show = false
            }

            $scope.portfolioname = localStorage.getItem("portfolioname");
            if (portfolioname == "USSMALLSTOCKS"){

            }
            console.log(portfolioname,"..nameport")



          }
          
        })
        .error(function (data, status, header, config) {
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

  $scope.editstockmodal = function (data, customer_id, ig_subscriber_id, portfolioId,
    username, investment_amount, api_key, password,  acc_type) {
      $scope.data = data
      $scope.data.investment_amount = parseInt(investment_amount)
      $scope.data.customerId = customer_id;
      $scope.data.ig_subscriber_id = ig_subscriber_id ;
      $scope.data.portfolioId = portfolioId ;
      $scope.data.username = username ;
      $scope.data.password = password ;
      $scope.data.api_key = api_key ;
      $scope.data.acc_type = acc_type ;
      $scope.data.investment_amount = investment_amount ;


     $("#editstock").modal("show");
};

$scope.editstockSumbit = function (data) {
  console.log(data);
  if ($("#stkStatus").prop("checked")) {
    data['status'] = 1
} else {
  data['status'] = 0
}
  percentage = data['qty']
  data['percentage'] = percentage
  data['ig'] = ''

    var urlconfig = {
        headers: {
          "Content-Type": "application/json;"
        },
      };
      $http
        .patch( $scope.baseurl + "stockdata/add-stocks/", data, urlconfig)
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


$scope.getSubscriberTranscation = function () {
  var searchParams = new URLSearchParams($window.location.search);
  let portfolioId = searchParams.get("id");
  var customerId = localStorage.getItem("customer_Id");
  // customer_Id

  
  var urlconfig = {
    headers: {
      "Content-Type": "application/json;",
    },
  };
  $http
    .get(
      ($scope.url =
        config.baseurl + `stockdata/get-robot-transaction/?subscriber_id=${portfolioId}&robot=alpaca`),
      urlconfig
    )
    .success(function (response, status, headers, config) {
      $scope.transactionData  = response.data;
      console.log( $scope.transactionData ,"...transaction")
      $scope.portfoliostocks = $scope.stockData ;
      $scope.stockvalue = true ;
      // $scope.analysisgraph($scope.transactionData);
      $scope.profitloss($scope.transactionData);
      $scope.winratechart($scope.transactionData);

      // $scope.analysisgraph($scope.transactionData);

      
    })
    .error(function (data, status, header, config) {
      // debugger
      console.log(data);
    });
};


// $scope.sharePercentageChart = function (chart_data) {

//   //  Lets draw the pie-chart
//     // var loserate = totaltrades - winrate

//     // $scope.winratepercentage = winrate/totaltrades * 100 ;
//     var stocks = chart_data.map(function(item) {
//       return item.stock;
//   });
//   var allocated_values = chart_data.map(function(item) {
//       return item.allocated_value;
//   });

//     var data = [{
//       values:allocated_values,
//       labels: stocks,
//       marker: {'colors': [
//         'rgb(0, 204, 0)',  
//         'rgb(215, 11, 11)' 
//        ]},
//       domain: {column: 0},
//       // name: 'Allocation Value',
//       hoverinfo: 'label+percent+name',
//       hole: .4,
//       type: 'pie'
//     }];
    
//     var layout = {
//       title: 'Allocation Values',
//       annotations: [
//         {
//           font: {
//             size: 18
//           },
//           showarrow: false,
//           text: '',
//           x: 0.17,
//           y: 0.5
//         }
//       ],
//       showlegend: false,
//       grid: {rows: 1, colums: 1},
//       height: 300,
//       width: 300,
//     };


//     Plotly.newPlot('sharePerDiv', data, layout );

//   }

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
        config.baseurl + `stockdata/put-ig-details/${portfolioId}/`),
        data,
      urlconfig
    )
    .success(function (response, status, headers, config) {
      $scope.getUserPortfolioDetail();
      alert("Saved Successfully")
      // $("#igUserDetaiDiv").removeClass('d-none')
      // $("#igUserFormDiv").addClass('d-none')

      
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

  $scope.buyAndsellOpenPosistion = function(stockId,customerId, portfolioId, api_key, direction) {
    if (api_key == null  || api_key == '' ){
      alert("Enter API Details to Trade")
    }
    else {
      $scope.imLoading = true;
    var searchParams = new URLSearchParams($window.location.search);
    var portfolioId = searchParams.get("id");
    data = {'direction': direction}
    var urlconfig = {
      headers: {
        "Content-Type": "application/json;",
      },
    };
    $http
      .post(
        ($scope.url =
          config.baseurl + `stockdata/post-robot-ig-trading/?stock_id=${stockId}&portfolio_id=${portfolioId}`),
          data, urlconfig
      )
      .success(function (response, status, headers, config) {
        $scope.imLoading = false;
        alert("Success")
        $scope.getSubscriberTranscation()
        $scope.accountSocket()
      })
      .error(function (data, status, header, config) {
        $scope.imLoading = false;
        alert("Failure")
        console.log(data);
      });
    }
  }
  
  $scope.igdashboarddata = []; 
  // igOpenPosistionData
  $scope.accountSocket = function() {
    var searchParams = new URLSearchParams($window.location.search);
    var portfolioId = searchParams.get("id");
    var socket = new WebSocket($scope.wssurl+`ws/ig-data-open-position/${portfolioId}/`)
    socket.onmessage = function (e){
      
      var cleanedData = e.data.replace(/NaN|null/g, 'null');
      var djangoData = JSON.parse(cleanedData);
      console.log(djangoData, "---djangoData--");
      $scope.$apply(function () {
        $scope.igdashboarddata = djangoData.value;
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
          config.baseurl + `stockdata/test-ig-details/?portfolio_id=${portfolioId}`),
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

        
    $scope.profitloss = function(data) {
      var xarray = [];
      var profitloss = [];
      $scope.total = 0;
  
      for (var i = 0; i < data.length; i++) {
          if (data[i].m_profit_and_loss > 0) { // Use the correct comparison operator
              xarray.push(i);
              profitloss.push(data[i].m_profit_and_loss);
              $scope.total += data[i].m_profit_and_loss;
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
              color: '#237D97', // Updated bar color
              opacity: 0.8,
          }
      };
  
      var data = [trace1];
  
      var layout = {
          title: {
              text: 'Profitloss Report - Total: $' + $scope.total, // Concatenate the total into the title string
              font: {
                  color: '#FFA500' // Title color
              }
          },
          xaxis: {
              tickangle: -45,
              tickfont: {
                  color: '#237D97' // X-axis tick color
              },
              title: {
                  text: 'Index',
                  font: {
                      color: '#FFA500' // X-axis title color
                  }
              }
          },
          yaxis: {
              tickfont: {
                  color: '#237D97' // Y-axis tick color
              },
              title: {
                  text: 'Profit/Loss',
                  font: {
                      color: '#FFA500' // Y-axis title color
                  }
              }
          },
          paper_bgcolor: '#132935', // Background color of the entire graph
          plot_bgcolor: '#132935', // Background color of the plot area
          barmode: 'group',
          showlegend: false,
          responsive: true,
          height: 400 // Adjust the height of the graph
      };
  
      Plotly.newPlot('profitlossgraph', data, layout);
  };

  $scope.winratechart = function(data) {
    debugger
    totaltrades = data.length;
    winrate = 0;

    for (var i = 0; i < data.length; i++) {
        if (data[i].m_profit_and_loss > 0) { // Use the correct comparison operator
            winrate = winrate + 1;
        }
    }
    var loserate = totaltrades - winrate;
    if (totaltrades == 0) {
      $scope.winratepercentage = 0
    }else {
    $scope.winratepercentage = (winrate / totaltrades) * 100;

  }

    var data = [{
        values: [winrate, loserate],
        labels: ['Winrate', 'Loserate'],
        marker: {
            colors: [
              'rgb(0, 204, 0)',
                'rgb(215, 11, 11)'
            ]
        },
        domain: { column: 0 },
        name: 'Winrate ', // Display winrate percentage
        hoverinfo: 'label+percent+name',
        hole: 0.4,
        type: 'pie'
    }];

    var layout = {
        title: {
            text: 'Winrate - ' + $scope.winratepercentage.toFixed(2) + '%',
            font: {
                color: '#FFA500' // Title color
            }
        },
        annotations: [{
            font: { size: 18 },
            showarrow: false,
            text: '',
            x: 0.17,
            y: 0.5
        }],
        showlegend: false,
        grid: { rows: 1, columns: 1 },
        height: 300,
        width: 300,
        paper_bgcolor: '#132935', // Background color of the entire graph
        plot_bgcolor: '#132935', // Background color of the plot area
        font: {
            color: '#ffffff' // Label and text color
        }
    };

    Plotly.newPlot('winratediv', data, layout);
};

    $scope.analysisgraph = function(data) {
      console.log("Analysis Graph data")
      console.log(data)

      dataindex = [];
      benchmarkindex = [];
      portfolioroi = [];
      benchmarkroi = [];
      totalprofit = 0
      finalamount = 0
  
      for (let i = 0; i < data.length; i++) {

            if(data[i].profitloss >> 0){
              console.log("Profitloss - i ");
              $scope.investment_amount = parseFloat(localStorage.getItem('investment_amount'));
              totalprofit = totalprofit + data[i].profitloss ;
              finalamount = $scope.investment_amount + totalprofit ;
              let roi = ((finalamount - $scope.investment_amount) / $scope.investment_amount) * 100;
              dataindex.push(data[i].datetime); // Assuming the x-axis should be the index
              portfolioroi.push(roi);
            }

          // dataindex.push(data[i].end_datetime); // Assuming the x-axis should be the index
          // portfolioroi.push(data[i].portfolioroi);

      }
  
  
      // for (let i = 0; i < data; i++) {
      //     console.log(i)
      //     benchmarkindex.push(i); // Assuming the x-axis should be the index
      //     console.log(data.benchmarkroi[i])
      //     benchmarkroi.push(data.benchmarkroi[i]);
      // }
  
      var fig = {};
  
      fig.data = [
          {
              x: dataindex,
              y: portfolioroi,
              smoothness: 1.3,
              line_smoothing: 1.3,
              mode: 'line+marker',
              marker: { color: "#143443", size: 1 },
              name: data.portfolio_name
          }
          // ,
          // {
          //     x: benchmarkindex,
          //     y: benchmarkroi,
          //     smoothness: 1.3,
          //     line_smoothing: 1.3,
          //     mode: 'line+marker',
          //     marker: { color: "red", size: 1 },
          //     name: data.benchmark
          // }
      ];
  
      fig.layout = {
          responsive: true,
          autosize: true,
          margin: {
              l: 50,
              r: 50,
              b: 100,
              t: 100,
              pad: 4
          },
          paper_bgcolor: '#fff',
          plot_bgcolor: '#fcfcfc',
          showlegend: true, // Show the legend
          legend: { x: 0, y: 1 } // You can adjust the position of the legend
      };
  
      fig.layout.title = 'Stock ROI';
  
      Plotly.newPlot('analysisgraph', fig.data, fig.layout);
  };

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
              config.baseurl + `stockdata/put-details/${portfolioId}/?robot=alpaca`),
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

  $scope.closeModal = function(modalId) {

    $("#"+modalId).modal("hide");
    $("#addstock")
  }




  
   

});

