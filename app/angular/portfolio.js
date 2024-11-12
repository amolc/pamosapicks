app.controller(
  "portfolio",
  function ($scope, $http, $window, $location, config) {
    $scope.baseurl = config.baseurl;
    console.log(config);

    $scope.init = function (req, res) {
      $scope.show = false
      // $scope.alpaca();
      
      
      console.log("portfolio");
      console.log(config.baseurl);
      var islogin = localStorage.getItem("islogin");
      if (islogin != "1") {
        location.href = "login.html";
      } 

      var customerId = localStorage.getItem("customerId");
      $scope.customerId = customerId
      $scope.portfolioList();
      $scope.portfolioStockList();
      $scope.subscribe();
     // $scope.getSubscriberDetails(customerId);
      $scope.getUserPortfolioDetail();


      
    };
    $scope.currentPage = 1; // Current page number
    $scope.itemsPerPage = 3; // Number of items per page
    $scope.name = localStorage.getItem("name");

    // $scope.portfolioList = function (req, res) {
    //   $http
    //     .get($scope.baseurl + "modelportfolio/")
    //     .success(function (res) {
    //       if (res.status == "false") {
    //       } else {
    //         $scope.mangoes = res;
    //         $scope.dataset = $scope.mangoes.data;

    //         // Calculate the starting index and ending index for the current page
    //         var startIndex = ($scope.currentPage - 1) * $scope.itemsPerPage;
    //         var endIndex = startIndex + $scope.itemsPerPage;

    //         // Slice the dataset to show only items for the current page
    //         $scope.displayedItems = $scope.dataset.slice(startIndex, endIndex);
    //       }
    //     })
    //     .error(function () {});
    // };

    var searchParams = new URLSearchParams($window.location.search);
    var portfolioId = searchParams.get('id');
    $scope.portfolioId  = portfolioId ;


    $scope.getSubscriberDetails = function (data) {
      console.log(data);
      var urlconfig = {
        headers: {
          "Content-Type": "application/json;",
        },
      };
      // 
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
          // 
          // var portfolioname = localStorage.getItem("portfolioname");
          // $scope.show = false
          // for(var i=0;i<$scope.customers.length;i++){
          //   console.log($scope.customers[i].portfolio_name,"...", portfolioname, "....", $scope.portfolio_name)
          //   if($scope.customers[i].portfolio_name==portfolioname){
          //     $scope.show = true
          //     }
          // }
          // console.log($scope.show)

          // 

          
        })
        .error(function (data, status, header, config) {
          // 
          console.log(data);
        });
    };

    $scope.portfolioList = function (req, res) {
      $http
        .get($scope.baseurl + "modelportfolio/featured")
        .success(function (res) {
          if (res.status == "false") {
          } else {
            $scope.mangoes = res;
            $scope.dataset = $scope.mangoes.data;

            

            // Calculate the starting index and ending index for the last three items
            var startIndex = Math.max($scope.dataset.length - 3, 0);
            var endIndex = $scope.dataset.length;

            // Calculate the number of pages
            $scope.totalPages = Math.ceil(
              $scope.dataset.length / $scope.itemsPerPage
            );

            // Set currentPage to the last page if it's beyond the total pages
            if ($scope.currentPage > $scope.totalPages) {
              $scope.currentPage = $scope.totalPages;
            }

            // Slice the dataset to show only the last three items
            $scope.displayedItems = $scope.dataset.slice(startIndex, endIndex);
          }
        })
        .error(function () {});
    };

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
      // 
      $http
        .post(
          ($scope.url = config.baseurl + "modelportfolio/featured"),
          data,
          urlconfig
        )
        .success(function (response, status, headers, config) {
          $scope.portfolioDetails = response.data;
          $scope.portfolioCustomerId = response.data['customer_id'];

          console.log("==response====",response.data)
          console.log("profitlossgraph",response.data['profitlossgraph'])

          console.log("datetimegraph",response.data['datetimegraph'])
          // 

          
          // if ($scope.portfolioDetails.portfolio_enddate) {
          //     $scope.portfolioDetails.portfolio_enddate = new Date(parseInt($scope.portfolioDetails.portfolio_enddate)).toISOString();
          // }
          $scope.enddate = $scope.portfolioDetails.portfolio_enddate;
          var durationInMilliseconds =
            $scope.enddate - $scope.portfolioDetails.portfolio_startdate;

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

          // console.log($scope.portfolioDetails);

          // $scope.getportfolio($scope.portfolioDetails.id);
          // $scope.gettransactions($scope.portfolioDetails.id);
          // $scope.profitlossbymyportfolioid($scope.portfolioDetails.id);
          // $scope.userportfolioaftercalculation($scope.portfolioDetails.id);
          $scope.getStockSignals(response.data.portfolio_name);
          $scope.analysisgraph($scope.portfolioDetails);

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
              // console.log($scope.customers[i].plan_name,"..plan name")
              // 
              return
              }
            else{
              $scope.show = false
            }

            $scope.portfolioname = localStorage.getItem("portfolioname");
            if (portfolioname == "USSMALLSTOCKS"){

            }
            console.log(portfolioname,"..nameport")



            // 










          }
          
        })
        .error(function (data, status, header, config) {
          // 
          console.log(data);
        });
    };

    

    // $scope.signals = [
    //   {
    //     symbol: "AAPL",
    //     portfolio_name: "Tech",
    //     signals: "Buy",
    //     close: 150.0,
    //     datetime: "23-8-23",
    //     profitloss: 20.0,
    //     tp1: 155.0,
    //     tp2: 160.0,
    //     tp3: 165.0,
    //     lp1: null,
    //     lp2: null,
    //     lp3: null,
    //   },
    //   {
    //     symbol: "GOOGL",
    //     portfolio_name: "Tech",
    //     signals: "Sell",
    //     close: 2800.0,
    //     datetime: "24-8-23",
    //     profitloss: -30.0,
    //     tp1: null,
    //     tp2: null,
    //     tp3: null,
    //     lp1: 2850.0,
    //     lp2: 2900.0,
    //     lp3: 2950.0,
    //   },
    // ];

  
    $scope.addNewStock = function () {
  $("#add-new-stock").modal("show");
};



