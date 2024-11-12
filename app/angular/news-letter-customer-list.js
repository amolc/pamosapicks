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
    $scope.url = $scope.baseurl + `customer/get-newsletter-customer/?portfolio_id=${portfolioId}` ;
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

   $scope.newsLetter = function (req, res) {

      $("#news-letter").modal("show");

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
            config.baseurl + `customer/post-newsletter-customer/`),
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

  $scope.newsletterId = id

   $("#delete-news-letter").modal("show");


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
          config.baseurl + `customer/delete-newsletter-customer/?news_letter_cust_id=${$scope.newsletterId}`),
          data,
        urlconfig
      )
      .success(function (response, status, headers, config) {
        $scope.imLoading = false
        $scope.getCustomerList();
        $("#delete-news-letter").modal("hide");
        
      })
      .error(function (data, status, header, config) {
        alert(data.data)
        $scope.imLoading = false
        $("#delete-news-letter").modal("hide");
        console.log(data);
      });
}


$scope.editCustomer = function (data) {

  $scope.data = data

   $("#edit-news-letter").modal("show");
}

$scope.editCustomerSubmit= function (data) {
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
      .put(
        ($scope.url =
          config.baseurl + `customer/put-newsletter-customer/?news_letter_cust_id=${news_letter_cust_id}`),
          data,
        urlconfig
      )
      .success(function (response, status, headers, config) {
        $scope.imLoading = false
        $scope.getCustomerList();
        $("#edit-news-letter").modal("hide");
        
      })
      .error(function (data, status, header, config) {
        $scope.imLoading = false
        console.log(data);
      });
}



}

);

