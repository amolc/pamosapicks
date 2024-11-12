app.controller(
  "customerList",
  function ($scope, $http, $window, $location, config) {
    $scope.baseurl = config.baseurl;
    $scope.wssurl = config.wssurl;
    console.log(config);

    $scope.init = function (req, res) {
      $scope.show = false
      
      
      $scope.getCustomerList();

    };

    $scope.getCustomerList = function () {
      var searchParams = new URLSearchParams($window.location.search);
      var portfolioId = searchParams.get('id');
      $scope.portfolio_id = portfolioId
    data = {}
    $scope.url = $scope.baseurl + `customer/get-telegram-customer/?portfolio_id=${portfolioId}` ;
    var urlconfig = {
      headers: {
        "Content-Type": "application/json;"
      },
    };
    $http.get( $scope.url , data, urlconfig)
    .success(function (response, status, headers, config) {
      console.log("...sucess", response)
      $scope.newsLetterCustomerList = response.data ;
      console.log($scope.stockdata_list,"...") ;
  })
  .error(function (response, status, header, config) {
    
    console.log("...fail")
      console.log(response);

  });
    };

   $scope.addTelegramCustomer = function (req, res) {
    $scope.url = $scope.baseurl + `customer/getall-telegram-plans/` ;
    var urlconfig = {
      headers: {
        "Content-Type": "application/json;"
      },
    };
    $http.get( $scope.url , data, urlconfig)
    .success(function (response, status, headers, config) {
      console.log("...sucess")
      $scope.planList = response.data ;
      console.log($scope.planList,".planList..") ;
      $("#add-customer").modal("show");
  })
  .error(function (response, status, header, config) {
  
    console.log("...fail")
      console.log(response);
      $scope.errormsg = "We were not able to get the stockdata. Please try again after some time.";
      $("#stockdata-issue").modal('show');
  });
}


$scope.addCustomerSubmit= function (data) {
  news_letter_cust_id = data.id
  $scope.imLoading = true
  data['org_id'] = 1
  data['portfolio_id'] = $scope.portfolio_id
    var urlconfig = {
      headers: {
        "Content-Type": "application/json;",
      },
    };
    $http
      .post(
        ($scope.url =
          config.baseurl + `customer/post-telegram-customer/`),
          data,
        urlconfig
      )
      .success(function (response, status, headers, config) {
        $scope.imLoading = false
        $scope.getCustomerList();
        $("#news-letter").modal("hide");
        
      })
      .error(function (data, status, header, config) {
        alert(data.data)
        $scope.imLoading = false
        console.log(data);
      });
}


$scope.sendnewsLetterMail= function () {
  
  $("#send-email").modal("show");

}



$scope.mailsendSubmit = function (data) {
  $scope.imLoading = true

  data['portfolio_id'] = $scope.portfolio_id
    var urlconfig = {
      headers: {
        "Content-Type": "application/json;",
      },
    };
    $http
      .post(
        ($scope.url =
          config.baseurl + `customer/post-newsletter-mail/`),
          data,
        urlconfig
      )
      .success(function (response, status, headers, config) {
        $scope.imLoading = false
        $scope.getCustomerList();
        $("#send-mail").modal("hide");
        
      })
      .error(function (data, status, header, config) {
        alert(data.data)
        $scope.imLoading = false
        console.log(data);
      });
}

$scope.deleteCustomer = function (id) {

  $scope.telegramId = id

   $("#delete-telegram").modal("show");


}

  $scope.deleteCustomerSumbit = function () {

    var urlconfig = {
      headers: {
        "Content-Type": "application/json;",
      },
    };
    $http
      .delete(
        ($scope.url =
          config.baseurl + `customer/delete-telegram-customer/?telegram_cust_id=${$scope.telegramId}`),
          data,
        urlconfig
      )
      .success(function (response, status, headers, config) {
        $scope.imLoading = false
        $scope.getCustomerList();
        $("#delete-telegram").modal("hide");
        
      })
      .error(function (data, status, header, config) {
        alert(data.data)
        $scope.imLoading = false
        $("#delete-telegram").modal("hide");
        console.log(data);
      });
}


$scope.editCustomer = function (data) {
  $scope.url = $scope.baseurl + `customer/getall-telegram-plans/` ;
  var urlconfig = {
    headers: {
      "Content-Type": "application/json;"
    },
  };
  $http.get( $scope.url , data, urlconfig)
  .success(function (response, status, headers, config) {
    console.log("...sucess")
    $scope.planList = response.data ;
    console.log($scope.planList,".planList..") ;
    $scope.data = data
    $("#edit-telegram").modal("show");
})
.error(function (response, status, header, config) {
    console.log(response);
    $scope.errormsg = "We were not able to get the stockdata. Please try again after some time.";
    $("#stockdata-issue").modal('show');
});

}

$scope.editCustomerSubmit= function (data) {
  telegram_cust_id = data.id
  $scope.imLoading = true
  data['org_id'] = 1
  data['portfolio_id'] = $scope.portfolio_id
    var urlconfig = {
      headers: {
        "Content-Type": "application/json;",
      },
    };
    $http
      .put(
        ($scope.url =
          config.baseurl + `customer/put-telegram-customer/?telegram_cust_id=${telegram_cust_id}`),
          data,
        urlconfig
      )
      .success(function (response, status, headers, config) {
        $scope.imLoading = false
        $scope.getCustomerList();
        $("#edit-telegram").modal("hide");
        
      })
      .error(function (data, status, header, config) {
        $scope.imLoading = false
        console.log(data);
      });
}



}

);

