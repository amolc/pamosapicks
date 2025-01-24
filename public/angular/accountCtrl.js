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
      $scope.cartTotal = 100;
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

    $scope.getOrders = () => {
      $http.get(`${config.baseurl}orders/order/?customer_id=${$scope.user.id}`)
        .then(function (response) {
            if (response.data.status === 'false') {
                console.error("Error fetching orders list:", response.data.message);
            } else {
                $scope.orders = response.data.data;
            }
        })
        .catch(function (error) {
            console.error("Error fetching orders list:", error);
        });
    }
  }
);