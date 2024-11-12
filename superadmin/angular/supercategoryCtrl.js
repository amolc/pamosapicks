app.controller('supercategoryCtrl', function($scope, $http, $window, $location, $sce, $timeout, store) {

    if (document.location.hostname == "localhost") {
        $scope.baseurl = "http://localhost:9001/api/";
    } else {
        $scope.baseurl = "https://api.superadmin.shop/api/";
    }

    $scope.data = {}
    $scope.givealert = function(req, res) {

        alert("I am alert");
    }

    $scope.init = function(req, res) {


    }

    $scope.list = function(req, res) {
        $http.get($scope.baseurl + 'supercategory/')
            .success(function(res) {
                if (res.status == 'false') {} else {
                    $scope.dataset = res.data;
                    console.log('dataset: ', $scope.dataset);
                }
            }).error(function() {});
    }


    $scope.add = function(req, res) {

        alert("add");
        console.log($scope.data);
        $http.post($scope.baseurl + 'supercategory/', $scope.data)
            .success(function(res) {
                if (res.status == 'false') {} else {
                    $scope.message = res.data;
                    console.log('message: ', $scope.message);
                }
            }).error(function() {});
    }


    $scope.update = function(req, res) {
        $http.get($scope.baseurl + 'supercategory/')

        .success(function(res) {
            if (res.status == 'false') {} else {
                $scope.categories = res.data;
                console.log('categories: ', $scope.categories);
            }
        }).error(function() {});
    }

    $scope.redirect = function() {
        //console.log("redirect");
        location.href = 'index.html';
    }



    //orderCtrl ends
});