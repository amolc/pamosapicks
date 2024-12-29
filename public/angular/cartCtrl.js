
app.controller(
    "cartCtrl",
    function ($scope, $http, $window, $location, config) {
      $scope.init = function () {
        $scope.baseurl = config.baseurl;
        $scope.cartTotal = 100;
        
        $scope.urlParams = Object.fromEntries(
          new URLSearchParams(window.location.search)
        );
        $scope.categoryFilter = null;
  
        // Initialize cart from localStorage
        $scope.cart = JSON.parse(localStorage.getItem("cart")) || [];
       
        $scope.updateCartTotal();
      };
  
      $scope.addToCart = function (id, product_name, qty, price, image) {
        qty = Number(qty);
        price = Number(price);
        const product = {
          id: id,
          product_name: product_name,
          quantity: qty,
          price: price, // Ensure price is stored as a number
          product_image:image
        };
  
        // Check if the product already exists in the cart
        let existingProduct = $scope.cart.find((item) => item.id === id);
  
        if (existingProduct) {
          existingProduct.quantity += qty; // Increment quantity
        } else {
          $scope.cart.push(product); // Add new product
        }
  
        // Save to localStorage
        localStorage.setItem("cart", JSON.stringify($scope.cart));
        updateCartTotal();
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
        let total = 0;
        $scope.cart.forEach(cartItem => {
          total += cartItem.quantity * cartItem.price;
        });
        $scope.cartTotal = total;
      };
    }
  );
  