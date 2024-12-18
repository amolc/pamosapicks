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
        $scope.renderCartItems();
        $scope.updateCartTotal();
      };
  
      $scope.addToCart = function (id, product_name, qty, price) {
        qty = Number(qty);
        const product = {
          id: id,
          product_name: product_name,
          quantity: qty,
          price: Number(price), // Ensure price is stored as a number
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
  
        // Update cart table and total
        $scope.renderCartItems();
        $scope.updateCartTotal();
      };
  
      $scope.renderCartItems = function () {
        const cartTableBody = document.getElementById("cart-table-body");
        cartTableBody.innerHTML = ""; // Clear the existing table rows
  
        $scope.cart.forEach((product) => {
          const { id, product_name, quantity, price } = product;
          const itemTotal = quantity * price;
  
          const cartRowHTML = `
            <tr>
              <td class="product-thumbnail">
                <a href="shop-details.html?id=${id}">
                  <img src="assets/img/product/products${id}-min.jpg" alt="${product_name}">
                </a>
              </td>
              <td class="product-name">
                <a href="shop-details.html?id=${id}">${product_name}</a>
              </td>
              <td class="product-price">
                <span class="amount">₹${price.toFixed(2)}</span>
              </td>
              <td class="product-quantity">
                <span class="cart-minus" onclick="angular.element(this).scope().updateQuantity(${id}, -1)">-</span>
                <input 
                  class="cart-input" 
                  type="number" 
                  value="${quantity}" 
                  min="1" 
                  onchange="angular.element(this).scope().updateTotal(this, ${id})"
                >
                <span class="cart-plus" onclick="angular.element(this).scope().updateQuantity(${id}, 1)">+</span>
              </td>
              <td class="product-subtotal">
                <span class="amount">₹${itemTotal.toFixed(2)}</span>
              </td>
              <td class="product-remove">
                <a href="#" onclick="angular.element(this).scope().removeItem(${id})"><i class="fa fa-times"></i></a>
              </td>
            </tr>
          `;
          cartTableBody.insertAdjacentHTML("beforeend", cartRowHTML);
        });
      };
  
      $scope.updateQuantity = function (id, delta) {
        let product = $scope.cart.find((item) => item.id === id);
        if (product) {
          product.quantity = Math.max(1, product.quantity + delta); // Ensure quantity doesn't go below 1
          localStorage.setItem("cart", JSON.stringify($scope.cart));
  
          $scope.renderCartItems();
          $scope.updateCartTotal();
        }
      };
  
      $scope.removeItem = function (id) {
        $scope.cart = $scope.cart.filter((item) => item.id !== id);
        localStorage.setItem("cart", JSON.stringify($scope.cart));
  
        $scope.renderCartItems();
        $scope.updateCartTotal();
      };
  
      $scope.updateTotal = function (inputElement, id) {
        let product = $scope.cart.find((item) => item.id === id);
        if (product) {
          const newQuantity = Math.max(1, Number(inputElement.value));
          product.quantity = newQuantity;
          localStorage.setItem("cart", JSON.stringify($scope.cart));
  
          $scope.renderCartItems();
          $scope.updateCartTotal();
        }
      };
  
      $scope.updateCartTotal = function () {
        const totalDisplay = document.querySelector(".cart-page-total ul li span");
        let cartTotal = $scope.cart.reduce((total, product) => {
          return total + product.quantity * product.price;
        }, 0);
  
        totalDisplay.textContent = `₹${cartTotal.toFixed(2)}`;
      };
    }
  );
  