$scope.addStockSubmit = function (data) {
  var portfolioId = searchParams.get('id');
  console.log("editstock")
  data['modelportfolio_id'] = portfolioId
  console.log(data);
    var urlconfig = {
        headers: {
          "Content-Type": "application/json;"
        },
      };
      $http
        .post( $scope.baseurl + "modelportfolio/stocks/addstock", data, urlconfig)
        .success(function (data, status, headers, config) {
          $scope.edit = data.data ;
          $("#add-stock").modal("hide");
          alert("Success")
          $scope.portfolioStockList();
        })
        .error(function (data, status, header, config) {
          alert(data)
          console.log(data);
        });
};

    $scope.editStockModal = function (data) {
  
        $scope.data = data
        $scope.data.percentage = parseInt(data.percentage)
  
       $("#edit-stock").modal("show");
  };


  $scope.deletStock = function (stock_id) {
  
    $scope.stock_id = stock_id
   $("#delete-stock").modal("show");
};

$scope.deleteStockSubmit = function () {
    data = {'id': $scope.stock_id} 

  
    var urlconfig = {
        headers: {
          "Content-Type": "application/json;"
        },
      };
      $http
        .post( $scope.baseurl + "modelportfolio/stocks/deletestock", data, urlconfig)
        .success(function (data, status, headers, config) {
          $scope.edit = data.data ;
          $("#delete-stock").modal("hide");
          $scope.portfolioStockList();
        })
        .error(function (data, status, header, config) {
          console.log(data);
          $("#delete-stock").modal("hide");
        });
};

  
  $scope.editStockSubmit = function (data) {
    var portfolioId = searchParams.get('id');
    console.log("editstock")
    data['modelportfolio_id'] = portfolioId
    console.log(data);
      var urlconfig = {
          headers: {
            "Content-Type": "application/json;"
          },
        };
        $http
          .post( $scope.baseurl + "modelportfolio/stocks/editstock", data, urlconfig)
          .success(function (data, status, headers, config) {
            $scope.edit = data.data ;
            $("#edit-stock").modal("hide");
            alert("Success")
            $scope.portfolioStockList();
          })
          .error(function (data, status, header, config) {
            alert(data)
            console.log(data);
          });
};

$scope.addsimpleStock = function () {
  category_id = $scope.portfolioDetails.stock_category_id
  data = {}
  $scope.url = $scope.baseurl + `modelportfolio/get-all-stocks/?category_id=${category_id}` ;
  var urlconfig = {
    headers: {
      "Content-Type": "application/json;"
    },
  };
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

  $("#add-simplestock").modal("show");
};


