app.controller(
  "confirmation",
  function ($scope, $http, $window, $location, config) {
    $scope.baseurl = config.baseurl;
    console.log(config);

    $scope.init = function (req, res) {
      var islogin = localStorage.getItem("islogin");
      if (islogin != "1") {
        location.href = "login.html";
      }
      $scope.data = {};

      $scope.data.name = localStorage.getItem("name");
      $scope.data.email = localStorage.getItem("email");
      $scope.data.portfolio_name = localStorage.getItem("portfolioname");
      $scope.data.userPortfolio_name = localStorage.getItem("UserportfolioName");
      $scope.tenure = localStorage.getItem("tenure");
      $scope.data.robot = localStorage.getItem("robot");
      $scope.data.customer_id = localStorage.getItem("customerId");
      $scope.data.customer_name = localStorage.getItem("name");
      
      $scope.data.igusername = localStorage.getItem("igusername");
      $scope.data.igpassword = localStorage.getItem("igpassword");
      $scope.data.apikey = localStorage.getItem("apikey");
      $scope.data.apitype = localStorage.getItem("apitype");
      $scope.data.apistatus = localStorage.getItem("apistatus");
      $scope.data.org_id = localStorage.getItem("org_id");
      $scope.data.portfolio_usermane = localStorage.getItem("portfolio_usermane");
      $scope.data.investamount = localStorage.getItem("investamount");
      $scope.data.phone = localStorage.getItem("phone");
      $scope.data.port_email = localStorage.getItem("port_email");
      // debugger
      console.log("portfolioDetail", $scope.data);
      console.log(config.baseurl);

      $scope.name = localStorage.getItem("name");
      // $scope.portfolioList();
      // $scope.portfolioStockList();
      // $scope.getUserPortfolioDetail();
      // $scope.getmodelportfolio();
      


      // $scope.data.tenure = localStorage.getItem("tenure");
      console.log($scope.tenure, "tenture....");
      // plans
      var tenure = localStorage.getItem("tenure");
      $scope.whatsapp = localStorage.getItem("whatsapp");
      $scope.telegram = localStorage.getItem("telegram");
      $scope.enddates = localStorage.getItem("enddate");

      var dateformat = new Date($scope.enddates).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      console.log(dateformat)
      $scope.enddates = dateformat
      // debugger


      const timestamp = new Date($scope.enddates);
      // debugger

      // const year = timestamp.getFullYear();
      // const month = timestamp.toLocaleString("default", { month: "long" });
      // const day = timestamp.getDate();

      // const formattedDate = `${day} ${month} ${year}`;
      // $scope.enddate = formattedDate;

      const date = new Date($scope.enddates);

      const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
      ];

      // Format the date in "DD MMMM YYYY" format
      $scope.enddate = `${date.getDate()} ${monthNames[date.getMonth()]} ${date.getFullYear()}`;

      // console.log(formattedDate);

      const timestam = new Date();

      const yearr = timestam.getFullYear();
      const monthh = timestam.toLocaleString("default", { month: "long" });
      const dayy = timestam.getDate();

      const formattedDat = `${dayy} ${monthh} ${yearr}`;
      $scope.startdate = formattedDat;

      $scope.tenure = tenure;

      if ($scope.tenure == "12") {
        $scope.cost = 400;
        $scope.plan_name = "Yearly";
      }
      if ($scope.tenure == "6") {
        $scope.cost = 240;
        $scope.plan_name = "Half Yearly";
      }
      if ($scope.tenure == "4") {
        $scope.cost = 135;
        $scope.plan_name = "Quarterly";
      }
      if ($scope.tenure == "1") {
        $scope.cost = 50;
        $scope.plan_name = "Monthly";
      }
      if ($scope.tenure == "0") {
        $scope.cost = 0;
        $scope.plan_name = "Free";
      }
      localStorage.setItem('cost', $scope.cost);


    };
    $scope.currentPage = 1; // Current page number
    $scope.itemsPerPage = 3; // Number of items per page

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

    // $scope.getUserPortfolioDetail = function (req, res) {
    //   var data = {};
    //   // var searchParams = new URLSearchParams($window.location.search);
    //   var portfolioId = localStorage.getItem('subscribe-id');
    //   data.myportfolioId = portfolioId;

    //   console.log(data);
    //   var urlconfig = {
    //     headers: {
    //       "Content-Type": "application/json;",
    //     },
    //   };
    //   // debugger
    //   $http
    //     .post(
    //       $scope.url =
    //       config.baseurl + "modelportfolio/featured",
    //       data,
    //       urlconfig
    //     )
    //     .success(function (response, status, headers, config) {
    //       $scope.portfolioDetails = response.data;
    //       // if ($scope.portfolioDetails.portfolio_enddate) {
    //       //     $scope.portfolioDetails.portfolio_enddate = new Date(parseInt($scope.portfolioDetails.portfolio_enddate)).toISOString();
    //       // }
    //       $scope.enddate = $scope.portfolioDetails.portfolio_enddate
    //       var durationInMilliseconds = $scope.enddate - $scope.portfolioDetails.portfolio_startdate;

    //       // Calculate the duration in days
    //       var durationInDays = durationInMilliseconds / (1000 * 60 * 60 * 24);

    //       // Store the duration in your scope variable
    //       $scope.duration = durationInDays;
    //       var dateObj = new Date($scope.enddate);

    //       // Extract year, month, and day components
    //       var year = dateObj.getFullYear();
    //       var month = String(dateObj.getMonth() + 1).padStart(2, '0');  // Month is zero-based
    //       var day = String(dateObj.getDate()).padStart(2, '0');

    //       // Format the components into yyyy-mm-dd format
    //       $scope.formattedEndDate = year + '-' + month + '-' + day;

    //       // localStorage.setItem('portfolioname', response.data.portfolio_name);



    //       console.log($scope.portfolioDetails);

    //       // $scope.getportfolio($scope.portfolioDetails.id);
    //       // $scope.gettransactions($scope.portfolioDetails.id);
    //       // $scope.profitlossbymyportfolioid($scope.portfolioDetails.id);
    //       // $scope.userportfolioaftercalculation($scope.portfolioDetails.id);
    //       // $scope.analysisgraph($scope.portfolioDetails);
    //     })
    //     .error(function (data, status, header, config) {
    //       // debugger
    //       console.log(data);
    //     });
    // };

    // $scope.getmodelportfolio = function () {
    //   var urlconfig = {
    //     headers: {
    //       "Content-Type": "application/json;",
    //     },
    //   };
    //   var portfolioId = localStorage.getItem("subscribe-id");
    //   $scope.myportfolioId = portfolioId;

    //   $http
    //     .get(
    //       $scope.baseurl + "modelportfolio/" + $scope.myportfolioId,
    //       urlconfig
    //     )
    //     .success(function (response, status, headers, config) {
    //         debugger
    //       $scope.data = response.data;
    //       // $scope.data.name = localStorage.getItem("name");
    //       // $scope.data.email = localStorage.getItem("email");
    //       // $scope.data.phone = localStorage.getItem("phone");
    //       $scope.data.fundingrequired = "False";
    //       $scope.data.capital = response.data.capital;
    //       $scope.data.fundingamount = 0;
    //       $scope.data.fundingtenure = 0;
    //       $scope.data.balance = $scope.demobalance;
    //     })
    //     .error(function (data, status, header, config) {
    //       console.log(data);
    //     });
    // };


    $scope.previous = function (req, res) {
      location.href = "/app/ig-personaldetail.html";
    }

    $scope.confirm = function () {
      $scope.imLoading = true;
      // location.href = "/app/ig-payment.html";
      var today = new Date();
      
      $scope.tenure = "12"

      if ($scope.tenure == "12"){
        $scope.data.enddate = new Date(new Date().setDate(today.getDate() + 365));
        
      }
      if ($scope.tenure == "6"){
       $scope.data.enddate = new Date(new Date().setDate(today.getDate() + 180));
       
      }
      if ($scope.tenure == "4"){
       $scope.data.enddate = new Date(new Date().setDate(today.getDate() + 120));
      }
      if ($scope.tenure == "1"){
       $scope.data.enddate = new Date(new Date().setDate(today.getDate() + 30));
      }
      if ($scope.tenure == "0"){
       $scope.data.enddate = new Date(new Date().setDate(today.getDate() + 7));
      }
      $scope.data
      $scope.data.enddate
      $scope.data.robot = localStorage.getItem("robot");
      $scope.data.portfolio_name = localStorage.getItem("portfolioname");
      $scope.data.userPortfolio_name = localStorage.getItem("UserportfolioName");
      $scope.data.portfolio_usermane = localStorage.getItem("portfolio_usermane");
      $scope.data.investamount = localStorage.getItem("investamount");
      $scope.data.email = localStorage.getItem("port_email");
      $scope.data.phone = localStorage.getItem("phone");
      $scope.data.igusername = localStorage.getItem("igusername");
      $scope.data.igpassword = localStorage.getItem("igpassword");
      $scope.data.apikey = localStorage.getItem("apikey");
      $scope.data.acctype = localStorage.getItem("apitype");
      $scope.data.apistatus = localStorage.getItem("apistatus");
      // console.log(typeof data, "--data--");
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
        $scope.imLoading = true;
        location.href = "/app/robot-congrats.html";

      })
      .error(function (data, status, header, config) {
        $scope.imLoading = true;
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

