app.controller('toodlsCtrl', function($scope, $http, $window,$location, config) {


    // $scope.data = {'stock': ETHUSD}

    $scope.init = function(req, res) {
        console.log("AlgoTrading");
        console.log(config.baseurl);

    }
    
    var vm = this;
    var register = this;

  

    $scope.baseurl = config.baseurl;

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
                        $window.location = "broker_connection.html";
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

    $scope.list = function(req, res) {
        console.log(config.baseurl);
        $http.get(config.baseurl + 'broker/')
            .success(function(res) {
                if (res.status == 'false') {} else {
                    $scope.dataset = res.data;
                    console.log('dataset: ', $scope.dataset);
                }
            }).error(function() {});
    }

    $scope.listalp = function(req, res) {
        console.log(config.baseurl);
        $http.get(config.baseurl + 'brokeralp/')
            .success(function(res) {
                if (res.status == 'false') {} else {
                    $scope.data1 = res.data;
                    console.log('dataset: ', $scope.data1);
                }
            }).error(function() {});
    }

    $scope.liststr = function(req, res) {
        if(!$scope.islogin){ location.href="login.html"}
        console.log(config.baseurl);
        $http.get(config.baseurl + 'strategies/')
            .success(function(res) {
                if (res.status == 'false') {} else {
                    $scope.data123 = res.data;
                    console.log('dataset: ', $scope.data123);
                }
            }).error(function() {});
    }

    // $scope.liststr = function(req, res) {
    //     console.log(config.baseurl);
    //     $http.get(config.baseurl + 'strategies/')
    //         .success(function(res) {
    //             if (res.status == 'false') {} else {
    //                 $scope.data123 = res.data;
    //                 console.log('dataset: ', $scope.data123);
    //             }
    //         }).error(function() {});
    // }



    $scope.add = function() {

        console.log($scope.data);

        if (typeof $scope.data.id == 'undefined') {
            //alert($scope.data.id);
            $http.post(config.baseurl + 'customer/', $scope.data)
                .success(function(res) {
                    if (res.status == 'error') {} else {
                        $scope.response = res.data;
                        console.log('message: ', $scope.response);
                        $window.location = "login.html";
                    }
                }).error(function() {});

        } 
        else {

            //alert($scope.data.id);
            $http.patch(config.baseurl + 'customer/', $scope.data)
                .success(function(res) {
                    if (res.status == 'false') {} else {
                        $scope.response = res.data;
                        console.log('message: ', $scope.response);
                        window.location.reload();
                    }
                }).error(function() {});
        }


    }
    $scope.forgotpassword = function(req, res) {

        console.log($scope.data);

        if (typeof $scope.data.id == 'undefined') {
            // alert($scope.data.id);
            $http.post(config.baseurl + 'password/email/', $scope.data)
                .success(function(res) {
                    if (res.status == 'error') {} else {
                        $scope.response = res.data;
                        console.log('message: ', $scope.response);
                        $window.location = "forgot_password.html";
                    }
                }).error(function() {});

        } else {

            // alert($scope.data.id);
            $http.patch(config.baseurl + 'password/email/', $scope.data)
                .success(function(res) {
                    if (res.status == 'false') {} else {
                        $scope.response = res.data;
                        console.log('message: ', $scope.response);
                        window.location.reload();
                    }
                }).error(function() {});
        }


    }


    $scope.addbroker = function(req, res) {

        console.log($scope.data);

        if (typeof $scope.data.id == 'undefined') {
            // alert($scope.data.id);
            $http.post(config.baseurl + 'broker/', $scope.data)
                .success(function(res) {
                    if (res.status == 'error') {} else {
                        $scope.response = res.data;
                        console.log('message: ', $scope.response);
                        $window.location = ('');
                    }
                }).error(function() {});

        } else {

            // alert($scope.data.id);
            $http.patch(config.baseurl + 'broker/', $scope.data)
                .success(function(res) {
                    if (res.status == 'false') {} else {
                        $scope.response = res.data;
                        console.log('message: ', $scope.response);
                        window.location.reload();
                    }
                }).error(function() {});
        }


    }

    $scope.addalpbroker = function(req, res) {

        console.log($scope.data);

        if (typeof $scope.data.id == 'undefined') {
            // alert($scope.data.id);
            $http.post(config.baseurl + 'brokeralp/', $scope.data)
                .success(function(res) {
                    if (res.status == 'error') {} else {
                        $scope.response = res.data;
                        console.log('message: ', $scope.response);
                        $window.location = ('');
                    }
                }).error(function() {});

        } else {

            // alert($scope.data.id);
            $http.patch(config.baseurl + 'brokeralp/', $scope.data)
                .success(function(res) {
                    if (res.status == 'false') {} else {
                        $scope.response = res.data;
                        console.log('message: ', $scope.response);
                        window.location.reload();
                    }
                }).error(function() {});
        }


    }

    $scope.brokersetting = function(rec , res) {
        console.log($scope.data);
        console.log();
        console.log('helloo');
        broker={'org_id':14,'customerId':customerId}

        
    }

    $scope.addstartbot = function(req, res) {

        console.log($scope.data);

        if (typeof $scope.data.id == 'undefined') {
            // alert($scope.data.id);
            $http.post(config.baseurl + 'start/symbol', $scope.data)
                .success(function(res) {
                    if (res.status == 'error') {} else {
                        $scope.response = res.data;
                        console.log('message: ', $scope.response);
                        $window.location = "orders.html";
                    }
                }).error(function() {});

        } else {

            // alert($scope.data.id);
            $http.patch(config.baseurl + 'start/', $scope.data)
                .success(function(res) {
                    if (res.status == 'false') {} else {
                        $scope.response = res.data;
                        console.log('message: ', $scope.response);
                        window.location.reload();
                    }
                }).error(function() {});
        }


    }

    $scope.userorder = function(req, res) {

        console.log($scope.data);

        if (typeof $scope.data.id == 'undefined') {
            // alert($scope.data.id);
            $http.post(config.baseurl + 'userorder/', $scope.data)
                .success(function(res) {
                    if (res.status == 'error') {} else {
                        $scope.response = res.data;
                        console.log('message: ', $scope.response);
                        $window.location = "userorder.html";
                    }
                }).error(function() {});

        } else {

            // alert($scope.data.id);
            $http.patch(config.baseurl + 'userorder/', $scope.data)
                .success(function(res) {
                    if (res.status == 'false') {} else {
                        $scope.response = res.data;
                        console.log('message: ', $scope.response);
                        window.location.reload();
                    }
                }).error(function() {});
        }


    }

    $scope.lgproduct = function(req, res) {

        console.log($scope.data);

        if (typeof $scope.data.id == 'undefined') {
            // alert($scope.data.id);
            $http.post(config.baseurl + 'lgproduct/lgadd', $scope.data)
                .success(function(res) {
                    if (res.status == 'error') {} else {
                        $scope.response = res.data;
                        console.log('message: ', $scope.response);
                        $window.location = "ig-orders.html";
                    }
                }).error(function() {});

        } else {

            // alert($scope.data.id);
            $http.patch(config.baseurl + 'lgproduct/', $scope.data)
                .success(function(res) {
                    if (res.status == 'false') {} else {
                        $scope.response = res.data;
                        console.log('message: ', $scope.response);
                        window.location.reload();
                    }
                }).error(function() {});
        }


    }

    $scope.lgproductlist = function(req, res) {
        console.log(config.baseurl);
        $http.get(config.baseurl + 'lgproduct/')
            .success(function(res) {
                if (res.status == 'false') {} else {
                    $scope.data12345 = res.data;
                    console.log('dataset: ', $scope.data12345);
                   // $window.location = "orders.html";
                }
            }).error(function() {});
    }

    $scope.listorder = function(req, res) {
        console.log(config.baseurl);
        $http.get(config.baseurl + 'start/')
            .success(function(res) {
                if (res.status == 'false') {} else {
                    $scope.data123 = res.data;
                    console.log('dataset: ', $scope.data123);
                   // $window.location = "orders.html";
                }
            }).error(function() {});
    }

    $scope.userorderlist = function(req, res) {
        console.log(config.baseurl);
        $http.get(config.baseurl + 'userorder/')
            .success(function(res) {
                if (res.status == 'false') {} else {
                    $scope.data123456 = res.data;
                    console.log('dataset: ', $scope.data123456);
                   // $window.location = "orders.html";
                }
            }).error(function() {});
    }

    $scope.addendtime = function(req, res) {

        console.log($scope.data);

        if (typeof $scope.data.id == 'undefined') {
            // alert($scope.data.id);
            $http.post(config.baseurl + 'endtime/', $scope.data)
                .success(function(res) {
                    if (res.status == 'error') {} else {
                        $scope.response = res.data;
                        console.log('message: ', $scope.response);
                        $window.location = "orders.html";
                    }
                }).error(function() {});

        } else {

            // alert($scope.data.id);
            $http.patch(config.baseurl + 'endtime/', $scope.data)
                .success(function(res) {
                    if (res.status == 'false') {} else {
                        $scope.response = res.data;
                        console.log('message: ', $scope.response);
                        window.location.reload();
                    }
                }).error(function() {});
        }


    }

    $scope.addstart = function() {
       $window.location = "orders.html";
       console.log("Button Press...")
    }

    $scope.addconnection = function(req, res) {
        console.log(config.baseurl);
        $http.get(config.baseurl + 'broker/')
            .success(function(res) {
                if (res.status == 'false') {} else {
                    $scope.dataset = res.data;
                    console.log('dataset: ', $scope.dataset);
                    $window.location = "#";
                }
            }).error(function() {});
    }


    $scope.logout = function(req, res) {
        localStorage.removeItem("islogin");
        location.href = 'index.html';
    }

    /* ----- New Functions ------ */
    $scope.islogin = function () {
        var islogin = localStorage.getItem("islogin");
        console.log(islogin); // gettin
        if (islogin === "1") {
            return
        } else {
            console.log("we aere in the else user not login");
            location.href = "login.html";
        }
    };
  
    // $scope.logout = function () {
    //     localStorage.clear();
    //     //location.href = "login.html";
    // };

    /* ---- This Function Run On Every Page, Carefull Temporary Solution Prod Only Fix------ */
    let initCheckLogin = function () {
        const path = "/" + window.location.pathname.split('/')[1];
        if(path === "/login.html"){
            $scope.logout();
            return
        }else if(path ==="/register.html"){
            return
        }else{
            console.log(path);
            $scope.islogin();
        }
        
    };
    // and fire it after definition

    // initCheckLogin();
    //initCheckLogin();


});