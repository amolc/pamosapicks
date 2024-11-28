app.controller('productCtrl', function ($scope, $http, $window, $location, $sce, $timeout, store, config) {
    $scope.data = {};
    $scope.dataset = [];
    $scope.product = {};

    // Initialize the controller
    $scope.init = function () {
        $scope.list();
    };

    // Fetch the list of products
    $scope.list = function () {
        console.log("Fetching product list from:", config.baseurl);
        $http.get(`${config.baseurl}product/products/`)
            .then(function (response) {
                if (response.data.status === 'false') {
                    console.error("Error fetching product list:", response.data.message);
                } else {
                    $scope.dataset = response.data.data;
                    console.log("Product list fetched:", $scope.dataset);
                }
            })
            .catch(function (error) {
                console.error("Error fetching product list:", error);
            });
    };

    // Fetch a single product by ID
    $scope.getProduct = function (id) {
        if (!id) {
            console.error("Product ID is missing!");
            return;
        }

        $http.get(`${config.baseurl}product/get-products/${id}/`)
            .then(function (response) {
                if (response.data.status === 'false') {
                    console.error("Error fetching product:", response.data.message);
                } else {
                    $scope.product = response.data.data;
                    console.log("Product fetched:", $scope.product);
                }
            })
            .catch(function (error) {
                console.error("Error fetching product:", error);
            });
    };

    // Add a new product
    $scope.add = function () {
        console.log("Adding product:", $scope.data);

        $http.post(`${config.baseurl}product/products/`, $scope.data)
            .then(function (response) {
                if (response.data.status === 'false') {
                    console.error("Error adding product:", response.data.message);
                } else {
                    alert("Product added successfully!");
                    $scope.list(); // Refresh the product list
                    $("#addform").modal("hide");
                }
            })
            .catch(function (error) {
                console.error("Error adding product:", error);
            });
    };

    // Update a product
    $scope.update = function (id) {
        if (!id) {
            alert("Invalid product ID!");
            return;
        }

        console.log("Updating product:", $scope.data);

        $http.patch(`${config.baseurl}product/products/${id}/`, $scope.data)
            .then(function (response) {
                if (response.data.status === 'false') {
                    console.error("Error updating product:", response.data.message);
                } else {
                    alert("Product updated successfully!");
                    $scope.list(); // Refresh the product list
                    $("#editform").modal("hide");
                }
            })
            .catch(function (error) {
                console.error("Error updating product:", error);
            });
    };

    // Delete a product
    $scope.delete = function (id) {
        if (!id) {
            alert("Invalid product ID!");
            return;
        }
    
        const confirmDeletion = confirm("Are you sure you want to delete this product?");
        if (!confirmDeletion) return;
    
        $http.delete(`${config.baseurl}product/delete-products/${id}/`)
            .then(function (response) {
                if (response.data.status === 'false') {
                    alert("Failed to delete product: " + response.data.message);
                } else {
                    alert("Product deleted successfully!");
                    $scope.list(); // Refresh the product list
                    $("#deleteform").modal("hide"); // Hide the modal after successful deletion
                }
            })
            .catch(function (error) {
                console.error("Error deleting product:", error);
                alert("An error occurred while deleting the product. Please try again.");
            });
    };
    
    // Open the delete modal and bind the selected product data
    $scope.ondelete = function (data) {
        console.log("Delete modal triggered with data:", data);
        $scope.product = angular.copy(data); // Bind the product data to $scope.product
        $("#deleteform").modal("show"); // Show the delete confirmation modal
    };

    // Open the edit modal
    $scope.onedit = function (data) {
        $scope.data = angular.copy(data); // Copy data to prevent binding issues
        $("#editform").modal("show");
    };

    // Open the add modal
    $scope.addform = function () {
        $scope.data = {}; // Reset form for new product
        $("#addform").modal("show");
    };

   

    // Add product submit handler
    $scope.onsubmit = function () {
        $scope.add();
    };

    // Edit product submit handler
    $scope.oneditsubmit = function () {
        if ($scope.data && $scope.data.id) {
            $scope.update($scope.data.id);
        } else {
            alert("Invalid product ID!");
        }
    };
    $scope.closeModal = function () {
        $("#deleteform").modal("hide"); // Manually hide the modal
    };

    // Initialize the product list on page load
    $scope.init();
});
