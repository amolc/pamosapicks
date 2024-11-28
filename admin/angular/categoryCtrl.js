app.controller('categoryCtrl', function ($scope, $http, $window, $location, $sce, $timeout, store, config) {
    $scope.data = {};
    $scope.dataset = [];
    $scope.category = {};

    // Initialize the controller
    $scope.init = function () {
        $scope.list();
    };

    // Fetch the list of products
    $scope.list = function () {
        console.log("Fetching product list from:", config.baseurl);
        $http.get(`${config.baseurl}category/category/`)
        .then(function (response) {
            console.log("Full response:", response);
            if (response.status !== 200) {
                console.error("Error fetching category list:", response.statusText);
            } else {
                if (!response.data || response.data.length === 0) {
                    console.error("Category list is undefined or empty!");
                    $scope.dataset = [];
                } else {
                    $scope.dataset = response.data; // Directly assign the array to dataset
                    console.log("Category list fetched:", $scope.dataset);
                }
                }
            })
            .catch(function (error) {
                console.error("Error fetching product list:", error);
            });
    };
    
    $scope.getcategory = function (category_id) {
        if (!category_id) {
            console.error("category_id is missing!");
            return;
        }
    
        $http.get(`${config.baseurl}category/get-category/${category_id}/`)
            .then(function (response) {
                if (response.data.status === 'false') {
                    console.error("Error fetching product:", response.data.message);
                } else {
                    if (!response.data.data) {
                        console.error("Category not found for ID:", category_id);
                        $scope.category = {}; // Empty category data if not found
                    } else {
                        $scope.category = response.data.data;
                        console.log("Category fetched:", $scope.category);
                    }
                }
            })
            .catch(function (error) {
                console.error("Error fetching product:", error);
            });
    };
    $scope.add = function () {
        console.log("Adding category:", $scope.data);

        $http.post(`${config.baseurl}category/category/`, $scope.data)
            .then(function (response) {
                if (response.data.status === 'false') {
                    console.error("Error adding category:", response.data.message);
                } else {
                    alert("Category added successfully!");
                    $scope.init(); // Refresh the product list
                    $("#addform").modal("hide");
                }
            })
            .catch(function (error) {
                console.error("Error adding product:", error);
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
