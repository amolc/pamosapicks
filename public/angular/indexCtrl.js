app.controller(
  "indexCtrl",
  function ($scope, $http, $window, $location, $sce, $timeout, store, config) {
    $scope.init = function () {
      $scope.baseurl = config.baseurl;
      $scope.staticurl  = config.staticurl;
      console.log( $scope.baseurl);
      console.log( $scope.staticurl);
      $scope.cartTotal = 0;
      $scope.search = null;
      $scope.categoryFilter = null;
      $scope.user = localStorage.getItem("user") ?? undefined;

      $scope.urlParams = new URLSearchParams(window.location.search);

      const isCustomerLoggedIn = localStorage.getItem('isCustomerLoggedIn');
      $scope.isCustomerLoggedIn = isCustomerLoggedIn === '1';

      if (urlParams.hasOwnProperty('search')) {
        $scope.search = $scope.urlParams.search;
      }
      if (urlParams.hasOwnProperty('category_id')) {
        $scope.categoryFilter = $scope.urlParams.category_id;
      }

      $scope.categorylist();
      $scope.getProductList();
      

      // Initialize cart from localStorage
      $scope.cart = getCart();
      $scope.updateCartTotal();
    };

    $scope.checkout = () => {
      $scope.mobilephone =  localStorage.getItem('mobilephone');

      if ($scope.currency === "INR") {
        $location.path('/checkout.html');
      }else{
        $("#mobilephoneModal").modal("show");
      }
      
    }
    $scope.getProductList = () => {
      $scope.fetchingProductList = true;
      /**
       * Depends on:
       *  - lib/common.js
       *  - lib/products.js
       */
      getProductList(config, urlParams, $http)
      .then(productList => {
        $timeout(() => {
          $scope.productdataset = productList.productdataset;
          $scope.num_pages = productList.num_pages;
          $scope.num_products = productList.num_products;
          $scope.start_index = productList.start_index;
          $scope.end_index = productList.end_index;
          console.log("Product list Fetched: ", $scope.productdataset);
        });
      })
      .catch(error => {
        console.error("Error fetching product list:", error);
      })
      .finally(() => {
        $timeout(() => {
          $scope.fetchingProductList = false;
        });
      });
    };

    /**
     * Depends on:
     *  - lib/common.js
     */
    $scope.navigateToPage = navigateToPage;

    $scope.fetchingCategoryList = true;
    $scope.categorylist = function() {
      console.log("Fetching category list from:", config.baseurl+'products/category/');
      $http.get(`${config.baseurl}products/category/`)
          .then(function (response) {
              if (response.data.status === 'false') {
                  console.error("Error fetching category list:", response.data.message);
              } else {
                $scope.categorydataset = response.data;
              }
          })
          .catch(function (error) {
              console.error("Error fetching category list:", error);
          }).finally(() => {
            $scope.fetchingCategoryList = false;
          });
    }

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

      if (total < 100) {
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
  }
);
