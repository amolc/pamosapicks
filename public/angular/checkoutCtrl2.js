app.controller('BookingDetailsCtrl', function($scope, $http, $window, config) {

    // Define formatDate outside of any specific function so it can be used anywhere in the controller
    const formatDate = (date) => date.toISOString().split('T')[0];

    $scope.init = function() {
        console.log("init");

        // Retrieve booking data from local storage
        console.log(JSON.parse(localStorage.getItem('bookingData')));
        const bookingData = JSON.parse(localStorage.getItem('bookingData'));

        $scope.booking = {
            product_id: bookingData.product_id,
            check_in_date: new Date(bookingData.check_in_date), 
            check_out_date: new Date(bookingData.check_out_date),
            num_guests: bookingData.num_guests,
            num_rooms: bookingData.num_rooms,
            total_price: bookingData.total_price,
            num_days: 0,
            guestLimitExceeded: false,
            customers: []
        };

        console.log($scope.booking);

        if (!$scope.booking) {
            console.error("No booking data found in local storage.");
            return;
        }
        $scope.getproduct($scope.booking.product_id);

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
});
