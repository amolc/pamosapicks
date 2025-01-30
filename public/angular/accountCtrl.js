app.controller(
  "accountCtrl",
  function ($scope, $http, $window, $location, $sce, $timeout, store, config) {
    $scope.getLoggedInCustomer = () => {
      const user = JSON.parse(localStorage.getItem("user"));
      const url = `${config.baseurl}customers/get-customer/${user.id}`;

      $http.get(url).then(response => {
        if (response.data.status === 'false') {
          console.error("Error fetching logged in customer:", response.data.message);
        } else {
          console.log("Response is: ");
          console.log(response);
          $scope.user = response.data.data;
          // Update local storage with the new user data
          localStorage.setItem('user', JSON.stringify($scope.user));
        }
      }).catch(function (error) {
          console.error("Error fetching logged in customer:", error);
      });
    };

    

    $scope.init = function () {
      $scope.baseurl = config.baseurl;
      $scope.staticurl  = config.staticurl;
      $scope.cartTotal = 0;
      $scope.search = null;
      $scope.categoryFilter = null;
      $scope.isCustomerLoggedIn = parseInt(JSON.parse(localStorage.getItem('isCustomerLoggedIn')));
      $scope.orders = [];
      
      if (!($scope.isCustomerLoggedIn === 1)) {
        window.location.assign('/login.html');
      } else {
        $scope.getLoggedInCustomer();
      }

      $scope.urlParams = Object.fromEntries(
        new URLSearchParams(window.location.search)
      );

      if ($scope.urlParams.hasOwnProperty('search')) {
        $scope.search = $scope.urlParams.search;
      }
      
      // Initialize cart from localStorage
      $scope.cart = JSON.parse(localStorage.getItem("cart")) || [];
      $scope.updateCartTotal();
    };





    // Update customer function
    $scope.updateCustomer = async function() {
      console.log($scope.user['email']);
      $scope.message = "";

      const userData = {
        username: $scope.user['email'],
        email: $scope.user['email'],
        password: $scope.user['password'],
        first_name: $scope.user['first_name'],
        last_name: $scope.user['last_name'],
        country: $scope.user['country'],
        state: $scope.user['state'],
        billing_address: $scope.user['billing_address'],
        billing_address2: $scope.user['billing_address2'],
        city: $scope.user['city'],
        postal_code: $scope.user['postal_code'],
        organisation: 1,
      };

      // Validate the form data using the registerValidate function
      if ($scope.registerCustomerValidate(userData)) {
          console.log("Validating registration");

          const configHeaders = {
              headers: {
                  'Content-Type': 'application/json',
              }
          };

          // Construct the URL for the registration request for customers
          let url = config.baseurl + 'customers/update-customer/' + $scope.user['id'] +'/';  // Updated URL for registration
          
          // Make POST request to the server
          await $http.patch(url, userData, configHeaders)
              .then(function(response) {
                  if (response.data.status === "success") {
                      // Store relevant data in local storage after successful registration
                      $scope.user = response.data.data;
                      // Update local storage with the new user data
                      localStorage.setItem('user', JSON.stringify($scope.user));

                      console.log("User registered and stored in local storage:", response.data.data);
                  } else {
                      console.error("Updation failed:", response.data.message);
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



    $scope.registerCustomerValidate = function(data) {
      
      // if (!data.first_name) {
      //         $scope.message = "Please provide your first name.";
      //     return false;
      // } else if (!data.mobile_number) {
      //     $scope.message = "Please provide your mobile number.";
      //     return false;
      // }
      return true;  
      
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

    $scope.logout = () => {
      localStorage.removeItem("isCustomerLoggedIn");
      localStorage.removeItem("name");
      localStorage.removeItem("phone");
      localStorage.removeItem("user");

      window.location.assign('/login.html');
    }
  
    $scope.addToCart = function (id, product_name, qty, price, discount_price, image) {
      qty = Number(qty);
      price = Number(price);
      discount_price = discount_price ? Number(discount_price) : 0;
    
      const product = {
        id: id,
        product_name: product_name,
        quantity: qty,
        price: price, // Ensure price is stored as a number
        discount_price: discount_price,
        product_image: image,
        subtotal: price,
        discount_subtotal: discount_price
      };
    
      // Check if the product already exists in the cart
      let existingProduct = $scope.cart.find((item) => item.id === id);
    
      if (existingProduct) {
        existingProduct.quantity += qty; // Increment quantity
        $scope.updateProductTotal(id);
      } else {
        $scope.cart.push(product);
        localStorage.setItem("cart", JSON.stringify($scope.cart));
        $scope.updateCartTotal();
      }
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
  }
);