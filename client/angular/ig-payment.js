app.controller("payment", function ($scope, $http, $window, $location, config) {
  $scope.baseurl = config.baseurl;
  console.log(config);
  $scope.init = function (req, res) {
    console.log("portfolioDetail");
    console.log(config.baseurl);
    var islogin = localStorage.getItem("isCustomerlogin");
    if (islogin != "1") {
      location.href = "login.html";
    } 
    $scope.data = []

    $scope.data.name = localStorage.getItem("name");
    $scope.data.email = localStorage.getItem("email");
    $scope.portfolio_name = localStorage.getItem("portfolioname");
    $scope.investamount = localStorage.getItem("investamount");
    $scope.robot = localStorage.getItem("robot");
    $scope.igusername = localStorage.getItem("igusername");
    $scope.igpassword = localStorage.getItem("igpassword");
    $scope.apikey = localStorage.getItem("apikey");
    $scope.apitype = localStorage.getItem("apitype");
    $scope.apistatus = localStorage.getItem("apistatus");
    
    // fee calculation
    let fees = ($scope.investamount  / 100) * 2;
    $scope.fees = fees
    // debugger

    // $scope.portfolioList();
    // $scope.portfolioStockList();
    $scope.getUserPortfolioDetail();
    $scope.data = {}; 

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

  

  $scope.logout = function (req, res) {
    localStorage.clear();
    location.href = "login.html";
  };

  
//  new stripe
var stripe = Stripe('pk_test_OOnWV0qFnmnbtGeWN0UbViBk00Ad922te7');
var elements = stripe.elements();

var card = elements.create('card', {
  style: {
    base: {
      iconColor: '#666EE8',
      color: '#fff',
      lineHeight: '40px',
      fontWeight: 300,
      fontFamily: 'Helvetica Neue',
      fontSize: '15px',

      '::placeholder': {
        color: '#CFD7E0',
      },
    },
  }
});
card.mount('#card-element');

function setOutcome(result) {
  var successElement = document.querySelector('.success');
  var errorElement = document.querySelector('.error');
  successElement.classList.remove('visible');
  errorElement.classList.remove('visible');

  if (result.token) {

    localStorage.setItem('portfolio_usermane', data.portfolio_usermane);
    localStorage.setItem('UserportfolioName', data.portfolioName);
    localStorage.setItem('port_email', data.port_email);
    localStorage.setItem('investamount', data.investamount);
    localStorage.setItem('telegram', data.phonenumber);
    localStorage.setItem('whatsapp', data.phonenumber);
    localStorage.setItem('phone', data.phonenumber);

    $scope.tenure = localStorage.getItem("tenure");
    var today = new Date();
    

    


   

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
           
           $scope.loading = false;
           $scope.msg = response.msg;
           $scope.data = response.data;
           console.log(response.data);
          
           location.href = "/app/robot-congrats.html";

         })
         .error(function (data, status, header, config) {
          
           console.log(data);
           
           $("#getportfolio-issue").modal("show");
         });

  } else if (result.error) {
    errorElement.textContent = result.error.message;
    errorElement.classList.add('visible');

  }
}

card.on('change', function(event) {
  setOutcome(event);
});

document.querySelector('form').addEventListener('submit', function(e) {
  e.preventDefault();
  var form = document.querySelector('form');
  var extraDetails = {
    name: form.querySelector('input[name=cardholder-name]').value,
  };
  stripe.createToken(card, extraDetails).then(setOutcome);
});

// newstripe
 
});
