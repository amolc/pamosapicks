app.controller('login-ctrl', function($scope, $http, $window, config) {
    console.log(config.baseurl);

    // Initialize controller
    $scope.init = function() {
        const islogin = localStorage.getItem('islogin');

        // Check if already logged in
        if (islogin === '1') {
            $scope.name = localStorage.getItem('name');
            $scope.email = localStorage.getItem('email');
            $scope.phone = localStorage.getItem('phone');
            // Check if id exists in local storage
            if ($scope.email) {
                console.log("User found:", $scope.email);
                $window.location.href = "/admin/products.html"; // Redirect to product page
            } else {
                console.error("User not found in local storage. Redirecting to login.");
                localStorage.clear();
                $window.location.href = "index.html";  // Redirect to login page if user is not found
            }
        }

        // Load the page counter (if necessary)
        $("#pagecounter").load("/pagecounter.html");
    };

    // Login validation
    $scope.loginvalidate = function(data) {
        if (!data || !data.email) {
            $scope.message = "Please provide an email address.";
            return false;
        } else if (!data.password) {
            $scope.message = "Please provide a password.";
            return false;
        }
        return true;
    };

    // Login function
    $scope.login = function() {
        $scope.message = "";

        // Log the data being validated
        console.log("Data being validated:", $scope.data);

        // Validate the form data using the loginvalidate function
        if ($scope.loginvalidate($scope.data)) {
            console.log("Validating login");

            const configHeaders = {
                headers: {
                    'Content-Type': 'application/json',
                }
            };

            // Check if the necessary parameters exist in $scope.data
            if (!$scope.data.email || !$scope.data.password) {
                console.error("Missing required fields: email or password");
                $scope.message = "Please provide both email and password.";
                return;
            }

            // Construct the URL for the login request
            let url = config.baseurl + 'admin/get-admin/';
            console.log("Constructed URL:", url);
            console.log("Data being sent:", $scope.data);

            // Make GET request to the server
            $http.get(url, { params: $scope.data, headers: configHeaders.headers })
                .then(function(response) {
                    if (response.data.status === "success") {
                        // Store relevant data in local storage (no agent ID)
                        localStorage.setItem('islogin', '1');
                        localStorage.setItem('name', response.data.first_name);
                        localStorage.setItem('email', response.data.email);
                        localStorage.setItem('phone', response.data.mobile_number);
                        // Remove unnecessary data, such as org_id or isSuperAdmin if not required

                        console.log("User stored in local storage:", response.data.email);
                        $window.location.href = "/admin/products.html";  // Redirect to product page
                    } else {
                        console.error("Login failed: Invalid credentials.");
                        $scope.message = response.data.message || "Login failed: Please check your credentials.";
                    }
                })
                .catch(function(error) {
                    console.error("Login error:", error);
                    $scope.message = error.data?.message || "Login failed: Unable to connect.";
                });
        } else {
            console.log("Validation error occurred");
            $scope.message = "Validation failed. Please check the input fields.";  // Provide more details to the user
        }
    };

    // Initialize the login process if necessary
    $scope.init();
});
