app.controller('ordersCtrl', function ($scope, $http, $window, $location, $sce, $timeout, store, config) {
    $scope.data = {};
    $scope.dataset = [];

    $scope.list = function () {
      $http.get(`${config.baseurl}orders/order/`)
        .then(function (response) {
            if (response.data.status === 'false') {
                console.error("Error fetching orders list:", response.data.message);
            } else {
                $scope.dataset = response.data.data;
                console.log("Order list fetched:", $scope.dataset);
            }
        })
        .catch(function (error) {
            console.error("Error fetching orders list:", error);
        });
    };

    $scope.initializeHeader = () => {
      /**
       * Depends on: 
       *  - lib/cart.js.
       *  - lib/search.js.
       */
      initializeCartElements();
      initializeSearchElements();
    };

    // Fetch a single order by ID
    $scope.getOrderbyid = function (id) {
        if (!order_id) {
            console.error("Order ID is missing!");
            return;
        }
    
        $http.get(`${config.baseurl}orders/get-order/${order_id}/`)
            .then(function (response) {
                if (response.data.status === 'false') {
                    console.error("Error fetching order:", response.data.message);
                } else {
                    if (!response.data.data) {
                        console.error("Order not found for ID:", order_id);
                        $scope.order = {}; // Empty category data if not found
                    } else {
                        // Ensure price and discount_price are numbers if they exist
                        $scope.order = response.data.data;
                        $scope.order.price = parseFloat($scope.order.price) || 0;  // Ensure price is a number
                        $scope.order.discount_price = parseFloat($scope.order.discount_price) || null;  // Ensure discount_price is a number
    
                        console.log("Order fetched:", $scope.order);
                    }
                }
            })
            .catch(function (error) {
                console.error("Error fetching order:", error);
            });
    };
    
    $scope.init = function () {
        $scope.list();
    }; 
    
    $scope.ondelete = function (data) {
        console.log("Delete modal triggered with data:", data);
        $scope.order = angular.copy(data); // Bind the order data to $scope.order
        $("#deleteform").modal("show"); // Show the delete confirmation modal
    };

    // Open the edit modal
    $scope.onview = function (data) {
        $scope.order = angular.copy(data); // Copy data to prevent binding issues
        $("#viewform").modal("show");
    };

    // Close modal manually
    $scope.closeModal = function () {
        $("#deleteform").modal("hide");
    };

    $scope.closeeditModal = () => {
        $("#editform").modal("hide");
    };

    $scope.closeaddModal = function () {
        $("#addform").modal("hide");
    };
});
    
function propertyNameFromModelPath(modelPath) {
    return modelPath.split('.').pop();
}
