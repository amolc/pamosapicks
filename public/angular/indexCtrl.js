// Function to convert JSON object to query string
function jsonToQueryString(params) {
  return Object.keys(params)
      .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(params[key]))
      .join('&');
}

app.controller(
  "indexCtrl",
  function ($scope, $http, $window, $location, config) {
    $scope.init = function () {
      $scope.baseurl = config.baseurl;
      $scope.cartTotal = 100;
      $scope.search = null;
      $scope.categoryFilter = null;

      $scope.urlParams = Object.fromEntries(
        new URLSearchParams(window.location.search)
      );

      if ($scope.urlParams.hasOwnProperty('search')) {
        $scope.search = $scope.urlParams.search;
      }

      $scope.productlist();
      $scope.categorylist();

      // Initialize cart from localStorage
      $scope.cart = JSON.parse(localStorage.getItem("cart")) || [];
     
      $scope.updateCartTotal();
    };

    // Fetch the list of products
    $scope.productlist = function () {
      $scope.fetchingProductList = true;

      let url = '';

      if ($scope.urlParams.length == 0) {
        url = `${config.baseurl}product/products/`;
      } else {
        const queryString = jsonToQueryString($scope.urlParams);
        url = `${config.baseurl}product/products?${queryString}`;
      }

      $http.get(url)
          .then(function (response) {
              if (response.data.status === 'false') {
                  console.error("Error fetching product list:", response.data.message);
              } else {
                $scope.productdataset = response.data.data;
                $scope.num_products = $scope.productdataset.length;
                $scope.num_pages = response.data.num_pages;
                $scope.start_index = response.data.start_index;
                $scope.end_index = response.data.end_index;
                $scope.current_page = response.data.page;
              }
          })
          .catch(function (error) {
              console.error("Error fetching product list:", error);
          }).finally(() => {
            $scope.fetchingProductList = false;
          });
    };

    $scope.navigateToPage = page => {
      const url = new URL(window.location.href);
      url.searchParams.set('page', page);
      window.location.assign(url);
    }

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
