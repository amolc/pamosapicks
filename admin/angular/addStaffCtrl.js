app.controller("addStaffCtrl", function ($scope, $http, $window, $location, config) {
    $scope.staff = {};

    $scope.init = function () {
        console.log("Initialization of addStaffCtrl");
    };

    $scope.submitStaff = function () {
        if (!$scope.staff.first_name || !$scope.staff.last_name || !$scope.staff.email || !$scope.staff.role) {
            alert("All fields are required.");
            return;
        }

        console.log("Staff data being sent:", $scope.staff);

        $http.post(config.baseurl + 'staff/create-admin/', $scope.staff)
            .then(function (response) {
                console.log("Staff added successfully:", response.data);
                alert("Staff successfully created!");
                $window.location.href = '/admin/staff.html';
            })
            .catch(function (error) {
                console.error("AddStaff failed:", error);
                alert("AddStaff failed! Please try again.");
            });
    };
});