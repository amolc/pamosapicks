app.controller('viewCustomerCtrl', function ($scope, $http, $window, $location, $sce, $timeout, store, config) {
    $scope.customer = {};
    $scope.newCustomerStatus = '';

    $scope.urlParams = Object.fromEntries(
        new URLSearchParams(window.location.search)
    );

    $scope.getCustomer = function () {
        $scope.fetchingCustomer = true;

        let url = '';

        if (Object.keys($scope.urlParams).length === 0) {
            console.error("No ID specified.");
            return;
        }

        if (!$scope.urlParams.hasOwnProperty('id')) {
            console.error("No ID specified.");
            return;
        }

        url = `${config.baseurl}customer/get-customer/${$scope.urlParams['id']}`;
        
        $http.get(url)
            .then(function (response) {
                if (response.data.status === 'error') {
                    console.error("Error fetching customer:", response.data.message);
                } else {
                    $scope.customer = response.data.data;
                    $scope.newCustomerStatus = $scope.customer.status; // Assuming customer has a status property
                }
            })
            .catch(function (error) {
                console.error("Error fetching customer details:", error);
            });
    };
    
    $scope.showChangeCustomerStatusModal = () => {
        $("#changeCustomerStatusModal").modal('show');
    };

    $scope.showStatusChangeHistoryModal = () => {
        $("#statusChangeHistoryModal").modal('show');
    };

    $scope.submitCustomerStatusChange = () => {
        const id = $scope.customer.id;
        let url = `${config.baseurl}customer/change-customer-status/${$scope.urlParams['id']}`;
        let data = JSON.stringify({
            'status': $scope.newCustomerStatus
        });

        $http.post(url, data).then(response => {
            if (response.data.status === 'error') {
                console.error("Error changing customer status:", response.data.message);
            } else {
                window.location.reload();
            }
        }).catch(error => {
            console.error("Error changing customer status:", error);
        });
    }

    $scope.init = function () {
        $scope.getCustomer();
    }; 
});

function propertyNameFromModelPath(modelPath) {
    return modelPath.split('.').pop();
}
