app.controller('subcategoryCtrl', function ($scope, $http, $window, $location, $sce, $timeout, store, config) {
    $scope.data = {};
    $scope.dataset = [];
    $scope.subcategory = {};

    // Initialize the controller
    $scope.init = function () {
        $scope.list();
    };

    // Fetch the list of products
    $scope.list = function () {
        console.log("Fetching subcategories list from:", config.baseurl);
        $http.get(`${config.baseurl}subcategory/subcategory/`)
        .then(function (response) {
            console.log("Full response:", response);
            if (response.status !== 200) {
                console.error("Error fetching subcategory list:", response.statusText);
            } else {
                if (!response.data || response.data.length === 0) {
                    console.error("Subcategory list is undefined or empty!");
                    $scope.dataset = [];
                } else {
                    $scope.dataset = response.data.data; // Directly assign the array to dataset
                    console.log("Subategory list fetched:", $scope.dataset);
                }
                }
            })
            .catch(function (error) {
                console.error("Error fetching product list:", error);
            });
    };
    
    $scope.getcategory = function (subcategory_id) {
        if (!subcategory_id) {
            console.error("subcategory_id is missing!");
            return;
        }
    
        $http.get(`${config.baseurl}subcategory/get-subcategory//${subcategory_id}/`)
            .then(function (response) {
                if (response.data.status === 'false') {
                    console.error("Error fetching subcategory:", response.data.message);
                } else {
                    if (!response.data.data) {
                        console.error("Subcategory not found for ID:", subcategory_id);
                        $scope.subcategory = {}; // Empty category data if not found
                    } else {
                        $scope.subcategory = response.data.data;
                        console.log("Subcategory fetched:", $scope.subcategory);
                    }
                }
            })
            .catch(function (error) {
                console.error("Error fetching subcategory:", error);
            });
    };
    $scope.add = function () {
        console.log("Adding category:", $scope.data);

        $http.post(`${config.baseurl}subcategory/subcategory/`, $scope.data)
            .then(function (response) {
                if (response.data.status === 'false') {
                    console.error("Error adding subcategory:", response.data.message);
                } else {
                    alert("Subcategory added successfully!");
                    $scope.init(); // Refresh the product list
                    $("#addform").modal("hide");
                }
            })
            .catch(function (error) {
                console.error("Error adding subcategory:", error);
            });
    };

    // Update a category
    $scope.update = function (id) {
        if (!id) {
            alert("Invalid ID!");
            return;
        }

        console.log("Updating category:", $scope.data);

        $http.patch(`${config.baseurl}category/category/${id}/`, $scope.data)
            .then(function (response) {
                if (response.data.status === 'false') {
                    console.error("Error updating category:", response.data.message);
                } else {
                    alert("Category updated successfully!");
                    $scope.init(); // Refresh the product list
                    $("#editform").modal("hide");
                }
            })
            .catch(function (error) {
                console.error("Error updating category:", error);
            });
    };

    // Delete a product
    $scope.delete = function (id) {
        if (!id) {
            alert("Invalid  ID!");
            return;
        }

        if (!confirm("Are you sure you want to delete this ?")) {
            return;
        }

        $http.delete(`${config.baseurl}category/delete-category/${id}/`)
            .then(function (response) {
                if (response.data.status === 'false') {
                    alert("Failed to delete category: " + response.data.message);
                } else {
                    alert("Category deleted successfully!");
                    $scope.init(); // Refresh the product list
                    $("#deleteform").modal("hide");
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
        $scope.category = angular.copy(data); // Bind the product data to $scope.product
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

    // Close modal manually
    $scope.closeModal = function () {
        $("#deleteform").modal("hide");
    };

    // Initialize the product list on page load
    $scope.init();
});
