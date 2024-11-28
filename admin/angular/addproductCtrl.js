app.controller("addproductCtrl", function ($scope, $http, $window, $location, config) {
  // Check if baseurl is correctly initialized
  console.log("Config Base URL:", config.baseurl);  // Ensure this is initialized

  // Initialize base URL
  $scope.baseurl = config.baseurl;
  
  // Initialize the product object
  $scope.product = {};

  // Initialization function to fetch all products
  $scope.init = function() {
      console.log("Initialization of addproductCtrl");
      $scope.getAllProducts(); // Call function to fetch products
  };

  // Function to set the agent ID from local storage
  $scope.setAId = function() {
      const id = localStorage.getItem('id'); // Retrieve agent ID
      console.log("Retrieved agent ID from local storage:", id); // Debugging log

      // Ensure the product object is initialized before setting agent_id
      if (!$scope.product) {
          $scope.product = {}; // Initialize if not defined
      }

      if (id) {
          $scope.product.agent_id = id; // Set agent ID in product object
          console.log("Agent ID set in product object:", $scope.product.agent_id); // Debugging log
      } else {
          console.error('Agent ID not found in local storage.');
      }
  };

  // Function to get all products
  $scope.getAllProducts = function() {
      var urlconfig = {
          headers: {
              "Content-Type": "application/json;"
          },
      };

      $http.get($scope.baseurl + 'product/products/', urlconfig)
          .then(function(response) {
              console.log("Fetched products data:", response.data);
              $scope.productList = response.data.data;
          })
          .catch(function(error) {
              console.error("Error fetching products:", error);
          });
  };

  // Sign out function to clear localStorage
  $scope.signOut = function() {
      localStorage.removeItem('agent_id');
      localStorage.clear(); // Clear all localStorage data
      window.location.href = 'index.html'; // Adjust path as necessary
  };

  // Navigate to product detail page based on productId
  $scope.goToProductDetail = function (productId) {
      $window.location.href = '/detail.html?product_id=' + productId;
  };

  // Prepare product data and submit
  $scope.submitProduct = function() {
    // Validate product data
    if (!$scope.product.product_name || !$scope.product.unit) {
        console.error("Product name or unit is missing!");
        alert("Product name and unit are required.");
        return; // Prevent form submission
    }

    // Format the `mfg` date to `YYYY-MM-DD` if present
    if ($scope.product.mfg) {
        // Ensure the `mfg` is in `YYYY-MM-DD` format
        $scope.product.mfg = new Date($scope.product.mfg).toISOString().split('T')[0];
    }

    console.log("Product data being sent:", $scope.product);

    // Create product data object for POST request
    var productData = {
        product_name: $scope.product.product_name,
        unit: $scope.product.unit,
        price: $scope.product.price,
        Quantity: $scope.product.stock_quantity,
        Product_Life: $scope.product.product_life,
        MFG: $scope.product.mfg,
        Category: $scope.product.category,
        Subcategory: $scope.product.subcategory,
        id: $scope.product.id  // Ensure agent_id is part of the product data
    };

    console.log("Final product data:", productData);

    // Send product data via POST request
    $http.post($scope.baseurl + 'product/products/', productData)
    .then(function(response) {
        console.log("Product added successful:", response.data);
        alert("Product successfully created!");
        // $scope.isSubmitting = false; // Re-enable the button
    })
    .catch(function(error) {
        console.error("AddProduct failed:", error);
        alert("AddProduct failed! Please try again.");
        $scope.isSubmitting = false; // Re-enable the button on error
    });
}
}
);