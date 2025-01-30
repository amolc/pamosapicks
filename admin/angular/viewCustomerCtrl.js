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

        url = `${config.baseurl}customers/get-customer/${$scope.urlParams['id']}`;
        
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

    $scope.init = function () {
        $scope.getCustomer();
    }; 
});

function propertyNameFromModelPath(modelPath) {
    return modelPath.split('.').pop();
}
