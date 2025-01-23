app.controller('viewOrderCtrl', function ($scope, $http, $window, $location, $sce, $timeout, store, config) {
    $scope.order = {};
    $scope.newOrderStatus = '';
    $scope.statusChangeError = '';

    $scope.urlParams = Object.fromEntries(
        new URLSearchParams(window.location.search)
    );

    $scope.getOrder = function () {
        $scope.fetchingOrder = true;

        let url = '';

        if($scope.urlParams.length == 0) {
            console.error("No ID specified.");
            return;
        }

        if(!$scope.urlParams.hasOwnProperty('id')) {
            console.error("No ID specified.");
            return;
        }

        url = `${config.baseurl}orders/get-order/${$scope.urlParams['id']}`;
        
        $http.get(url)
            .then(function (response) {
                if (response.data.status === 'error') {
                    console.error("Error fetching order:", response.data.message);
                } else {
                    $scope.order = response.data.data;
                    $scope.newOrderStatus = $scope.order.status;
                }
            })
            .catch(function (error) {
                console.error("Error fetching orders list:", error);
            });
    };
    
    $scope.showChangeOrderStatusModal = () => {
        $("#changeOrderStatusModal").modal('show');
    };

    $scope.showStatusChangeHistoryModal = () => {
        $("#statusChangeHistoryModal").modal('show');
    };

    $scope.submitOrderStatusChange = () => {
        const id = $scope.order.id;
        let url = `${config.baseurl}orders/change-order-status/${$scope.urlParams['id']}`;
        let data = JSON.stringify({
            'status': $scope.newOrderStatus
        });

        $http.post(url, data).then(response => {
            if (response.data.status === 'error') {
                console.error("Error fetching order:", response.data.message);
                $scope.statusChangeError = response.data.message;
            } else {
                window.location.reload();
            }
        }).error(error => {
            console.error("Error fetching orders list:", error);
            $scope.statusChangeError = "An error occurred while changing the order status.";
        });
    }

    $scope.showAssignOrderModal = function () {
        $http.get(`${config.baseurl}staff/get-admin/`)
            .then(function (response) {
                $scope.staffList = response.data.data;
                $("#assignOrderModal").modal("show");
            })
            .catch(function (error) {
                console.error("Error fetching staff list:", error);
            });
    };

    $scope.submitAssignOrder = function () {
        const data = {
            assigned_to: $scope.newAssignedTo
        };
        $http.post(`${config.baseurl}orders/change-order-assigned-to/${$scope.order.id}`, data)
            .then(function (response) {
                if (response.data.status === 'success') {
                    $scope.order = response.data.data;
                    $("#assignOrderModal").modal("hide");
                    window.location.reload(); // Reload the order page after successful submission
                } else {
                    $scope.assignError = response.data.message;
                }
            })
            .catch(function (error) {
                console.error("Error assigning order:", error);
                $scope.assignError = "An error occurred while assigning the order.";
            });
    };

    $scope.showAssignChangeHistoryModal = () => {
        $("#assignChangeHistoryModal").modal('show');
    };

    $scope.init = function () {
        $scope.getOrder();
    }; 
});
    
function propertyNameFromModelPath(modelPath) {
    return modelPath.split('.').pop();
}
