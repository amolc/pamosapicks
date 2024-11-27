app.controller('login-ctrl', function($scope, $http, $window, config) {
    console.log(config.baseurl);

    // Initialize controller
    $scope.init = function() {
        const islogin = localStorage.getItem('islogin');

        if (islogin === '1') {
            $scope.name = localStorage.getItem('name');
            $scope.email = localStorage.getItem('email');
            $scope.phone = localStorage.getItem('phone');
            $scope.id = localStorage.getItem('id');
            $scope.org_id = localStorage.getItem('org_id');

            // Check if id exists in local storage
            if ($scope.id) {
                console.log("Agent ID found:", $scope.id);
                $window.location = "product.html"; // Redirect to product page
            } else {
                console.error("ID not found in local storage. Redirecting to login.");
                localStorage.clear();
                $window.location = "index.html";
            }
        }

        $("#pagecounter").load("/pagecounter.html");
    };

    // Login validation
    const vm = this;
    vm.loginvalidate = function(data) {
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

        if (vm.loginvalidate($scope.data)) {
            console.log("Validating login");

            const configHeaders = {
                headers: {
                    'Content-Type': 'application/json',
                }
            };

            // Construct the URL for the login request
            const url = `${config.baseurl}customer/get-customer`;
            console.log("Constructed URL:", url);
            console.log("Data being sent:", $scope.data);

            $http.post(url, $scope.data, configHeaders)
                .then(function(response) {
                    if (response.data.status === "success" && response.data.id) {
                        // Store relevant data in local storage
                        localStorage.setItem('islogin', '1');
                        localStorage.setItem('name', response.data.first_name);
                        localStorage.setItem('email', response.data.email);
                        localStorage.setItem('phone', response.data.mobile_number);
                        localStorage.setItem('id', response.data.id);
                        localStorage.setItem('org_id', response.data.org_id);
                        localStorage.setItem('isSuperAdmin', response.data.is_super_admin);

                        console.log("Agent ID stored in local storage:", response.data.id);
                        $window.location = "product.html"; // Redirect to product page
                    } else {
                        console.error("Login failed: Invalid credentials or missing agent ID.");
                        $scope.message = response.data.message || "Login failed: Please check your credentials.";
                    }
                })
                .catch(function(error) {
                    console.error("Login error:", error);
                    $scope.message = error.data?.message || "Login failed: Unable to connect.";
                });
        } else {
            console.log("Validation error occurred");
        }
    };

    $scope.init();
});
