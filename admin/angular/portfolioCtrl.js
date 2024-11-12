app.controller("portfolioCtrl", function($scope, $http, $window, $location, $sce, $timeout, store, config) {


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
           
            location.href = 'index.html';
        }
        return true;

    }


    $scope.list = function(req, res) {
        $scope.checklogin = 1 ;
        if ($scope.checklogin == 1) {
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

    $scope.stocklist = function(portfolioId) {
        localStorage.setItem('portfolioId', portfolioId); // setting
        location.href = "stock.html";
    };



    $scope.redirect = function() {
        //console.log("redirect");
        location.href = "index.html";
    };



    $scope.add = function() {
        $scope.formvalidate = "true";
        //console.log("New Cars");
        console.log($scope.portfolio);

        $http.post(config.baseurl + "portfolio/", $scope.portfolio).success(function(res) {
            if (res.status == "error") {
                console.log(res.data)
            } else {
                console.log(res)
            }
            // }).error(function() {
            //         // alert("Please check your internet connection or data source..");
        });
    };

    //orderCtrl ends

    $scope.delete = function(id) {
        console.log(id);
        $scope.formvalidate = "true";
        console.log("New delete");
        // console.log($scope.data);
        $http
            .delete(config.baseurl + "category/" + id, $scope.data)
            .success(function(res) {
                $scope.response = res;
                console.log(res);
                if (res.status == "false") {
                    alert(res.message);
                } else {
                    alert("category save Successfully deleted");
                    location.reload();
                    //   $window.location = "category.html";
                }
            });
    };

    $scope.update = function(id) {
        console.log(id);
        $scope.formvalidate = "true";
        console.log("New Cars", $scope.categories);
        const data = $scope.categories.filter((e) => e.id === id);
        console.log(data);
        $http
            .patch(config.baseurl + "category/" + id, $scope.data)
            .success(function(res) {
                localStorage.setItem("data", JSON.stringify(data));
                $window.location = `category-add.html?id=${id}`;
            });
    };




    $scope.logout = function(req, res) {
        localStorage.removeItem("islogin");
        location.href = 'index.html';
    }

});