app.controller('staffCtrl', function($scope, $http, $window, $location, $sce, $timeout, store, config) {
    $scope.data = {}
    $scope.init = function(req, res) {
        $scope.list();
    }

    $scope.list = function(req, res) {
        $http.get(config.baseurl + 'staff/get-admin/')
            .success(function(res) {
                if (res.status == 'false') {} else {
                    $scope.dataset = res.data;
                }
            }).error(function() {});
    }

    $scope.add = function(req, res) {
        $http.post(config.baseurl + 'staff/create-admin/', $scope.data)
            .success(function(res) {
                if (res.status == 'false') {} else {
                    $scope.response = res.data;
                    // window.location.reload();
                }
            }).error(function() {});
    }

    $scope.update = function(id) {
        $http.patch(config.baseurl + 'staff/update-admin/' + id + '/', $scope.data)
            .success(function(res) {
                if (res.status == 'false') {} else {
                    $scope.data = res.data;
                }
            }).error(function() {});
    }

    $scope.delete = function(id) {
        $http.delete(config.baseurl + 'staff/delete-admin/' + id + '/')
            .success(function(res) {
                if (res.status == 'false') {} else {
                    $scope.list();
                }
            }).error(function(error_response) {
                console.log(error_response);
            });
        $window.location.reload();
    }

    $scope.redirect = function() {
        location.href = '/app/';
    }

    $scope.onedit = function(data) {
        $scope.data = data;
        $("#editform").modal("show");
    };

    $scope.ondelete = function(data) {
        $scope.data = data;
        $("#deleteform").modal("show");
    };

    $scope.addform = function() {
        $scope.data = {}
        $("#addform").modal("show");
    };

    $scope.editform = function() {
        $scope.data = {}
        $("#editform").modal("show");
    };

    $scope.onsubmit = function(data) {
        $scope.data = data
        $scope.add($scope.data);
        $("#addform").modal("hide");
    };

    $scope.oneditsubmit = function(data) {
        $scope.data = data
        $scope.update($scope.data.id);
        $("#editform").modal("hide");
    };
});
