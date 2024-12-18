app.controller(
  "cartCtrl",
  function ($scope, $http, $window, $location, config) {
    $scope.init = function () {
      $scope.baseurl = config.baseurl;
      console.log(config);

      // Initialize cart from localStorage
      const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
      $scope.cart = storedCart.map((item) => ({
        ...item,
        price: Number(item.price), // Ensure price is a number
      }));

      console.log($scope.cart);

      // Initial rendering of the cart and total
      $scope.updateCartTotal();
    };

    $scope.addToCart = function (id, product_name, qty, price,image) {
      qty = Number(qty);
      const product = {
        id: id,
        product_name: product_name,
        quantity: qty,
        price: Number(price),
        product_image:image  // Ensure price is stored as a number
      };

      console.log("Adding Product:", product);

      // Check if the product already exists in the cart
      let existingProduct = $scope.cart.find((item) => item.id === id);

      if (existingProduct) {
        existingProduct.quantity += qty; // Increment quantity
      } else {
        $scope.cart.push(product); // Add new product
      }

      // Save to localStorage
      localStorage.setItem("cart", JSON.stringify($scope.cart));
      console.log("Updated Cart:", $scope.cart);

      const cartUpdatedEvent = new Event("cartUpdated");
      window.dispatchEvent(cartUpdatedEvent);

      // Update cart total
      $scope.updateCartTotal();
    };

    $scope.updateQuantity = function (id, delta) {
      let product = $scope.cart.find((item) => item.id === id);
      if (product) {
        product.quantity = Math.max(1, product.quantity + delta); // Ensure quantity doesn't go below 1
        localStorage.setItem("cart", JSON.stringify($scope.cart));

        $scope.updateCartTotal();
      }
    };

    $scope.removeItem = function (id) {
      $scope.cart = $scope.cart.filter((item) => item.id !== id);
      localStorage.setItem("cart", JSON.stringify($scope.cart));

      $scope.updateCartTotal();
    };

    $scope.updateTotal = function (inputElement, id) {
      let product = $scope.cart.find((item) => item.id === id);
      if (product) {
        const newQuantity = Math.max(1, Number(inputElement.value));
        product.quantity = newQuantity;
        localStorage.setItem("cart", JSON.stringify($scope.cart));

        $scope.updateCartTotal();
      }
    };

    $scope.updateCartTotal = function () {
      $scope.cartTotal = $scope.cart.reduce((total, product) => {
        return total + product.quantity * product.price;
      }, 0);
    };
  }
);
