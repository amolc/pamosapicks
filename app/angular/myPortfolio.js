app.directive("sparklinechart", function () {
  return {
    restrict: "E",
    scope: {
        data: "="
    },
    compile: function (tElement, tAttrs, transclude) {
      return function (scope, element, attrs) {
        attrs.$observe("data", function (newValue) {
          newValue = newValue.replace("[", "");
          newValue = newValue.replace("]", "");
          var array = newValue.split(",");

          // Custom tooltip formatter function
          var tooltipFormatter = function (sparkline, options, fields) {
            var value = fields.y;
            var background = "#143443";
            return (
              '<span style="background-color: ' +
              background +
              '; color: #fff; padding: 5px; border-radius: 5px;">' +
              value +
              "</span>"
            );
          };

          element.sparkline(array, {
            type: "line",
            width: "96%",
            height: "100px",
            lineWidth: 2,
            changeRangeMin: -10,
            chartRangeMax: 10,
            lineColor: "red",
            fillColor: "false",
            tooltipFormatter: tooltipFormatter,
          });
        });
      };
    },
  };
});

app.controller(
  "myPortfolio",
  function ($scope, $http, $window, $location, config) {
    $scope.baseurl = config.baseurl;
    console.log(config);

    $scope.init = function (req, res) {
      console.log("smartPortfolio");
      console.log(config.baseurl);
      var islogin = localStorage.getItem("islogin");

      $scope.portfolioList();
    };
    
    $scope.currentPage = 1; // Current page number
    $scope.itemsPerPage = 3; // Number of items per page
    $scope.name = localStorage.getItem("name");





    var expanded = false;
    $scope.showCheckboxes = function(id) {
      var checkboxes = document.getElementById(id);
      if (!expanded) {
        checkboxes.style.display = "block";
        expanded = true;
      } else {
        checkboxes.style.display = "none";
        expanded = false;
      }
    }




    $scope.addPortfolio = function() {
   
      var urlconfig = {
        headers: {
          "Content-Type": "application/json;"
        },
      };
      $http.get(  $scope.baseurl + "modelportfolio/get-all-defaultvalues/" , urlconfig)
      .success(function (response, status, headers, config) {
        console.log("...sucess")
        $scope.category_list = response.category ;
        $scope.strategy_list = response.strategy ;
        $scope.broker_list = response.brokers ;
        console.log($scope.broker_list,"..broker_list.") ;
        $("#add-portfolio").modal("show");
    })
    .error(function (response, status, header, config) {
      $("#add-portfolio").modal("show");
      console.log("...fail")
        console.log(response);
        $scope.errormsg = "We were not able to get the stockdata. Please try again after some time.";
        $("#stockdata-issue").modal('show');
    });
  }
  

    $scope.portfolioList = function (req, res) {
      var customerId = localStorage.getItem("customerId");
      $http
        .get($scope.baseurl + `modelportfolio/get-myportfolios-list/?customer_id=${customerId}`)
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

    $scope.goToPortfolioPage = function (portfolioId) {
      var portfolioUrl = "portfolio.html?id=" + portfolioId;
      // Navigate to the Portfolio page
      location.href = portfolioUrl;
    };
    $scope.login = function (req, res) {
      location.href = "/app/login.html";
    };

    $scope.logout = function (req, res) {
      localStorage.clear();
      location.href = "index.html";
    };

    
    $scope.selectedOptions = {};
    $scope.createPortfolio = function(data) {
      var selectedIds = Object.keys($scope.selectedOptions).filter(function(key) {
        return $scope.selectedOptions[key];
      });
      
      console.log('Selected IDs:', selectedIds);
      var selectedIdsString = selectedIds.join(', ');
      console.log('Selected IDs String:', selectedIdsString);
      data['brokers'] = selectedIdsString
      var customerId = localStorage.getItem("customerId");
      debugger;
      data['status'] = 1
      data['customer_id'] = customerId
      data['domain'] = "quantbots"

      $scope.data.list = false
      $http.post(config.baseurl + 'modelportfolio/', $scope.data)
          .success(function(res) {

              if (res.status == 'false') {} else {
                  $scope.response = res.data;
                  alert("success")
                  console.log('message: ', $scope.response);
                  // window.location.reload();
              }
          }).error(function() {});
      

  }


  $scope.editPortfolio = function(data) {
    console.log("======",data.brokers,"=========")
    $scope.data = data
    var urlconfig = {
      headers: {
        "Content-Type": "application/json;"
      },
    };
    $http.get(  $scope.baseurl + "modelportfolio/get-all-defaultvalues/" , urlconfig)
    .success(function (response, status, headers, config) {
      console.log("...sucess")
      $scope.category_list = response.category ;
      $scope.strategy_list = response.strategy ;
      $scope.broker_list_edit = response.brokers ;
      console.log($scope.broker_list_edit,"..broker_list_edit.") ;

          // Convert data.brokers to an array of IDs
          var selectedBrokerIds = []
          if (data.brokers !== null && data.brokers !== '') {
          selectedBrokerIds = data.brokers.split(',').map(function(id) {
            return id.trim(); // Trim any extra whitespace
          });
        }
          // Initialize editselectedOptions based on the fetched broker list
          $scope.editselectedOptions = {};
          $scope.broker_list_edit.forEach(function(broker) {
            if (selectedBrokerIds.includes(String(broker.id))) {
              $scope.editselectedOptions[broker.id] = true;
            }
          });
    
    
      $("#edit-portfolio").modal("show");
  })
  .error(function (response, status, header, config) {
    $("#edit-portfolio").modal("show");
    console.log("...fail")
      console.log(response);
      $scope.errormsg = "We were not able to get the stockdata. Please try again after some time.";
      $("#stockdata-issue").modal('show');
  });

  $scope.editselectedOptions = {};
  $scope.editPortfolioSubmit = function(data) {
    var selectedIds = Object.keys($scope.editselectedOptions).filter(function(key) {
      return $scope.editselectedOptions[key];
    });
    
    console.log('Selected IDs:', selectedIds);
    var selectedIdsString = selectedIds.join(', ');
    console.log('Selected IDs String:', selectedIdsString);
    data['brokers'] = selectedIdsString
    data['contributors'] = "Amol S, Smartportfolio Team, Quantbots Team"
    console.log($scope.data,"...")
    console.log(config.baseurl+ 'modelportfolio/' + data['id'], "API...")
    
    $http.patch(config.baseurl + 'modelportfolio/' + data['id'], $scope.data)
        .success(function(res) {
            if (res.status == 'false') {
              console.log('res: ',res);

            } else {
                $scope.data = res.data;
                console.log('data: ', $scope.data);
              
            }
        }).error(function() {});
  }
  

}

  }
);
