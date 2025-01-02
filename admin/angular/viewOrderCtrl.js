app.controller('viewOrderCtrl', function ($scope, $http, $window, $location, $sce, $timeout, store, config) {
    $scope.order = {};
    $scope.newOrderStatus = '';

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

        url = `${config.baseurl}order/get-order/${$scope.urlParams['id']}`;
        
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
        let url = `${config.baseurl}order/change-order-status/${$scope.urlParams['id']}`;
        let data = JSON.stringify({
            'status': $scope.newOrderStatus
        });

        $http.post(url, data).then(response => {
            if (response.data.status === 'error') {
                console.error("Error fetching order:", response.data.message);
            } else {
                window.location.reload();
            }
        }).error(error => {
            console.error("Error fetching orders list:", error);
        });
    }

    $scope.init = function () {
        $scope.getOrder();
    }; 
});
    
function propertyNameFromModelPath(modelPath) {
    return modelPath.split('.').pop();
}
