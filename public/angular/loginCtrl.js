app.controller('loginCtrl', function($scope, $http, $window, config) {
  console.log(config.baseurl);

  // Initialize controller
  $scope.init = function() {
    const isCustomerLoggedIn = localStorage.getItem('isCustomerLoggedIn');

    // Check if already logged in
    if (isCustomerLoggedIn === '1') {
      $scope.name = localStorage.getItem('name');
      $scope.email = localStorage.getItem('email');
      $scope.phone = localStorage.getItem('phone');
      // Check if email exists in local storage
      if ($scope.email) {
        console.log("User found:", $scope.email);
        $window.location.href = "/checkout.html"; // Redirect to checkout.
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
    // toggle mobilephone modal and otp
    $scope.showLogin = true;
    $scope.showOtp = false;
  };


  $scope.showOtpDiv = function(data) {
    $scope.showLogin = false;
    $scope.showOtp = true;
  };
  

  $scope.setLoginMobileNumber = () => {

  };

   // 
   $scope.loginvalidate = function(data) {
    if (!data || !data.mobile_number) {
      $scope.message = "Please provide a mobile number.";
      return false;
    } else if (!data.password) {
      $scope.message = "Please provide a password.";
      return false;
    }
    return true;
  };

  // Login validation
  $scope.loginvalidate = function(data) {
    if (!data || !data.mobile_number) {
      $scope.message = "Please provide a mobile number.";
      return false;
    } else if (!data.password) {
      $scope.message = "Please provide a password.";
      return false;
    }
    return true;
  };

  // Login function
  $scope.login = function() {
    $scope.message = "";

    // Validate the form data using the loginvalidate function
    if ($scope.loginvalidate($scope.data)) {
      console.log("Validating login");

      const configHeaders = {
        headers: {
          'Content-Type': 'application/json',
        }
      };

      // Check if the necessary parameters exist in $scope.data
      if (!$scope.data.mobile_number || !$scope.data.password) {
        console.error("Missing required fields: mobile number or password");
        $scope.message = "Please provide both mobile number and password.";
        return;
      }

      let url = config.baseurl + 'customers/login-customer/';  // Changed from 'admin/get-admin/' to 'customers/get-customer/'
      
      $http.post(url, $scope.data)
        .then(function(response) {
          if (response.data.status === "success") {
            localStorage.setItem('isCustomerLoggedIn', '1');
            localStorage.setItem('user', JSON.stringify(response.data.data.user));
            $window.location.href = "/";
          } else {
            console.error("Login failed: Invalid credentials.");
            $scope.message = response.data.message || "Login failed: Please check your credentials.";
          }
        })
        .catch(function(error) {
          console.error("Login error:", error);
          $scope.message = error.data?.message || "Login failed: Unable to connect.";
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

    if (total > 100) {
      $scope.shippingCharge = 25;
    } else {
      $scope.shippingCharge = 0;
    }
  };

  $scope.initializeHeader = () => {
    /**
     * Depends on: 
     *  - lib/cart.js.
     *  - lib/search.js.
     */
    initializeCartElements();
    initializeSearchElements();
  };
});
