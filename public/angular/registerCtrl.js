app.controller('registerCtrl', function($scope, $http, $window, config) {
    console.log(config.baseurl);

    $scope.initializeHeader = () => {
      /**
       * Depends on: 
       *  - lib/cart.js.
       *  - lib/search.js.
       */
      initializeCartElements();
      initializeSearchElements();
    };

    // Initialize controller
    $scope.init = function() {
        $scope.data = {
          organisation: 1
        };
        const isCustomerLoggedIn = localStorage.getItem('isCustomerLoggedIn');
        // Check if already logged in
        if (isCustomerLoggedIn === '1') {
            $scope.name = localStorage.getItem('name');
            $scope.email = localStorage.getItem('email');
            $scope.phone = localStorage.getItem('phone');
            // Check if email exists in local storage
            if ($scope.email) {
                console.log("User found:", $scope.email);
                $window.location.href = "/"; // Redirect to customer dashboard
            } else {
                console.error("User not found in local storage. Redirecting to login.");
                localStorage.clear();
                $window.location.href = "index.html";  // Redirect to login page if user is not found
            }
        }

        // Load the page counter (if necessary)
        $("#pagecounter").load("/pagecounter.html");

        $scope.cart = getCart();
        $scope.updateCartTotal();
    };

    // Registration validation
    $scope.registerValidate = function(data) {
        if (!data || !data.email) {
            $scope.message = "Please provide an email address.";
            return false;
        } else if (!data.password) {
            $scope.message = "Please provide a password.";
            return false;
        } else if (!data.first_name) {
            $scope.message = "Please provide your first name.";
            return false;
        } else if (!data.mobile_number) {
            $scope.message = "Please provide your mobile number.";
            return false;
        }
        return true;
    };

    // Registration function
    $scope.register = function() {
        $scope.message = "";

        // Validate the form data using the registerValidate function
        if ($scope.registerValidate($scope.data)) {
            console.log("Validating registration");

            const configHeaders = {
                headers: {
                    'Content-Type': 'application/json',
                }
            };

            // Construct the URL for the registration request for customers
            let url = config.baseurl + 'customers/create-customer/';  // Updated URL for registration
            
            // Make POST request to the server
            $http.post(url, $scope.data, configHeaders)
                .then(function(response) {
                    if (response.data.status === "success") {
                        // Store relevant data in local storage after successful registration
                        localStorage.setItem('isCustomerLoggedIn', '1');
                        localStorage.setItem('user', JSON.stringify(response.data.data.user));
                        
                        $window.location.href = "/";  // Redirect to customer dashboard after registration
                    } else {
                        console.error("Registration failed:", response.data.message);
                        $scope.message = response.data.message || "Registration failed: Please check your details.";
                    }
                })
                .catch(function(error) {
                    console.error("Registration error:", error);
                    $scope.message = error.data?.message || "Registration failed: Unable to connect.";
                });
        } else {
            console.log("Validation error occurred");
            $scope.message = "Validation failed. Please check the input fields.";  // Provide more details to the user
        }
    };

    $scope.addToCart = (id, productName, productQuantity, productPrice, productDiscountPrice, productImage) => {
      addToCart(id, productName, productQuantity, productPrice, productDiscountPrice, productImage);
      $scope.updateCartTotal();
    };
  
    $scope.checkIfProductInCart = id => {
      let product = $scope.cart.find((item) => item.id === id);
  
      if(product) {
        return true;
      }
    };
  
    $scope.clearCart = () => {
      localStorage.setItem("cart", JSON.stringify([]));
      $scope.updateCartTotal();
    }
  
    $scope.updateQuantity = function (id, delta) {
      let product = $scope.cart.find((item) => item.id === id);
      if (product) {
        product.quantity = Math.max(1, product.quantity + delta); // Ensure quantity doesn't go below 1
        localStorage.setItem("cart", JSON.stringify($scope.cart));
  
        $scope.updateProductTotal(id);
      }
    };
  
    $scope.removeItem = function (id) {
      $scope.cart = $scope.cart.filter((item) => item.id !== id);
      localStorage.setItem("cart", JSON.stringify($scope.cart));
  
      $scope.updateCartTotal();
    };
  
    $scope.updateProductTotal = id => {
      let product = $scope.cart.find((item) => item.id === id);
      
      if (product) {
        const subtotal = product.quantity * product.price;
        const discount_subtotal = product.discount_price ?
          product.quantity * product.discount_price :
          product.discount_subtotal;
  
        product.subtotal = subtotal;
        product.discount_subtotal = discount_subtotal;
  
        localStorage.setItem("cart", JSON.stringify($scope.cart));
        $scope.updateCartTotal();
      }
    }
  
    $scope.updateCartTotal = function () {
      $scope.cart = JSON.parse(localStorage.getItem("cart")) || [];
      let total = 0;
      $scope.cart.forEach(cartItem => {
        total += cartItem.subtotal;
      });
      $scope.cartTotal = total;
    };
});
