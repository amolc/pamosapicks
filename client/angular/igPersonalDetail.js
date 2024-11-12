app.controller(
  "personalDetail",
  function ($scope, $http, $window, $location, config) {
    $scope.baseurl = config.baseurl;

    $scope.init = function (req, res) {
      $scope.data = []
      localStorage.setItem('portfolioname', "GLOBALFUND");
      localStorage.setItem('robot', "ig");
      $scope.data.portfolio_name = localStorage.getItem("portfolioname");
      $scope.data.robot = localStorage.getItem("robot");
      $scope.data.name = localStorage.getItem("customerName");
      console.log("portfolioDetail");
      console.log(config.baseurl);
      var islogin = localStorage.getItem("isCustomerlogin");
      if (islogin != "1") {
        location.href = "login.html";
      } 

      // $scope.getUserPortfolioDetail();
    };
    $scope.currentPage = 1; // Current page number
    $scope.itemsPerPage = 3; // Number of items per page
    $scope.name = localStorage.getItem("customerName");

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
      var portfolioId = 25;
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

    $scope.previous = function (req, res) {
      location.href = "/portfolio-list.html";
    };

    $scope.confirm = function (data) {
      
      localStorage.setItem('portfolio_usermane', data.portfolio_usermane);
      localStorage.setItem('UserportfolioName', data.portfolioName);
      localStorage.setItem('port_email', data.port_email);
      localStorage.setItem('investamount', data.investamount);
      localStorage.setItem('telegram', data.phonenumber);
      localStorage.setItem('whatsapp', data.phonenumber);
      localStorage.setItem('phone', data.phonenumber);
    

      
      
      location.href = "/ig-confirmation.html";
      // location.href = "/ig-payment.html";
    };

    $scope.logout = function (req, res) {
      localStorage.clear();
      location.href = "login.html";
    };
  }
);
