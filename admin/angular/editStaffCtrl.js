app.controller("editStaffCtrl", function ($scope, $http, $window, $location, config) {
    $scope.staff = {};
    $scope.urlParams = Object.fromEntries(new URLSearchParams(window.location.search));

    $scope.init = function () {
        console.log("Initialization of editStaffCtrl");
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

    $scope.submitStaff = function () {
        if (!$scope.staff.first_name || !$scope.staff.last_name || !$scope.staff.email || !$scope.staff.role) {
            alert("All fields are required.");
            return;
        }

        console.log("Staff data being sent:", $scope.staff);

        $http.patch(config.baseurl + 'staff/update-admin/' + $scope.staff.id + '/', $scope.staff)
            .then(function (response) {
                console.log("Staff updated successfully:", response.data);
                alert("Staff successfully updated!");
                $window.location.href = '/admin/staff.html';
            })
            .catch(function (error) {
                console.error("EditStaff failed:", error);
                alert("EditStaff failed! Please try again.");
            });
    };
});