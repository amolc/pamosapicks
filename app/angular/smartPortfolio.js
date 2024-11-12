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
  "smartPortfolio",
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

    //         // Calculate the number of pages
    //         $scope.totalPages = Math.ceil($scope.dataset.length / $scope.itemsPerPage);

    //         // Set currentPage to the last page if it's beyond the total pages
    //         if ($scope.currentPage > $scope.totalPages) {
    //           $scope.currentPage = $scope.totalPages;
    //           startIndex = ($scope.currentPage - 1) * $scope.itemsPerPage;
    //           endIndex = startIndex + $scope.itemsPerPage;
    //         }

    //         // Slice the dataset to show only items for the current page
    //         $scope.displayedItems = $scope.dataset.slice(startIndex, endIndex);
    //       }
    //     })
    //     .error(function () {});
    // };

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


    $scope.createPortfolio = function(data) {
      var customerId = localStorage.getItem("customerId");
      data['status'] = 1
      data['domain'] = "quantbots"
      data['customer_id'] = customerId
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
  var expanded = false;
  $scope.showCheckboxes = function() {
    var checkboxes = document.getElementById("checkboxes");
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
    $http.get(  $scope.baseurl + "modelportfolio/get-all-category/" , urlconfig)
    .success(function (response, status, headers, config) {
      console.log("...sucess")
      $scope.category_list = response.data ;
      console.log($scope.category_list,"..category_list.") ;
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


  $scope.editPortfolio = function(data) {
  
    $scope.data = data
    console.log(data, "=data==");

   $("#edit-portfolio").modal("show");
    

}


$scope.editPortfolioSubmit = function(data) {
  console.log($scope.data,"...")
  console.log(config.baseurl+ 'modelportfolio/' + data['id'], "API...")
  
  $http.patch(config.baseurl + 'modelportfolio/' + data['id'], $scope.data)
      .success(function(res) {
          if (res.status == 'false') {} else {
              $scope.data = res.data;
              console.log('data: ', $scope.data);
            
          }
      }).error(function() {});
}




  
  }
);
