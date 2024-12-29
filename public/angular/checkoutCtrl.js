app.controller('checkoutCtrl', function($scope, $http, $window, config) {

    // Define formatDate outside of any specific function so it can be used anywhere in the controller
    const formatDate = (date) => date.toISOString().split('T')[0];

    $scope.init = function() {
        $scope.cartTotal = 100;
        
        $scope.urlParams = Object.fromEntries(
          new URLSearchParams(window.location.search)
        );
        $scope.categoryFilter = null;
  
        // Initialize cart from localStorage
        $scope.cart = JSON.parse(localStorage.getItem("cart")) || [];
       
        $scope.updateCartTotal();
    };


    $scope.getproduct = function(product_id) {
        $http.get(`${config.baseurl}product/products/${product_id}`)        //Add product
        .then(function(response) {
            console.log("Product details:", response.data);
            if (response.data && response.data.data) {
                $scope.productDetail = response.data.data;
            } else {
                console.error("Product details not found.");
            }
        })
        .catch(function(error) {
            console.error("Error fetching product details:", error);
        });
    };

    $scope.updateTotalPrice = function() {
        var costPerRoom = $scope.propertyDetail.price_room || 0;
        var numRooms = $scope.booking.num_rooms || 0;
        var checkInDate = new Date($scope.booking.check_in_date);
        var checkOutDate = new Date($scope.booking.check_out_date);
        var timeDiff = checkOutDate.getTime() - checkInDate.getTime();
        $scope.booking.num_days = Math.ceil(timeDiff / (1000 * 3600 * 24));

        // Calculate total price for the rooms
        if ($scope.booking.num_days > 0 && numRooms > 0) {
            $scope.booking.room_total_price = costPerRoom * numRooms * $scope.booking.num_days;
        } else {
            $scope.booking.room_total_price = 0;
        }

        // Calculate GST (18% as per example)
        $scope.booking.gst = $scope.booking.room_total_price * 0.18;
        $scope.booking.final_price = $scope.booking.room_total_price + $scope.booking.gst;
    };

    $scope.submitCheckoutDetails = function() {
        console.log("Hello");
        console.log($scope.guests);

        const bookingData = {
            product_id: $scope.booking.product_id,
            check_in_date: formatDate($scope.booking.check_in_date),
            check_out_date: formatDate($scope.booking.check_out_date),
            num_guests: $scope.booking.num_guests,
            num_rooms: $scope.booking.num_rooms,
            total_price: $scope.booking.total_price,
            gst: $scope.booking.gst,
            final_price: $scope.booking.final_price,
            customers: $scope.guests.map(customer => ({
                name: customer.name,
                email: customer.email,
                age: customer.age
            })),
        };

        console.log(bookingData);

        $http.post(`${config.baseurl}booking/create-booking/`, bookingData)
        .then(function(response) {
            console.log("Booking submitted successfully:", response.data);
            $window.location.href = '../thankyou.html'; 
        })
        .catch(function(error) {
            console.error("Error submitting booking:", error);
            alert("An error occurred while submitting the booking. Please try again.");
        });
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
});
