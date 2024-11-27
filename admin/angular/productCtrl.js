app.controller('productCtrl', function($scope, $http, $window, $location, $sce, $timeout, store, config) {

    $scope.data = {};
  
    $scope.init = function(req, res) {
        $scope.list();
    };

    $scope.list = function(req, res) {
        console.log(config.baseurl);
        
        $http.get(config.baseurl + 'product/products/')
            .success(function(res) {
                if (res.status == 'false') {
                    // Handle error or empty response
                } else {
                    $scope.dataset = res.data;
                    console.log('dataset: ', $scope.dataset);
                }
            }).error(function() {
                // Handle error
            });
    };

    $scope.add = function(req, res) {
        console.log($scope.data);
        
        $http.post(config.baseurl + 'product/products/', $scope.data)
            .success(function(res) {
                if (res.status == 'false') {
                    // Handle error
                } else {
                    $scope.response = res.data;
                    console.log('message: ', $scope.response);
                    // window.location.reload();
                }
            }).error(function() {
                // Handle error
            });
    };

    $scope.update = function(id) {
        
        $http.patch(config.baseurl + 'product/products/' + id + '/', $scope.data)
            .success(function(res) {
                if (res.status == 'false') {
                    // Handle error
                } else {
                    $scope.data = res.data;
                    console.log('data: ', $scope.data);
                }
            }).error(function() {
                // Handle error
            });
    };

    $scope.delete = function(id) {
        console.log("delete id:", id);
        
        $http.delete(config.baseurl + 'product/products/'+ id + '/')
            .then(function(response) {
                if (response.data.status === 'false') {
                    // Handle error
                    console.log("Error: ", response.data.message);
                } else {
                    console.log("Property deleted successfully.");
                    // Refresh the property list after successful deletion
                    $scope.list();
                }
            })
            .catch(function(error_response) {
                console.error("Error response:", error_response);
            });
    };
    

    $scope.redirect = function() {
        location.href = '/app/';
    };

    $scope.onedit = function(data) {
        console.log(data);
        $scope.data = data;
        console.log($scope.data);
        $("#editform").modal("show");
    };

    $scope.ondelete = function(data) {
        console.log("delete modal");
        $scope.data = data;
        $("#deleteform").modal("show");
    };

    $scope.addform = function() {
        $scope.data = {};
        $("#addform").modal("show");
    };

    $scope.editform = function() {
        $scope.data = {};
        $("#editform").modal("show");
    };

    $scope.onsubmit = function(data) {
        $scope.data = data;
        console.log($scope.data);
        $scope.add($scope.data);
        $("#addform").modal("hide");
    };

    $scope.oneditsubmit = function(data) {
        console.log("onedit");
        $scope.data = data;
        console.log($scope.data.id);
        $scope.update($scope.data.id);
        $("#editform").modal("hide");
    };

    $scope.onedit = function(data) {
        console.log(data);
        $scope.data = data;
        console.log($scope.data);
        $("#editform").modal("show");
    };

    $scope.ondelete = function(data) {
        console.log("delete modal");
        $scope.data = data;
        $("#deleteform").modal("show");
    };

    $scope.addform1 = function() {
        $scope.data = {};
        $("#addform1").modal("show");
    };

    $scope.editform1 = function() {
        $scope.data = {};
        $("#editform1").modal("show");
    };

    $scope.onsubmit1 = function(data) {
        $scope.data = data;
        console.log($scope.data);
        $scope.add($scope.data);
        $("#addform1").modal("hide");
    };

    $scope.oneditsubmit1 = function(data) {
        console.log("onedit");
        $scope.data = data;
        console.log($scope.data.id);
        $scope.update($scope.data.id);
        $("#editform1").modal("hide");
    };
});
