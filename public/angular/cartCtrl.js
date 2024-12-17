
app.controller(
    "cartCtrl",
    function ($scope, $http, $window, $location, config) {
       
        $scope.init = function () {
            $scope.baseurl = config.baseurl;
            console.log(config);
            $scope.cart = JSON.parse(localStorage.getItem('cart')) || [];
            console.log($scope.cart);
        };

       
        $scope.addToCart = function (id, product_name, qty, price) {
            qty = Number(qty);
            // Create a JSON object for the product
            const product = {
                id: id,
                product_name: product_name,
                quantity: qty,
                price: price
            };
        
            console.log("Adding Product:", product);
        
            // Initialize the cart if it doesn't exist
            $scope.cart = $scope.cart || [];
        
            // Check if the product already exists in the cart
            let existingProduct = $scope.cart.find(item => item.id === id);
        
            if (existingProduct) {
                // If the product exists, increment its quantity
                existingProduct.quantity += qty;
            } else {
                // If the product is new, add it to the cart
                $scope.cart.push(product);
            }
            localStorage.setItem('cart', JSON.stringify($scope.cart));
            console.log("Updated Cart:", $scope.cart);
        };
            
 }); 
  