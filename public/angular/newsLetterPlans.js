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

    $scope.validateportfolio = 0;
    $scope.validateInvestment = 0;
    $scope.validateBroker = 0;
    
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
          
    
          $http
            .get( $scope.baseurl + `customer/getall-newsletter-plans/?portfolio_id=${$scope.portfolio_id}`  , urlconfig)
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

    $scope.updatePlanId = function (plan_id) {
      $scope.plan_id = plan_id
    }
    $scope.onaddAPISubmit = function (data) {
      $scope.imLoading = true
      data['plan_id'] = $scope.plan_id
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
            if (data.plann_id != 1){
              localStorage.setItem('newslettername', data.name)
              localStorage.setItem('newsletteremail', data.email)
              localStorage.setItem('newsletterphone', data.phone)
              localStorage.setItem('newsletterportfolio_id', $scope.portfolio_id)
              localStorage.setItem('newsletterorg_id', 1)
              localStorage.setItem('newsletterplan_id', data.plan_id)
              localStorage.setItem('qrPlan', 'newsletter')
              location.href = `qr-plan.html?id=${$scope.portfolio_id}`
            }
            else{
              location.href = `news-letter-plans.html?id=${$scope.portfolio_id}`
            }
            
            
          })
          .error(function (data, status, header, config) {
            alert(data.data)
            $scope.imLoading = false
            console.log(data);
          });

        
  }




  }
);
