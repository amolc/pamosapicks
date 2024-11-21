app.controller(
    "addpropertyCtrl",
    function ($scope, $http, $window, $location, config) {
        $scope.data = {}; // Initialize the data object

        // Function to register a new user
        $scope.register = function() {
            console.log("Registration data being sent:", $scope.data);
    
            // Prepare registration data
            var registrationData = {
                email: $scope.data.email,
                password: $scope.data.password,
                first_name: $scope.data.first_name,
                last_name: $scope.data.last_name,
                mobile_number: $scope.data.mobile_number,
                city: $scope.data.city,
                total_sales: 0, // Initialize with 0 or set accordingly
                hire_date: null // Set hire_date as null initially or as needed
            };
    
            console.log("Final registration data:", registrationData);
    
            // Send registration data via POST request
            $http.post(config.baseurl + 'agent/create-agent/', registrationData)
                .then(function (response) {
                    console.log("Registration successful:", response.data);
                    alert("Account successfully created!");
                    // Optionally redirect to login or another page
                    $window.location.href = 'list-your-property.html'; // Redirect after successful registration
                })
                .catch(function (error) {
                    console.error('Registration failed:', error);
                    
                    // Check if the error response contains specific messages
                    if (error.data && error.data.errors) {
                        $scope.message = "Registration failed: " + Object.values(error.data.errors).join(", ");
                        alert($scope.message); // Display specific error messages
                    } else {
                        $scope.message = "Registration failed: " + error.data;
                        alert($scope.message); // Display general error message
                    }
                });
        };
    }
  );
  