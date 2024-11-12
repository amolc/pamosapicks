app.controller(
  "confirmation",
  function ($scope, $http, $window, $location, config) {
    $scope.baseurl = config.baseurl;
    console.log(config);

    $scope.init = function (req, res) {
      var islogin = localStorage.getItem("isCustomerlogin");
      if (islogin != "1") {
        location.href = "login.html";
      }
      $scope.data = {};

      $scope.data.portfolio_name = localStorage.getItem("portfolioname");
      $scope.data.userPortfolio_name = localStorage.getItem("UserportfolioName");
      $scope.data.robot = localStorage.getItem("robot");
      $scope.data.customer_id = localStorage.getItem("customer_Id");
      $scope.data.customer_name = localStorage.getItem("customerName");
      $scope.data.org_id = localStorage.getItem("org_id");
      $scope.data.portfolio_usermane = localStorage.getItem("portfolio_usermane");
      $scope.data.investamount = localStorage.getItem("investamount");
      $scope.data.phone = localStorage.getItem("phone");
      $scope.data.port_email = localStorage.getItem("port_email");
    };


    var vm = this;
    $scope.baseurl = config.baseurl;

    $scope.previous = function (req, res) {
      location.href = "/ig-personaldetail.html";
    }

    $scope.confirm = function () {
      $scope.imLoading = true;
      
      $scope.data
      $scope.data.robot = localStorage.getItem("robot");
      $scope.data.portfolio_name = localStorage.getItem("portfolioname");
      $scope.data.userPortfolio_name = localStorage.getItem("UserportfolioName");
      $scope.data.portfolio_usermane = localStorage.getItem("portfolio_usermane");
      $scope.data.investamount = localStorage.getItem("investamount");
      $scope.data.email = localStorage.getItem("port_email");

      var urlconfig = {
        headers: {
          "Content-Type": "application/json;",
        },
      };

    $http
      .post(
        $scope.baseurl + "stockdata/saveigrobotportfolio",
        $scope.data,
        urlconfig
      )
      .success(function (response, status, headers, config) {
        
        $scope.msg = response.msg;
        $scope.data = response.data;
        console.log(response.data);
        $scope.imLoading = false;
        location.href = "/robot-congrats.html";

      })
      .error(function (data, status, header, config) {
        $scope.imLoading = false;
        console.log(data);
        
        $("#getportfolio-issue").modal("show");
      });

    }

    $scope.logout = function (req, res) {
      localStorage.clear();
      location.href = "login.html";
    };
  }
);

