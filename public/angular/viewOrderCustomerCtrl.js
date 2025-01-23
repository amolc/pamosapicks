app.controller('viewOrderCustomerCtrl', function ($scope, $http, $location, config) {
    $scope.order = {};

    $scope.urlParams = Object.fromEntries(
        new URLSearchParams(window.location.search)
    );

    $scope.getOrder = function () {
        if (!$scope.urlParams.hasOwnProperty('id')) {
            console.error("No ID specified.");
            return;
        }

        const url = `${config.baseurl}orders/get-order/${$scope.urlParams['id']}`;
        
        $http.get(url)
            .then(function (response) {
                if (response.data.status === 'error') {
                    console.error("Error fetching order:", response.data.message);
                } else {
                    $scope.order = response.data.data;
                }
            })
            .catch(function (error) {
                console.error("Error fetching order:", error);
            });
    };

    $scope.init = function () {
        $scope.getOrder();
        // Initialize cart from localStorage
        $scope.cart = getCart();
        $scope.updateCartTotal();
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
