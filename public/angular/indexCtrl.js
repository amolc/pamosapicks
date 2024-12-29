app.controller(
  "indexCtrl",
  function ($scope, $http, $window, $location, config) {
    $scope.init = function () {
      $scope.baseurl = config.baseurl;
      
      $scope.productlist();
      $scope.categorylist();
      $scope.categoryFilter = null;

      console.log(config);

      // Initialize cart from localStorage
      $scope.cart = JSON.parse(localStorage.getItem("cart")) || [];
      
      console.log($scope.cart);
    };

    // Fetch the list of products
    $scope.fetchingProductList = true;
    $scope.productlist = function () {
      console.log("Fetching product list from:", config.baseurl);
      $scope.fetchingProductList = true;
      $http.get(`${config.baseurl}product/products/`)
          .then(function (response) {
              if (response.data.status === 'false') {
                  console.error("Error fetching product list:", response.data.message);
              } else {
                console.log("Printing data");
                console.log(response.data.data);
                $scope.productdataset = response.data.data;
                $scope.num_products = $scope.productdataset.length;

                console.log("Product list fetched:", $scope.productdataset);
              }
          })
          .catch(function (error) {
              console.error("Error fetching product list:", error);
          }).finally(() => {
            $scope.fetchingProductList = false;
          });
    };

    $scope.productListByCategory = function(category_id, category_name) {
      $scope.fetchingProductList = true;
      $scope.categoryFilter = category_name;
      $http.get(`${config.baseurl}product/products?category_id=${category_id}`)
        .then(function (response) {
          if (response.data.status === 'false') {
              console.error("Error fetching product list:", response.data.message);
          } else {
            console.log("Printing data");
            console.log(response.data.data);
            $scope.productdataset = response.data.data;
            $scope.num_products = $scope.productdataset.length;

            console.log("Product list fetched:", $scope.productdataset);
          }
        })
        .catch(function (error) {
            console.error("Error fetching product list:", error);
        }).finally(() => {
          $scope.fetchingProductList = false;
        });
      };

    $scope.fetchingCategoryList = true;
    $scope.categorylist = function() {
      $http.get(`${config.baseurl}category/category/`)
          .then(function (response) {
              if (response.data.status === 'false') {
                  console.error("Error fetching category list:", response.data.message);
              } else {
                console.log("Fetched categories from: ", `${config.baseurl}category/category/`);
                console.log("Categories fetched: ");
                console.log("Response: ", response);
                console.log(response.data);
                $scope.categorydataset = response.data;
              }
          })
          .catch(function (error) {
              console.error("Error fetching category list:", error);
          }).finally(() => {
            $scope.fetchingCategoryList = false;
          });
    }

    $scope.addToCart = function (id, product_name, qty, price,image) {
      qty = Number(qty);
      const product = {
        id: id,
        product_name: product_name,
        quantity: qty,
        price: Number(price), // Ensure price is stored as a number
        product_image:image
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
              <a href="shop-details.html?id={{id}}">
                <img src="assets/img/product/products{{id}}-min.jpg" alt="{{product_name}}">
              </a>
            </td>
            <td class="product-name">
              <a href="shop-details.html?id={{id}}">{{product_name}}</a>
            </td>
            <td class="product-price">
              <span class="amount">₹{{price.toFixed(2)}}</span>
            </td>
            <td class="product-quantity">
              <span class="cart-minus" onclick="angular.element(this).scope().updateQuantity({{id}}, -1)">-</span>
              <input 
                class="cart-input" 
                type="number" 
                value="{{quantity}}" 
                min="1" 
                onchange="angular.element(this).scope().updateTotal(this, {{id}})"
              >
              <span class="cart-plus" onclick="angular.element(this).scope().updateQuantity({{id}}, 1)">+</span>
            </td>
            <td class="product-subtotal">
              <span class="amount">₹{{itemTotal.toFixed(2)}}</span>
            </td>
            <td class="product-remove">
              <a href="#" onclick="angular.element(this).scope().removeItem({{id}})"><i class="fa fa-times"></i></a>
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
