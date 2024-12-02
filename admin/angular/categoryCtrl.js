app.controller('categoryCtrl', function ($scope, $http, $window, $location, $sce, $timeout, store, config) {
    
    $scope.data = {};
    $scope.dataset = [];
    $scope.category = {
        category_name: '',
        category_description: '',
        category_image: '',
        is_active: ''
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


    $scope.getcategorybyid = function (category_id) {
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
            }); };

    $scope.add = function () {
        console.log("Adding category:", $scope.category);

        $http.post(`${config.baseurl}category/category/`, $scope.category)
            .then(function (response) {
                if (response.data.status === 'false') {
                    console.error("Error adding category:", response.category.message);
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

        $http.patch(`${config.baseurl}category/update-category/${id}/`, $scope.data)
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








    $scope.init = function () {
       $scope.list();
    }

    // Open the delete modal and bind the selected product data
    $scope.ondelete = function (data) {
        console.log("Delete modal triggered with data:", data);
        $scope.category = angular.copy(data); // Bind the product data to $scope.product
        $("#deleteform").modal("show"); // Show the delete confirmation modal
    };

    // Open the edit modal
    $scope.onedit = function (data) {
        $scope.category = angular.copy(data); // Copy data to prevent binding issues
        console.log($scope.data)
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
    $scope.oneditsubmit = function (data) {
        console.log("are we calling the functon")
        $scope.data = data
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

    $scope.closeaddModal = function () {
        $("#addform").modal("hide");
    };

    










});



    // Attach function to window for global access
    window.convertToBase64 = function (inputId, modelPath) {
        const fileInput = document.getElementById(inputId);
        const file = fileInput.files[0];
    
        if (file) {
          const reader = new FileReader();
          reader.onload = function (event) {
            const base64String = event.target.result;
            console.log(`Base64 for ${inputId}:`, base64String); // Log the Base64 string
    
            // Get AngularJS scope
            const scope = angular.element(document.querySelector('[ng-controller="categoryCtrl"]')).scope();
            scope.category['category_image'] = base64String;
            
          };
          reader.readAsDataURL(file);
        } else {
          console.error("No file selected for:", inputId); // Log if no file is selected
        }
      };
    
      function propertyNameFromModelPath(modelPath) {
        return modelPath.split('.').pop();
      }

    
