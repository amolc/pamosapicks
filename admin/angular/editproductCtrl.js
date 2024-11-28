app.controller("editproductCtrl", function ($scope, $http, $window, $location, config) {
    var urlParams = new URLSearchParams(window.location.search);
    var productId = urlParams.get('product_id');
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
    };

    // Function to get product details by ID
    $scope.getProductDetails = function (id) {
        var urlconfig = {
            headers: {
                "Content-Type": "application/json"
            }
        };

        $http.get($scope.baseurl + `product/get-products/${id}`, urlconfig)
            .then(function (response) {
                console.log("Product details:", response.data);
                // Assuming the product data is under response.data.data
                $scope.product = response.data.data;  // Update the scope with product data
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
            stock_quantity: $scope.product.stock_quantity,
            product_life: $scope.product.product_life,
            mfg: $scope.product.mfg && $scope.product.mfg[0],  // If mfg is an array, get the first element
            category: $scope.product.category && $scope.product.category[0],  // Ensure category is a single value
            subcategory: $scope.product.subcategory && $scope.product.subcategory[0], 
            id: $scope.product.id
        };

        // Send the updated product data via PATCH request
        $http.patch($scope.baseurl + `product/get-products/${productId}/`, productData)
            .then(function (response) {
                console.log("Product updated successfully:", response.data);
                alert("Product successfully updated!");  // Success alert
                $window.location.href = 'product.html'; // This will reload the page and redirect

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