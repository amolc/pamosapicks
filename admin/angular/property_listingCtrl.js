app.controller('property_listingCtrl', function($scope, $http, $window, $location, $sce, $timeout, store, config) {
    $scope.data = {}

    // Initialization function
    $scope.init = function(req, res) {
        $scope.list();
    }

    // Function to list all properties
    $scope.list = function(req, res) {
        console.log(config.baseurl);
        
        $http.get(config.baseurl + 'property_listing/get-property_list/')
            .success(function(res) {
                if (res.status == 'false') {} else {
                    $scope.dataset = res.data;
                    console.log('dataset: ', $scope.dataset);
                }
            }).error(function() {});
    }

    // Function to add a property
    $scope.add = function(req, res) {
        console.log($scope.data);
        console.log(config.baseurl + 'property_listing/create-property_list/');
        
        $http.post(config.baseurl + 'property_listing/create-property_list/', $scope.data)
            .success(function(res) {
                if (res.status == 'false') {} else {
                    $scope.response = res.data;
                    console.log('message: ', $scope.response);
                }
            }).error(function() {});
    }

    // Function to update a property
    $scope.update = function(id) {
        console.log(config.baseurl + 'property_listing/update-property_list/' + id + '/');
        $http.patch(config.baseurl + 'property_listing/update-property_list/' + id + '/', $scope.data)
            .success(function(res) {
                if (res.status == 'false') {} else {
                    $scope.data = res.data;
                    console.log('data: ', $scope.data);
                }
            }).error(function() {});
    }

    // Function to delete a property
    $scope.delete = function(id) {
        console.log(config.baseurl + 'property_listing/delete-property_list/' + id + '/');
        $http.delete(config.baseurl + 'property_listing/delete-property_list/' + id + '/')
            .success(function(res) {
                if (res.status == 'false') {} else {
                    $scope.list();
                }
            }).error(function(error_response) {
                console.log(error_response);
            });
        $window.location.reload();
    }

    // Redirect function
    $scope.redirect = function() {
        location.href = '/app/';
    }

    // Function to handle edit
    $scope.onedit = function(data) {
        console.log(data);
        $scope.data = data;
        console.log($scope.data);
        $("#editform").modal("show");
    };

    // Function to handle delete
    $scope.ondelete = function(data) {
        console.log("delete modal");
        $scope.data = data;
        $("#deleteform").modal("show");
    };

    // Function to show add form
    $scope.addform = function() {
        $scope.data = {}
        $("#addform").modal("show");
    };

    // Function to show edit form
    $scope.editform = function() {
        $scope.data = {}
        $("#editform").modal("show");
    };

    // Function to submit data for adding a new property
    $scope.onsubmit = function(data) {
        $scope.data = data;
        console.log($scope.data);
        $scope.add($scope.data);
        $("#addform").modal("hide");
    };

    // Function to submit data for editing a property
    $scope.oneditsubmit = function(data) {
        console.log("onedit");
        $scope.data = data;
        console.log($scope.data.id);
        $scope.update($scope.data.id);
        $("#editform").modal("hide");
    };
});
