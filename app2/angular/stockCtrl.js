app.controller("stockCtrl", function($scope, $http, $window, $location, $sce, $timeout, store, config) {


    $scope.init = function(req, res) {

        alert("category");
    }

    var check = this;
    check.islogin = function(req, res) {
        var islogin = localStorage.getItem('islogin');
        $scope.name = localStorage.getItem('name');
        $scope.customerId = localStorage.getItem('id');
        $scope.org_id = localStorage.getItem('org_id');
        $scope.portfolioId = localStorage.getItem('portfolioId');
        $scope.transaction = {};
        $scope.transaction.portfolioId = $scope.portfolioId;
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
            $scope.portfolioId = localStorage.getItem('portfolioId');
            console.log($scope.customerId);
            console.log($scope.portfolioId);
            $http.get(config.baseurl + "portfolio/transaction/portfolio/" + $scope.portfolioId)
                .success(function(res) {
                    if (res.status == "false") {} else {
                        $scope.dataset = res.data;
                        console.log("portfolio: ", $scope.dataset);
                    }
                })
                .error(function() {});
        }

    };

    $scope.redirect = function() {
        //console.log("redirect");
        location.href = "index.html";
    };

    $scope.add = function() {
        $scope.formvalidate = "true";
        console.log($scope.transaction);


        $scope.transaction.transaction_value = $scope.transaction.transaction_price * $scope.transaction.transaction_shares;
        console.log("transactionvalue" + $scope.transaction.transaction_value);
        $http.post(config.baseurl + "portfolio/transaction/", $scope.transaction).success(function(res) {
            $scope.response = res;
            // console.log(res);
            if (res.status == "error") {
                console.log(res)
            } else {
                console.log("successfully updated.");
                location.reload();
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


    $scope.islogin = function(req, res) {
        var islogin = localStorage.getItem('islogin');
        $scope.name = localStorage.getItem('name');
        $scope.id = localStorage.getItem('id');
        $scope.org_id = localStorage.getItem('org_id');
        console.log(islogin); // gettin
        if (islogin == '1') {} else {
            console.log("we aere in the else loop. debug moere.. ")
            location.href = 'index.html';
        }

    }


    $scope.logout = function(req, res) {
        localStorage.removeItem("islogin");
        location.href = 'index.html';
    }

});