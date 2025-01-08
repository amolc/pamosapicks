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

    $scope.submitOrder = () => {
      if (!$scope.useIndependentShippingDetails) {
        $scope.copyBillingDetailsToShippingDetails();
      }

      console.log("Order data being submitted: ");
      console.log($scope.order_data);
      
      const url = `${config.baseurl}order/create-order/`;
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
