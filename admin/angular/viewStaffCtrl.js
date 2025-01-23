app.controller("viewStaffCtrl", function ($scope, $http, $window, $location, config) {
    $scope.staff = {};
    $scope.urlParams = Object.fromEntries(new URLSearchParams(window.location.search));

    $scope.init = function () {
        console.log("Initialization of viewStaffCtrl");
        $scope.getStaff();
    };

    $scope.getStaff = function () {
        if (!$scope.urlParams.id) {
            console.error("No ID specified.");
            return;
        }

        $http.get(config.baseurl + 'staff/get-admin/' + $scope.urlParams.id)
            .then(function (response) {
                if (response.data.status === 'error') {
                    console.error("Error fetching staff:", response.data.message);
                } else {
                    $scope.staff = response.data.data;
                }
            })
            .catch(function (error) {
                console.error("Error fetching staff details:", error);
            });
    };

    $scope.confirmDelete = function () {
        $("#deleteModal").modal('show');
    };

    $scope.deleteStaff = function () {
        if (!$scope.urlParams.id) {
            console.error("No ID specified.");
            return;
        }

        $http.delete(config.baseurl + 'staff/delete-admin/' + $scope.urlParams.id + '/')
            .then(function (response) {
                if (response.data.status === 'error') {
                    console.error("Error deleting staff:", response.data.message);
                } else {
                    alert("Staff successfully deleted!");
                    $window.location.href = '/admin/staff.html';
                }
            })
            .catch(function (error) {
                console.error("Error deleting staff:", error);
            });
    };
});
