app.controller('ordersCtrl', function ($scope, $http, $window, $location, $sce, $timeout, store, config) {
    $scope.data = {};
    $scope.dataset = [];
    $scope.user = JSON.parse(localStorage.getItem('user'));

    $scope.list = function () {
      $http.get(`${config.baseurl}orders/order/?customer_id=${$scope.user.id}`)
        .then(function (response) {
            if (response.data.status === 'false') {
                console.error("Error fetching orders list:", response.data.message);
            } else {
                $scope.dataset = response.data.data;
                console.log("Order list fetched:", $scope.dataset);
            }
        })
        .catch(function (error) {
            console.error("Error fetching orders list:", error);
        });
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

    // Fetch a single order by ID
    $scope.getOrderbyid = function (id) {
        if (!order_id) {
            console.error("Order ID is missing!");
            return;
        }
    
        $http.get(`${config.baseurl}orders/get-order/${order_id}/`)
            .then(function (response) {
                if (response.data.status === 'false') {
                    console.error("Error fetching order:", response.data.message);
                } else {
                    if (!response.data.data) {
                        console.error("Order not found for ID:", order_id);
                        $scope.order = {}; // Empty category data if not found
                    } else {
                        // Ensure price and discount_price are numbers if they exist
                        $scope.order = response.data.data;
                        $scope.order.price = parseFloat($scope.order.price) || 0;  // Ensure price is a number
                        $scope.order.discount_price = parseFloat($scope.order.discount_price) || null;  // Ensure discount_price is a number
    
                        console.log("Order fetched:", $scope.order);
                    }
                }
            })
            .catch(function (error) {
                console.error("Error fetching order:", error);
            });
    };
    
    $scope.init = function () {
        $scope.list();
        // Initialize cart from localStorage
        $scope.cart = JSON.parse(localStorage.getItem("cart")) || [];
        $scope.updateCartTotal();
    }; 
    
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
});
    
function propertyNameFromModelPath(modelPath) {
    return modelPath.split('.').pop();
}
