app.controller('productCtrl', function ($scope, $http, $window, $location, $sce, $timeout, store, config) {
    $scope.data = {};
    $scope.dataset = [];
    $scope.product = {
        product_name: '',
        unit: '',
        price: '',
        product_description: '',
        discount_price: '',
        stock_quantity: '',
        product_life: '',
        product_image1: '',
        product_image2: '',
        mfg: '',
        category: '',
        subcategory: '',
        
    };

    // Initialize the controller
   

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
    $scope.getProductbyid = function (product_id) {
        if (!product_id) {
            console.error("Product ID is missing!");
            return;
        }
    
        $http.get(`${config.baseurl}product/get-products/${product_id}/`)
            .then(function (response) {
                if (response.data.status === 'false') {
                    console.error("Error fetching product:", response.data.message);
                } else {
                    if (!response.data.data) {
                        console.error("Product not found for ID:", product_id);
                        $scope.product = {}; // Empty category data if not found
                    } else {
                        // Ensure price and discount_price are numbers if they exist
                        $scope.product = response.data.data;
                        $scope.product.price = parseFloat($scope.product.price) || 0;  // Ensure price is a number
                        $scope.product.discount_price = parseFloat($scope.product.discount_price) || null;  // Ensure discount_price is a number
    
                        console.log("Product fetched:", $scope.product);
                    }
                }
            })
            .catch(function (error) {
                console.error("Error fetching product:", error);
            });
    };
    
    // Add a new product
    $scope.add = function () {
        console.log("Adding product:", $scope.product);
    
        // Ensure the mfg date is correctly formatted before sending
        if ($scope.product.mfg) {
            $scope.product.mfg = new Date($scope.product.mfg).toISOString().split('T')[0]; // "YYYY-MM-DD"
        }
        
        $scope.product.category_id = parseInt($scope.product.category_id, 10);
        $scope.product.subcategory_id = parseInt($scope.product.subcategory_id, 10);
       
        // Make the POST request to add the product
        $http.post(`${config.baseurl}product/create-products/`, $scope.product)
            .then(function (response) {
                if (response.data.status === 'false') {
                    console.error("Error adding product:", response.data.message);
                } else {
                    alert("Product added successfully!");
                    $scope.init(); // Refresh the product list
                    $("#addform").modal("hide");
                }
            })
            .catch(function (error) {
                console.error("Error adding product:", error.data);
            });
    };
    
    
    // Update a product
    $scope.update = function (id) {
        if (!id) {
            alert("Invalid ID!");
            return;
        }
    
        // Ensure mfg is correctly formatted as "YYYY-MM-DD"
        if ($scope.data.mfg) {
            $scope.data.mfg = new Date($scope.data.mfg).toISOString().split('T')[0];
        }
    
        // Ensure category and subcategory are single values, not arrays
        if (Array.isArray($scope.data.category)) {
            $scope.data.category = $scope.data.category[0];
        }
    
        if (Array.isArray($scope.data.subcategory)) {
            $scope.data.subcategory = $scope.data.subcategory[0];
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
                console.log("Error details:", error.data); // Log response data for debugging
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
    


    $scope.init = function () {
        $scope.list();
        $scope.categorylist();
        $scope.subcategorylist();
        $scope.filterSubcategories();
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

     $scope.subcategorylist = function () {
        console.log("Fetching product list from:", config.baseurl);
        $http.get(`${config.baseurl}subcategory/subcategory/`)
        .then(function (response) {
            console.log("Full response:", response);
            if (response.status !== 200) {
                console.error("Error fetching subcategory list:", response.statusText);
            } else {
                if (!response.data || response.data.length === 0) {
                    console.error("Subcategory list is undefined or empty!");
                    $scope.subcatagoryset = [];
                } else {
                    $scope.subcatagoryset = response.data.data; // Directly assign the array to dataset
                    console.log("Subcategory list fetched:", $scope.subcatagoryset);
                }
                }
            })
            .catch(function (error) {
                console.error("Error fetching subcategory list:", error.data);
            });
    };

    $scope.filterSubcategories = function() {
        if (!$scope.product.category) {
            console.warn("No category selected, unable to filter subcategories.");
            $scope.filteredSubcategories = []; // Clear the subcategory list if no category is selected
            return;
        }
    
        // Filter the subcategories based on the selected category_id
        $scope.filteredSubcategories = $scope.dataset.filter(function(subcategory) {
            return subcategory.category_id === parseInt($scope.product.category_id, 10); // Ensure type consistency
        });
    
        // Reset subcategory_id if it doesn't match the filtered subcategories
        if (
            !$scope.filteredSubcategories.some(function(subcategory) {
                return subcategory.id === parseInt($scope.product.subcategory_id, 10);
            })
        ) {
            $scope.product.subcategory_id = null; // Reset invalid subcategory_id
        }
    
        console.log("Filtered subcategories:", $scope.filteredSubcategories);
    };
    
    // Example dataset of subcategories (replace with actual data source)
    
    
    // Initialize product object
    $scope.product = {
        category_id: null, // Default value for category
        subcategory_id: null, // Default value for subcategory
    };
    
    // Initialize filteredSubcategories as empty
    $scope.filteredSubcategories = [];
    
    // Watch for changes to category_id and update filtered subcategories dynamically
    $scope.$watch("product.category_id", function(newValue) {
        if (newValue) {
            $scope.filterSubcategories();
        }
    });
    

    //Open the delete modal and bind the selected product data
    $scope.ondelete = function (data) {
        console.log("Delete modal triggered with data:", data);
        $scope.product = angular.copy(data); // Bind the product data to $scope.product
        $("#deleteform").modal("show"); // Show the delete confirmation modal
    };

    $scope.ondelete = function (data) {
        $scope.product = angular.copy(data);  // This ensures the modal is showing the correct product
        $("#deleteform").modal("show");  // Show the modal
    };
    

    // Open the edit modal
    $scope.onedit = function (data) {
        $scope.product = angular.copy(data); // Copy data to prevent binding issues
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
            scope.product['product_image'] = base64String;
            
          };
          reader.readAsDataURL(file);
        } else {
          console.error("No file selected for:", inputId); // Log if no file is selected
        }
      };
    
      function propertyNameFromModelPath(modelPath) {
        return modelPath.split('.').pop();
      }

    
