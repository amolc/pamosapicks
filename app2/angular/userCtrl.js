app.controller('categoryCtrl', function($scope, $http, $window, $location, $sce, $timeout, store) {


    var baseurl = "https://api.superadmin.shop/api/";



    $scope.listcategories = function(req, res) {

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