app.controller('subcategoryCtrl', function ($scope, $http, $window, $location, $sce, $timeout, store, config) {
    
    $scope.data = {};
    $scope.dataset = [];
    $scope.subcategory = {
        subcategory_name: '',
        subcategory_description: '',
        category_id: '',
        subcategory_image: '',
        created_at: '',
        is_active: ''
    };


    // Fetch the list of products
    $scope.list = function () {
        console.log("Fetching product list from:", config.baseurl);
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
                    console.log("Subcategory list fetched:", $scope.dataset);
                }
                }
            })
            .catch(function (error) {
                console.error("Error fetching subcategory list:", error);
            });
    };


    $scope.getsubcategorybyid = function (subcategory_id) {
        if (!subcategory_id) {
            console.error("subcategory_id is missing!");
            return;
        }
    
        $http.get(`${config.baseurl}subcategory/get-subcategory/${subcategory_id}/`)
            .then(function (response) {
                if (response.data.status === 'false') {
                    console.error("Error fetching subcategory:", response.data.message);
                } else {
                    if (!response.data.data) {
                        console.error("subCategory not found for ID:", category_id);
                        $scope.subcategory = {}; // Empty category data if not found
                    } else {
                        $scope.subcategory = response.data.data;
                        console.log("Category fetched:", $scope.subcategory);
                    }
                }
            })
            .catch(function (error) {
                console.error("Error fetching subcategory:", error);
            }); };

            $scope.add = function () {
                console.log("Adding subcategory:", $scope.subcategory);
            
               
            
                $http.post(`${config.baseurl}subcategory/create-subcategory/`, $scope.subcategory)
                    .then(function (response) {
                        if (response.data.status === 'false') {
                            console.error("Error adding subcategory:", response.data.message);
                        } else {
                            alert("Subcategory added successfully!");
                            $scope.init(); // Refresh the subcategory list
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
    
        // Convert price and discount_price to numbers
        $scope.data.price = parseFloat($scope.data.price);
        $scope.data.discount_price = parseFloat($scope.data.discount_price);
    
        console.log("Updating product:", $scope.data);
    
        $http.patch(`${config.baseurl}product/update-products/${id}/`, $scope.data)
            .then(function (response) {
                if (response.data.status === 'false') {
                    console.error("Error updating product:", response.data.message);
                } else {
                    alert("Product updated successfully!");
                    $scope.init(); // Refresh the product list
                    $("#editform").modal("hide");
                }
            })
            .catch(function (error) {
                console.error("Error updating product:", error);
                console.log("Error details:", error.data); // Log response data
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

        $http.delete(`${config.baseurl}subcategory/delete-subcategory/${id}/`)
            .then(function (response) {
                if (response.data.status === 'false') {
                    alert("Failed to delete subcategory: " + response.data.message);
                } else {
                    alert("Category deleted successfully!");
                    $scope.init(); // Refresh the product list
                    $("#deleteform").modal("hide");
                }
            })
            .catch(function (error) {
                console.error("Error deleting subcategory:", error);
                alert("An error occurred while deleting the subcategory. Please try again.");
            });
    };




    $scope.init = function () {
       $scope.list();
       $scope.categorylist();
    }

    $scope.categorylist = function () {
        console.log("Fetching product list from:", config.baseurl);
        $http.get(`${config.baseurl}category/category/`)
        .then(function (response) {
            console.log("Full response:", response);
            if (response.status !== 200) {
                console.error("Error fetching category list:", response.statusText);
            } else {
                if (!response.data || response.data.length === 0) {
                    console.error("Category list is undefined or empty!");
                    $scope.catagoryset = [];
                } else {
                    $scope.catagoryset = response.data; // Directly assign the array to dataset
                    console.log("Category list fetched:", $scope.catagoryset);
                }
                }
            })
            .catch(function (error) {
                console.error("Error fetching product list:", error);
            });
    };

    $scope.filterSubcategories = function() {
        // Filter the subcategories based on the selected category
        $scope.filteredSubcategories = $scope.dataset.filter(function(subcategory) {
            return subcategory.category_id === $scope.product.category_id; // Filter by category_id
        });
        // Reset the subcategory_id if no valid subcategory is found
        $scope.product.subcategory_id = '';
    };
    
    // Example: Populate dataset with subcategories
    $scope.dataset =[];
    
    
    // Initial call to filter subcategories based on the selected category
    $scope.filteredSubcategories = $scope.dataset;


    // Open the delete modal and bind the selected product data
    $scope.ondelete = function (data) {
        console.log("Delete modal triggered with data:", data);
        $scope.subcategory = angular.copy(data); // Bind the product data to $scope.product
        $("#deleteform").modal("show"); // Show the delete confirmation modal
    };

    // Open the edit modal
    $scope.onedit = function (data) {
        $scope.subcategory = angular.copy(data); // Copy data to prevent binding issues
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
            alert("Invalid  ID!");
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
          reader.onload = function (subCategory) {
            const base64String = subCategory.target.result;
            console.log(`Base64 for ${inputId}:`, base64String); // Log the Base64 string
    
            // Get AngularJS scope
            const scope = angular.element(document.querySelector('[ng-controller="subcategoryCtrl"]')).scope();
            scope.subcategory['subcategory_image'] = base64String;
            
          };
          reader.readAsDataURL(file);
        } else {
          console.error("No file selected for:", inputId); // Log if no file is selected
        }
      };
    
      function propertyNameFromModelPath(modelPath) {
        return modelPath.split('.').pop();
      }

    
