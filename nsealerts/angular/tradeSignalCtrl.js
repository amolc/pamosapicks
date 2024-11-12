app.controller("tradeSignalCtrl", function($scope, $http, $window, $location, $sce, $timeout, store, config) {

    $scope.data = {}

    $scope.init = function(req, res) {

        alert("category");
    }

    var check = this;
    check.islogin = function(req, res) {
        var islogin = localStorage.getItem('islogin');
        $scope.name = localStorage.getItem('name');
        $scope.customerId = localStorage.getItem('customerId');
        $scope.org_id = localStorage.getItem('org_id');
        $scope.portfolio = {};
        $scope.portfolio.customerId = $scope.customerId;
        console.log(islogin); // gettin
        if (islogin == '1') {} else {
            console.log("we aere in the else loop. debug moere.. ")
            location.href = 'index.html';
        }
        return true;

    }


    $scope.list = function(req, res) {
        $scope.checklogin = check.islogin();
        if ($scope.checklogin == 1) {
            console.log("login successful ");
            $http.get(config.baseurl + "portfolio/trade-signal/")
                .success(function(res) {
                    if (res.status == "false") {} else {
                        $scope.dataset = res.data;
                        console.log("Trade Signal: ", $scope.dataset);
                    }
                })
                .error(function() {});
        }

    };

    $scope.tradesignallist = function(tradeSignalId) {
        localStorage.setItem('tradeSignalId', tradeSignalId); // setting
        location.href = "trade-signal-edit.html";
    };



    $scope.redirect = function() {
        //console.log("redirect");
        location.href = "index.html";
    };



    $scope.add = function(req, res) {

        console.log($scope.data);

        if (typeof $scope.data.id == 'undefined') {
            alert($scope.data.id);
            $http.post(config.baseurl + 'portfolio/trade-signal/', $scope.data)
                .success(function(res) {
                    if (res.status == 'false') {} else {
                        $scope.response = res.data;
                        console.log('message: ', $scope.response);
                        window.location.reload();
                    }
                }).error(function() {});

        } else {

            alert($scope.data.id);
            alert($scope.data);
            $http.patch(config.baseurl + 'portfolio/trade-signal/', $scope.data)
                .success(function(res) {
                    if (res.status == 'false') {} else {
                        $scope.response = res.data;
                        console.log('message: ', $scope.response);
                        window.location.reload();
                    }
                }).error(function() {});
        }


    }

    //orderCtrl ends

    $scope.update = function(id) {
        $http.get(config.baseurl + 'portfolio/trade-signal/' + id)
            .success(function(res) {
                if (res.status == 'false') {} else {
                    $scope.data = res.data;
                    console.log('data: ', $scope.data);
                }
            }).error(function() {});
    }

    $scope.delete = function(id) {
        console.log("Delete clicked");
        $http.delete(config.baseurl + 'portfolio/trade-signal/' + id + '/')
            .success(function(res) {
                if (res.status == 'false') {} else {
                    $scope.response = res.data;
                    console.log('data: ', $scope.response);
                }
            }).error(function() {});
        $window.location.reload();
    }




    $scope.logout = function(req, res) {
        localStorage.removeItem("islogin");
        location.href = 'index.html';
    }

});