app.controller('settingsCtrl', function($scope, $http, $window, $location, $sce, $timeout, store) {

    var baseurl = "/api/";

    $scope.data = {}
    $scope.givealert = function(req, res) {

        alert("I am alert");
    }

    $scope.init = function(req, res) {

        alert("settings");
    }

    
    $scope.listsettings = function(req, res) {
        $http.get(baseurl + 'settings/')
            .success(function(res) {
                if (res.status == 'false') {} else {
                    $scope.supercategories = res.data;
                    console.log('categories: ', $scope.supercategories);
                }
            }).error(function() {});
    }


    $scope.addsettings = function(req, res) {

        alert("add settings");
        console.log($scope.data);
        $http.get(baseurl + 'addsettingsni/')
            .success(function(res) {
                if (res.status == 'false') {} else {
                    $scope.categories = res.data;
                    console.log('categories: ', $scope.categories);
                }
            }).error(function() {});
    }


    $scope.updatesettings = function(req, res) {
        $http.get(baseurl + 'category/')

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