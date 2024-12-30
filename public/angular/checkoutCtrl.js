app.controller('checkoutCtrl', function($scope, $http, $window, config) {

    // Define formatDate outside of any specific function so it can be used anywhere in the controller
    $scope.init = function() {
        $scope.cartTotal = 0;
        $scope.urlParams = Object.fromEntries(
          new URLSearchParams(window.location.search)
        );
        $scope.categoryFilter = null;
  
        $scope.countries = [
          'India',
        ];

        // Initialize cart from localStorage
        $scope.cart = JSON.parse(localStorage.getItem("cart")) || [];
        $scope.updateCartTotal();

        $scope.billing_data = {
          first_name: '',
          last_name: '',
          email: '',
          mobile_number: '',
          country: 'India',
          state: '',
          city: '',
          postal_code: '',
          billing_address: '',
        };
    };

    $scope.submitOrder = () => {
      const url = `${config.baseurl}billing/create-billing/`;

      const data = {
        billing_data: $scope.billing_data,
        cart_data: $scope.cart
      };

      $http.post(
        url,
        data
      ).then(response => {
        if (response.data.status == "success") {
          alert("Order has been submitted :).");
          const billing_data = response.data.data;
          window.location.assign(`/thankyou.html?id=${billing_data.id}`);
        }
      }).catch(error => {
          console.error(`Error submitting booking: ${error}`);
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
});
