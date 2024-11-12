
app.directive("sparklinechart", function () {

    return {

        restrict: "E",

        scope: {

            data: "@"

        },

        compile: function (tElement, tAttrs, transclude) {

            tElement.replaceWith("<span>" + tAttrs.data + "</span>");

            return function (scope, element, attrs) {

                attrs.$observe("data", function (newValue) { 
                    newValue = newValue.replace("[","");
                    newValue = newValue.replace("]","");
                    var array = newValue.split(",");
                    console.log(array);
                    console.log(typeof array);
                    element.sparkline(array , { type: 'line', width: '96%', height: '100px', 
                    lineWidth:2,
                    changeRangeMin: -10, 
                    chartRangeMax: 10,
                    lineColor:"#2e76bb" ,
                    fillColor: false});

                });

            };

        }

    };

});



app.controller('index-ctrl', function($scope, $http, $window, config) {


    var vm = this;
    var register = this;
    $("#pagecounter").load("pagecounter.html"); 
    
    $scope.data = {}

    $scope.baseurl = config.baseurl;
    console.log($scope.baseurl)
    const urlParams = new URLSearchParams($window.location.search);
    

    $scope.modelportfolioId = urlParams.get('modelportfolioId') || 1;


    

    $scope.init = function (req, res) {


        $scope.islogin = localStorage.getItem("islogin");
        
        console.log( $scope.islogin);


        $scope.name = localStorage.getItem("name");
        $scope.email = localStorage.getItem('email');
        $scope.phone = localStorage.getItem("phone");


        console.log("portfolio would be automatically displayed.")
        $scope.portfoliolist();
      
       

      
    }

    $scope.logout = function (req, res) {
        localStorage.clear();
        location.href = "index.html";
      };
    

    
    $scope.portfoliolist = function (req, res) {
        $scope.customerId = 37 ;
        console.log($scope.customerId);
        $scope.url =
          config.baseurl  +  "roboportfoliolive/getFeaturedRoi" ;
        console.log( $scope.url)
        $http
           .get($scope.url)
           .success(function (res) {
            if (res.status == "false") {
            } else {
              $scope.portfoliolist = res.data;

              for (var i=0; i<res.data.length; i++) {
                    console.log(res.data[i].id)
                   
                   
              }


              console.log("portfoliolist: ", $scope.portfoliolist);
              $("#portfoliolist").removeClass("ng-hide");
            }
          })
          .error(function () { });
      };
   


    vm.signupvalidate = function(data) {
        if (data['name'] == "" || (data['name'] === undefined)) {
            console.log(data['name']);
            $scope.message = "Please provide a name."
            console.log(  $scope.message);
            $scope.validatename = "1";
            return false;

        } else if (data['email'] == "" || (data['email'] === undefined)) {
            $scope.message = "Please provide an email address."
                console.log(  $scope.message);
            $scope.validateemail = "1";
            return false;
        }
          else if (data['phone'] == "" || (data['phone'] === undefined)) {
            $scope.message = "Please provide a phone number."
                console.log(  $scope.message);
            $scope.validatephone = "1";
            return false;
        }
        else if (data['password'] == "" || (data['password'] === undefined)) {
            $scope.message = "Please provide password."
                console.log(  $scope.message);
            $scope.validatepassword = "1";
            return false;
        }
        else {
            var confirm = 1
            return confirm;
        }

    }


    $scope.customersignup = function(req, res) {
        // console.log($scope.data);
        $scope.formvalidate = vm.signupvalidate($scope.data);
        // console.log($scope.formvalidate);
        if ($scope.formvalidate == 1) {
            // console.log($scope.data);

            var config = {
                headers: {
                    'Content-Type': 'application/json;',
                    'Access-Control-Allow-Origin': '*',
                }
            }
            console.log("this is before post");
            // console.log($scope.baseurl);
            // console.log($scope.data);
            $http.post($scope.baseurl + 'customer/sign-up', $scope.data)
                .success(function(response, status, headers, config) {
                    console.log("Successful");
                    console.log(response);
                    
                    // $window.location = "login.html";
                    if(response.status== "error"){
                        $scope.msg = response.data ;
                        $("#error").modal("show");
                    }

                    else if (response.status =="success") {
                        $scope.msg = response.data ;
                        $("#success").modal("show");
                        $window.location = "intro/login.html";
                    }


                })
                .error(function(response, status, header) {
                    $scope.ResponseDetails = "response: " + response +
                        "<hr />status: " + status +
                        "<hr />headers: " + header +
                        "<hr />config: " + config;

                    // console.log(response);


                });

        } else {
            console.log("Resolve validation error");
        }


    }

    $scope.openlink = function(pagename){
      $window.location = pagename;
    }


    $scope.modelportfolios = function(req, res) {
        console.log(config.baseurl);
        $http.get(config.baseurl + 'org/')
            .success(function(res) {
                if (res.status == 'false') {} else {
                    $scope.response = res.data;
                    console.log('message: ', $scope.response);
                    window.location.reload();
                }
            }).error(function() {});
    }


    
});