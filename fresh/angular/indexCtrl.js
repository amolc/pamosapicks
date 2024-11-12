app.directive("sparklinechart", function () {

    return {
        restrict: "E",
        scope: {
            data: "@"
        },
        compile: function (tElement, tAttrs, transclude) {

            return function (scope, element, attrs) {
                attrs.$observe("data", function (newValue) { 
                    newValue = newValue.replace("[","");
                    newValue = newValue.replace("]","");
                    var array = newValue.split(",");
                    
                    // Custom tooltip formatter function
                    var tooltipFormatter = function(sparkline, options, fields) {
                        var value = fields.y;
                        var background = '#143443';
                        return '<span style="background-color: ' + background + '; color: #fff; padding: 5px; border-radius: 5px;">' + value + '</span>';
                    };
                    
                    element.sparkline(array , { 
                        type: 'line', 
                        width: '96%', 
                        height: '100px', 
                        lineWidth: 2,
                        changeRangeMin: -10, 
                        chartRangeMax: 10,
                        lineColor: "red" ,
                        fillColor: 'false',
                        tooltipFormatter: tooltipFormatter
                    });
                });
            };
        }
    };
});


app.controller('indexCtrl', function ($scope, $http, $window, $location, config) {

    $scope.baseurl = config.baseurl;
    console.log(config)
  
    $scope.init = function (req, res) {
      console.log("indexCtrl");
      console.log(config.baseurl);
      var islogin = localStorage.getItem("islogin");
  
      $scope.portfolioList()
    }
    $scope.currentPage = 1; // Current page number
    $scope.itemsPerPage = 3; // Number of items per page

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
            console.log("Failed...dataset........")
          } else {
            $scope.mangoes = res;
            $scope.dataset = $scope.mangoes.data;
            console.log( $scope.dataset,"dataset....data.....")

            // Calculate the starting index and ending index for the last three items
            var startIndex = Math.max($scope.dataset.length - 3, 0);
            var endIndex = $scope.dataset.length;

            // Calculate the number of pages
            $scope.totalPages = Math.ceil($scope.dataset.length / $scope.itemsPerPage);

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

    $scope.goToPortfolioPage = function(portfolioId) {
      var portfolioUrl = 'portfolio.html?id=' + portfolioId;
      // Navigate to the Portfolio page
      location.href = portfolioUrl;
    };

    $scope.login = function(req, res) {
      location.href = "/app/login.html";
    }
    
  
    $scope.logout = function (req, res) {
      localStorage.clear();
      location.href = "index.html";
    };
  
  
  
  
  
  
  
  });