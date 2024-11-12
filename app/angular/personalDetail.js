app.controller(
  "personalDetail",
  function ($scope, $http, $window, $location, config) {
    $scope.baseurl = config.baseurl;
    console.log(config);

    $scope.init = function (req, res) {
      console.log("portfolioDetail");
      console.log(config.baseurl);
      var islogin = localStorage.getItem("islogin");
      if (islogin != "1") {
        location.href = "login.html";
      } 

      // $scope.portfolioList();
      // $scope.portfolioStockList();
      $scope.getUserPortfolioDetail();
      $scope.getmodelportfolio();
    };
    $scope.currentPage = 1; // Current page number
    $scope.itemsPerPage = 3; // Number of items per page
    $scope.name = localStorage.getItem("name");

    var vm = this;
    $scope.baseurl = config.baseurl;

    vm.loginvalidate = function (data) {
      console.log(data);
      if (data["email"] == "") {
        $scope.message = "Please provide an email address.";
        $scope.validateemail = "1";
        return false;
      } else if (data["password"] == "") {
        $scope.message = "Please provide password.";
        $scope.validatepassword = "1";
        return false;
      } else {
        var confirm = 1;
        return confirm;
      }
    };

    $scope.getUserPortfolioDetail = function (req, res) {
      var data = {};
      // var searchParams = new URLSearchParams($window.location.search);
      var portfolioId = localStorage.getItem("subscribe-id");
      data.myportfolioId = portfolioId;

      console.log(data);
      var urlconfig = {
        headers: {
          "Content-Type": "application/json;",
        },
      };
      // debugger
      $http
        .post(
          ($scope.url = config.baseurl + "modelportfolio/featured"),
          data,
          urlconfig
        )
        .success(function (response, status, headers, config) {
          $scope.portfolioDetails = response.data;
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

          console.log($scope.portfolioDetails);

          // $scope.getportfolio($scope.portfolioDetails.id);
          // $scope.gettransactions($scope.portfolioDetails.id);
          // $scope.profitlossbymyportfolioid($scope.portfolioDetails.id);
          // $scope.userportfolioaftercalculation($scope.portfolioDetails.id);
          // $scope.analysisgraph($scope.portfolioDetails);
        })
        .error(function (data, status, header, config) {
          // debugger
          console.log(data);
        });
    };

    $scope.getmodelportfolio = function () {
      var urlconfig = {
        headers: {
          "Content-Type": "application/json;",
        },
      };
      var portfolioId = localStorage.getItem("subscribe-id");
      $scope.myportfolioId = portfolioId;
      
      $http
        .get(
          $scope.baseurl + "modelportfolio/" + $scope.myportfolioId,
          urlconfig
        )
        .success(function (response, status, headers, config) {
          $scope.data = response.data;
          $scope.data.name = localStorage.getItem("name");
          $scope.data.email = localStorage.getItem("email");
          $scope.data.phone = localStorage.getItem("phone");
          // debugger
          $scope.data.fundingrequired = "False";
          $scope.data.capital = response.data.capital;
          $scope.data.fundingamount = 0;
          $scope.data.fundingtenure = 0;
          $scope.data.balance = $scope.demobalance;
        })
        .error(function (data, status, header, config) {
          console.log(data);
        });
    };

    $scope.previous = function (req, res) {
      location.href = "/app/plans.html";
    };

    $scope.confirm = function (req, res) {
      localStorage.setItem('telegram', req.phone);
      localStorage.setItem('whatsapp', req.phone);
      localStorage.setItem('phone', req.phone);
      // debugger
      
      location.href = "/app/confirmation.html";
    };

    $scope.logout = function (req, res) {
      localStorage.clear();
      location.href = "login.html";
    };
  }
);
