app.controller("editproductCtrl", function ($scope, $http, $window, $location, config) {
    var urlParams = new URLSearchParams(window.location.search);
    var productId = urlParams.get('id');
    $scope.baseurl = config.baseurl;

    console.log(config);

    // Initialize isSubmitting to false
    $scope.isSubmitting = false;

    // Initialization function to fetch product details
    $scope.init = function () {
        console.log("Initializing product details...");
        if (productId) {
            $scope.getProductDetails(productId);
        } else {
            console.error("Product ID is missing from the URL!");
        }
        $scope.categorylist();
        $scope.subcategorylist();
    };

    // Function to get product details by ID
    $scope.getProductDetails = function (id) {
        var urlconfig = {
            headers: {
                "Content-Type": "application/json"
            }
        };

        $http.get($scope.baseurl + `products/get-product/${id}`, urlconfig)
            .then(function (response) {
                console.log("Product details:", response.data);
                // Assuming the product data is under response.data.data
                $scope.product = response.data.data;  // Update the scope with product data
                $scope.product.price = parseFloat($scope.product.price);  // Convert price to float
            })
            .catch(function (error) {
                console.error("Error fetching product details:", error);
                alert("Failed to fetch product details. Please try again.");
            });
    };

    // Initialize the form fields with default values (Optional but good practice)
    $scope.product = {
        product_name: '',
        unit: '',
        price: '',
        stock_quantity: '',
        product_life: '',
        mfg: '',
        category: '',
        subcategory: '',
        id: ''
    };

    // Fetch category list
    $scope.categorylist = function () {
        console.log("Fetching category list from:", config.baseurl);
        $http.get(`${config.baseurl}products/category/`)
            .then(function (response) {
                console.log("Full response:", response);
                if (response.status !== 200) {
                    console.error("Error fetching category list:", response.statusText);
                } else {
                    if (!response.data || response.data.length === 0) {
                        console.error("Category list is undefined or empty!");
                        $scope.categorydataset = [];
                    } else {
                        $scope.categorydataset = response.data; // Directly assign the array to dataset
                        console.log("Category list fetched:", $scope.categorydataset);
                    }
                }
            })
            .catch(function (error) {
                console.error("Error fetching category list:", error);
            });
    };

    // Fetch subcategory list
    $scope.subcategorylist = function () {
        console.log("Fetching subcategory list from:", config.baseurl);
        $http.get(`${config.baseurl}products/subcategory/`)
            .then(function (response) {
                console.log("Full response:", response);
                if (response.status !== 200) {
                    console.error("Error fetching subcategory list:", response.statusText);
                } else {
                    if (!response.data || response.data.length === 0) {
                        console.error("Subcategory list is undefined or empty!");
                        $scope.subcategorydataset = [];
                    } else {
                        $scope.subcategorydataset = response.data.data; // Directly assign the array to dataset
                        console.log("Subcategory list fetched:", $scope.subcategorydataset);
                    }
                }
            })
            .catch(function (error) {
                console.error("Error fetching subcategory list:", error.data);
            });
    };

    // Submit updated product data
    $scope.submitProduct = function () {
        if ($scope.isSubmitting) {
            return; // Prevent double submission if the form is already being submitted
        }

        // Set isSubmitting to true to disable the button while submitting
        $scope.isSubmitting = true;

        // Prepare the product data to be sent in the request
        const productData = {
            product_name: $scope.product.product_name,
            unit: $scope.product.unit,
            price: $scope.product.price,
            product_image1: $scope.product.product_image,
            product_image2: $scope.product.product_image,
            stock_quantity: $scope.product.stock_quantity,
            product_life: $scope.product.product_life,
            mfg: $scope.product.mfg && $scope.product.mfg[0],  // If mfg is an array, get the first element
            category: $scope.product.category && $scope.product.category[0],  // Ensure category is a single value
            subcategory: $scope.product.subcategory && $scope.product.subcategory[0], 
            id: $scope.product.id
        };

        // Send the updated product data via PATCH request
        $http.patch($scope.baseurl + `products/get-product/${productId}/`, productData)
            .then(function (response) {
                console.log("Product updated successfully:", response.data);
                alert("Product successfully updated!");  // Success alert
                $window.location.href = '/admin/products.html';

                $scope.isSubmitting = false;  // Set isSubmitting to false after successful submission
            })
            .catch(function (error) {
                console.error("Update failed:", error);
                alert("Failed to update product. Please try again.");  // Failure alert
                $scope.isSubmitting = false;  // Set isSubmitting to false in case of failure
            });
    };

    // Initialize the controller
    $scope.init();
});