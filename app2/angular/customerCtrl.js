app.controller('customerCtrl', function($scope, $http, $window, config) {

    var vm = this;
    var register = this;

    $scope.data = {}

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
            $http.post(config.baseurl + 'org/', $scope.data)
                .success(function(res) {
                    if (res.status == 'error') {} else {
                        $scope.response = res.data;
                        console.log('message: ', $scope.response);
                        window.location.reload();
                    }
                }).error(function() {});

        } else {

            alert($scope.data.id);
            $http.patch(config.baseurl + 'org/', $scope.data)
                .success(function(res) {
                    if (res.status == 'false') {} else {
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