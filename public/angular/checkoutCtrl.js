app.controller('checkoutCtrl', function($scope, $http, $window, config) {
  $scope.init = function() {
    const isCustomerLoggedIn = localStorage.getItem('isCustomerLoggedIn');
    
    $scope.isCustomerLoggedIn = isCustomerLoggedIn === '1';
    
    $scope.cartTotal = 0;
    
    $scope.urlParams = Object.fromEntries(
      new URLSearchParams(window.location.search)
    );
    $scope.countries = [
      'India',
    ];
    
    $scope.password = '';

    // TODO: Figure this out. I'm having trouble binding
    // a select element with ng-bind. The initialization below
    // is a temporary fix.
    $scope.order_data = {
      country: 'India'
    };

    $scope.useIndependentShippingDetails = false;
    $scope.errorMessage = null;

    // Initialize cart from localStorage
    $scope.cart = JSON.parse(localStorage.getItem("cart")) || [];
    $scope.updateCartTotal();
    $scope.categorylist();
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
$scope.register = async function() {
    $scope.message = "";

    const userData = {
      username: $scope.order_data.billing_email,
      email: $scope.order_data.email,
      password: $scope.password,
      first_name: $scope.order_data.first_name,
      last_name: $scope.order_data.last_name,
      city: $scope.order_data.city,
      mobile_number: $scope.order_data.mobile_number,
    };

    // Validate the form data using the registerValidate function
    if ($scope.registerValidate(userData)) {
        console.log("Validating registration");

        const configHeaders = {
            headers: {
                'Content-Type': 'application/json',
            }
        };

        // Construct the URL for the registration request for customers
        let url = config.baseurl + 'customer/create-customer/';  // Updated URL for registration
        
        // Make POST request to the server
        await $http.post(url, userData, configHeaders)
            .then(function(response) {
                if (response.data.status === "success") {
                    // Store relevant data in local storage after successful registration
                    localStorage.setItem('isCustomerLoggedIn', '1');
                    localStorage.setItem('name', response.data.first_name);
                    localStorage.setItem('email', response.data.email);
                    localStorage.setItem('phone', response.data.mobile_number);

                    console.log("User registered and stored in local storage:", response.data.email);
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

  $scope.buildOrderItemsFromCartData = () => {
    const orderItems = $scope.cart.map(item => {
      return {
        product: item.id,
        product_name: item.product_name,
        product_image: item.product_image,
        product_qty: item.quantity,
        product_price: item.price,
        product_subtotal: item.subtotal,
      }
    });

    return orderItems;
  };

  $scope.copyBillingDetailsToShippingDetails = () => {
    const shippingDetails = {
    shipping_email: $scope.order_data.email,
    shipping_mobile_number: $scope.order_data.mobile_number,
    shipping_first_name: $scope.order_data.first_name,
    shipping_last_name: $scope.order_data.last_name,
    shipping_address: $scope.order_data.billing_address,
    shipping_address_specifier: $scope.order_data.billing_address_specifier,
    shipping_address2: $scope.order_data.shipping_address2,
    shipping_address2_specifier: $scope.order_data.shipping_address2_specifier,
    shipping_country: $scope.order_data.country,
    shipping_state: $scope.order_data.state,
    shipping_city: $scope.order_data.city,
    shipping_postal_code: $scope.order_data.postal_code,
    };

    $scope.order_data = {
    ...$scope.order_data,
    ...shippingDetails
    };
  };

  $scope.submitOrder = async () => {
    if (!$scope.useIndependentShippingDetails) {
      $scope.copyBillingDetailsToShippingDetails();
    }

    await $scope.register();

    const url = `${config.baseurl}order/create-order/`;

    console.log('Submitting order.');

    $scope.order_data.amount = $scope.cartTotal;
    $scope.order_data.order_items = $scope.buildOrderItemsFromCartData();

    $http.post(
      url,
      $scope.order_data
    ).then(response => {
    if (response.data.status == "success") {
      const order_data = response.data.data;
      $scope.clearCart();
      
      window.location.assign(`/payment.html?id=${order_data.id}`);
    } else {
      $scope.errorMessage = "Couldn't submit order.";
      const errors = response.data;
      console.log(errors);
    }
    }).catch(error => {
      $scope.errorMessage = "Couldn't submit order.";
      console.error(`Error submitting order: ${JSON.stringify(error)}`);
    });
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
  };

  $scope.fetchingCategoryList = true;
  $scope.categorylist = function() {
    $http.get(`${config.baseurl}category/category/`)
      .then(function (response) {
        if (response.data.status === 'false') {
          console.error("Error fetching category list:", response.data.message);
        } else {
        $scope.categorydataset = response.data;

        if ($scope.urlParams.hasOwnProperty('category_id')) {
          $scope.categorydataset.forEach(category => {
          if (category.id === parseInt($scope.urlParams['category_id'])) {
            $scope.categoryFilter = category.category_name;
          }
          });
        }
        }
      })
      .catch(function (error) {
        console.error("Error fetching category list:", error);
      }).finally(() => {
      $scope.fetchingCategoryList = false;
      });
  }
});
