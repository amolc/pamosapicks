app.controller(
  "smartPortfolio",
  function ($scope, $http, $window, $location, config) {
    $scope.baseurl = config.baseurl;
    console.log(config);

    $scope.init = function (req, res) {
      console.log("smartPortfolio");
      console.log(config.baseurl);

      $scope.getallplans();
    };
    $scope.data = {}
    $scope.data.name = localStorage.getItem('newslettername')
    $scope.data.email = localStorage.getItem('newsletteremail')
    $scope.data.phone = localStorage.getItem('newsletterphone')
    $scope.data.portfolio_id = localStorage.getItem('newsletterportfolio_id')
    $scope.data.org_id = localStorage.getItem('newsletterorg_id')
    $scope.data.plan_id = localStorage.getItem('newsletterplan_id')
    $scope.data.plantype = localStorage.getItem('qrPlan')
    console.log( $scope.data, "=====name======")


    
    $scope.message = "";


    var searchParams = new URLSearchParams($window.location.search);
    $scope.portfolio_id  = searchParams.get("id");



    $scope.getallplans = function() {
      $scope.imLoading = true
    
        var urlconfig = {
            headers: {
              "Content-Type": "application/json;"
            },
          };
          if ($scope.data.plantype == 'tele') {
             planURl =  `customer/getall-telegram-plans/?portfolio_id=${$scope.portfolio_id}&plan_id=${$scope.data.plan_id}`
          }
          else {
              planURl =  `customer/getall-newsletter-plans/?portfolio_id=${$scope.portfolio_id}&plan_id=${$scope.data.plan_id}`
          }
    
          $http
            .get( $scope.baseurl + planURl  , urlconfig)
            .success(function (data, status, headers, config) {
              console.log("++++data++++++", data)
              $scope.newsLetterPlans = data.data ;
              $scope.newsLetterPlans.forEach(function(plan) {
                plan.features = plan.plan_description.split(',');
              });
              $scope.imLoading = false
    
            })
            .error(function (data, status, header, config) {
              console.log(data);
              $scope.imLoading = false
            });
    
    }
    




    $scope.removeValidation = function (input) {

      if (input == 1) {
        $scope.validateportfolio = 0;
      }
      else if (input == 2){
        $scope.validateInvestment = 0;
      }
      else if (input == 3){
        $scope.validateBroker = 0;
      }
      $scope.message = '';
    };


    $scope.onaddAPISubmit = function (data) {
      $scope.imLoading = true
      data['org_id'] = 1
      data['portfolio_id'] = $scope.portfolio_id

      if (data.plann_id != 1){
        localStorage.setItem('newsletterPlandata', data)
        location.href = ''
      }
      else {
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
            alert("Saved Successfully")
            location.href = `news-letter-plans.html?id=${$scope.portfolio_id}`
            
            
          })
          .error(function (data, status, header, config) {
            alert(data.data)
            $scope.imLoading = false
            console.log(data);
          });
      }

        
  }




  }
);
