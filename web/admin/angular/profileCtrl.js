app.controller('profileCtrl', function($scope, $http, $window, config) {

    var vm = this;
    var register = this;

    $scope.data = {}

    $scope.baseurl = config.baseurl;
    console.log($scope.baseurl)

     $scope.logout = function (req, res) {
        localStorage.clear();
        location.href = "index.html";
      };


     $scope.init = function(req, res) {

         var islogin = localStorage.getItem("islogin");

         if (islogin != "1") {
                location.href = "index.html";
              }else{
                $scope.name = localStorage.getItem("name");
                $scope.customerId = localStorage.getItem("customerId");
                console.log($scope.customerId);
                $scope.getprofile($scope.customerId)
              }
         }



    $scope.getprofile = function(customerId){
        var data = {}
        data.customer_id = customerId ;
        data.alpaca_cash = $scope.alpaca_cash ;

        console.log(data);

          var urlconfig = {
              headers: {
                "Content-Type": "application/json;"
              },
            };

            $http
              .post( $scope.baseurl + "customer/getProfile", data, urlconfig)
              .success(function (resppnse, status, headers, config) {
                $scope.profile = resppnse.data ;

              })
              .error(function (data, status, header, config) {
                console.log(data);
              });

    }

    $scope.saveprofile = function(data){


        console.log(data);

          var urlconfig = {
              headers: {
                "Content-Type": "application/json;"
              },
            };

            $http
              .post( $scope.baseurl + "customer/saveProfile", data, urlconfig)
              .success(function (response, status, headers, config) {
                $scope.profile = response.data ;
                console.log($scope.profile)
                localStorage.setItem("name", response.data.name);
                $scope.name = localStorage.getItem("name")

              })
              .error(function (data, status, header, config) {
                console.log(data);
              });

    }


    vm.loginvalidate = function(data) {
        console.log(data);
        if (data['email'] == "") {
            $scope.message = "Please provide an email address."
            $scope.validateemail = "1";
            return false;
        } else if (data['password'] == "") {
            $scope.message = "Please provide password."
            $scope.validatepassword = "1";
            return false;
        } else {
            var confirm = 1
            return confirm;
        }

    }


    $scope.login = function(req, res) {
        console.log($scope.data);
        $scope.formvalidate = vm.loginvalidate($scope.data);
        if ($scope.formvalidate == 1) {
            console.log($scope.data);

            var config = {
                headers: {
                    'Content-Type': 'application/json;',
                    'Access-Control-Allow-Origin': '*',
                }
            }
            console.log("this is before post");
            console.log($scope.baseurl);
            console.log($scope.data);
            $http.post($scope.baseurl + 'customer/login', $scope.data)
                .success(function(response, status, headers, config) {

                    if (response.status === "passworderror") {
                        $scope.message = response.msg;
                        $scope.validatepassword = "1";
                        console.log($scope.message);
                    } else if (response.status === "emailerror") {
                        $scope.message = response.msg;
                        $scope.validateemail = "1";
                        console.log($scope.message);
                    } else {
                        console.log(response.data);
                        localStorage.setItem('islogin', '1'); // setting
                        localStorage.setItem('name', response.data.name);
                        localStorage.setItem('email', response.data.email);
                        localStorage.setItem('customerId', response.data.id);
                        localStorage.setItem('org_id', response.data.org_id);
                        $window.location = "portfolio.html";
                    }

                })
                .error(function(response, status, header) {
                    $scope.ResponseDetails = "response: " + response +
                        "<hr />status: " + status +
                        "<hr />headers: " + header +
                        "<hr />config: " + config;

                    console.log(response);


                });

        } else {
            console.log("Resolve validation error");
        }


    }


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
                    
                    $window.location = "login.html";

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


    $scope.list = function(req, res) {
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


    $scope.add = function(req, res) {

        console.log($scope.data);

        if (typeof $scope.data.id == 'undefined') {
            alert($scope.data.id);
            $http.post(config.baseurl + 'customer/sign-in', $scope.data)
                .success(function(res) {
                    if (res.status == 'error') {} else {
                        $scope.response = res.data;
                        console.log('message: ', $scope.response);
                        window.location.reload();
                    }
                }).error(function() {});

        }


    }


    $scope.update = function(id) {
        $http.get(config.baseurl + 'org/' + id)
            .success(function(res) {
                if (res.status == 'false') {} else {
                    $scope.data = res.data;
                    console.log('data: ', $scope.data);
                }
            }).error(function() {});
    }

    $scope.delete = function(id) {
        $http.delete(config.baseurl + 'org/' + id)
            .success(function(res) {
                if (res.status == 'false') {} else {
                    $scope.response = res.data;
                    console.log('data: ', $scope.response);
                }
            }).error(function() {});
        $window.location.reload();
    }





    $scope.redirect = function() {
        //console.log("redirect");
        location.href = 'index.html';
    }


    $scope.updateattachment = function() {
        console.log('yes');
        var img = new Image();
        var newfile = document.getElementById("file_browse").files[0];
        var fileDisplayArea = document.getElementById('fileDisplayArea');
        var imageType = /image.*/;
        if (newfile.type.match(imageType)) {
            var oFReader = new FileReader();
            oFReader.onload = function(oFREvent) {
                $scope.data.thumbnail = document.getElementById("file_browse").files[0].name;
                console.log($scope.data.thumbnail);
                $scope.data.thumbnailimage = oFReader.result;
                console.log($scope.data.thumbnailimage);
                $scope.$apply();

            };
            oFReader.readAsDataURL(newfile);
            console.log($scope.data);
        } else {
            $scope.item.item_imagename = '';
            $scope.item.item_image = '';
        }
    };






    //orderCtrl ends
});