$scope.simpleStockSubmit = function (data) {
  data['capital'] = $scope.portfolioDetails.capital
  data['modelportfolio_id'] = $scope.portfolioDetails.modelportfolio_id
  data['modelportfolio_name'] = $scope.portfolioDetails.portfolio_name
  data['stockdataId'] = $scope.portfolioDetails.stockdataId
  
  var portfolioId = searchParams.get('id');
  console.log("editstock")
  data['modelportfolio_id'] = portfolioId
  console.log(data);
    var urlconfig = {
        headers: {
          "Content-Type": "application/json;"
        },
      };
      $http
        .post( $scope.baseurl + "modelportfolio/stocks/simpleaddstock", data, urlconfig)
        .success(function (data, status, headers, config) {
          $scope.edit = data.data ;
          $("#add-stock").modal("hide");
          alert("Success")
          $scope.portfolioStockList();
        })
        .error(function (data, status, header, config) {
          alert(data)
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
      // 
      $http
        .get(
          ($scope.url =
            config.baseurl + `stockdata/signals/?portfolio_name=${data}`),
          data,
          urlconfig
        )
        .success(function (response, status, headers, config) {
          $scope.signals = response;
          // $scope.signals = $scope.signals.slice(0,100)

          console.log("signals===",$scope.signals);
          // 

          // $scope.getportfolio($scope.portfolioDetails.id);
          // $scope.gettransactions($scope.portfolioDetails.id);
          // $scope.profitlossbymyportfolioid($scope.portfolioDetails.id);
          // $scope.userportfolioaftercalculation($scope.portfolioDetails.id);
          // $scope.analysisgraph($scope.stockSignals);
        })
        .error(function (data, status, header, config) {
          // 
          console.log(data);
        });
    };

    $scope.portfolioStockList = function () {
      
      var searchParams = new URLSearchParams($window.location.search);
      var portfolioId = searchParams.get('id');
      $http
        .get($scope.baseurl + "modelportfolio/stocks/" + portfolioId)
        .success(function (res) {
          if (res.status == "false") {
          } else {
            $scope.portfoliostocks = res.data;
            //console.log($scope.portfoliostocks);
            
            //console.log($scope.stockData)

            $('#example').DataTable();
          }
        })
        .error(function () {});
    };

    $scope.goToPortfolioPage = function (portfolioId) {
      var portfolioUrl = "portfolio.html?id=" + portfolioId;
      // Navigate to the Portfolio page
      location.href = portfolioUrl;
    };

    $scope.analysisgraph = function (data) {

      // data.portfolioroi =  $scope.portfolioDetails['profitlossgraph']
      // data.datetimegraph = $scope.portfolioDetails['datetimegraph']

      // console.log($scope.portfolioDetails['datetimegraph'])
      // 
      
      dataindex = [];
      dataclose = [];

      for (let i = 0; i < data.portfolioroi.length; i++) {
        // dataindex.push( data.datetimegraph[i]);
        dataindex.push(i); // Assuming the x-axis should be the index
        dataclose.push(data.portfolioroi[i]);
      }

      var fig = {};

      fig.data = [
        {
          x: dataindex,
          y: dataclose,
          smoothness: 1.3,
          line_smoothing: 1.3,
          mode: "line+marker",
          marker: { color: "#143443", size: 1 },
          name: "Portfolio Roi",
        },
      ];

      fig.layout = {
        responsive: true,
        autosize: true,
        margin: {
          l: 50,
          r: 50,
          b: 100,
          t: 100,
          pad: 4,
        },
        paper_bgcolor: "#fff",
        plot_bgcolor: "#fcfcfc",
        showlegend: true, // Show the legend
        legend: { x: 0, y: 1 }, // You can adjust the position of the legend
      };

      fig.layout.title = "Portfolio ROI";

      Plotly.newPlot("analysisgraph", fig.data, fig.layout);
    };

    $scope.subscribe = function (req, res) {
      var searchParams = new URLSearchParams($window.location.search);
      var portfolioId = searchParams.get("id");
      const subscribeId = portfolioId;
      localStorage.setItem("subscribe-id", subscribeId);

      // Navigate to the login page
      // this.router.navigate(['fresh/login.html']);
      // location.href = "/app/plans.html";
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
      

      location.href = "/app/alpaca-personaldetail.html";
    };




    $scope.ig = function (req, res) {
      localStorage.setItem("robot", "ig");
      location.href = "/app/ig-personaldetail.html";
    };

    $scope.aliceblue = function (req, res) {
      localStorage.setItem("robot", "aliceblue");
      location.href = "/app/robot-plans.html";
    };


  
  $scope.newsLetter = function (req, res) {
      var portfolioUrl = "news-letter-customer-list.html?id=" + $scope.portfolioId;
      location.href = portfolioUrl;
   


  }

  $scope.telegramCustomers = function (req, res) {
    var portfolioUrl = "telegram-customer-list.html?id=" + $scope.portfolioId;
    location.href = portfolioUrl;
 


}

$scope.contatusCustomers = function (req, res) {
  var portfolioUrl = "contact-us-customer.html?id=" + $scope.portfolioId;
  location.href = portfolioUrl;
};



}
);
// app.filter('paginate', function() {
//   return function(input, start) {
//     start = parseInt(start, 10);
//     // 
//     return input.slice(start, start+10);
//   };
// });