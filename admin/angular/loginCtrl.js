app.controller('login-ctrl', function($scope, $http, $window, config) {
    console.log(config.baseurl);

    // Initialize controller
    $scope.init = function() {
        var islogin = localStorage.getItem('islogin');

        if (islogin === '1') {
            $scope.name = localStorage.getItem('name');
            $scope.email = localStorage.getItem('email');
            $scope.phone = localStorage.getItem('phone');
            $scope.agent_id = localStorage.getItem('agent_id');
            $scope.org_id = localStorage.getItem('org_id');

            // Check if agent ID is present
            if ($scope.admin_id) {
                $window.location = "product.html"; // Redirect to agent page
            } else {
                console.error("Agent ID not found in local storage.");
                // Optionally handle the case where the agent ID is not found
            }
        }

        $("#pagecounter").load("/pagecounter.html");
    };

    // Login validation
    var vm = this; 
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
    
            var configHeaders = {
                headers: {
                    'Content-Type': 'application/json',
                }
            };
    
            // Construct the URL for the login request
            $scope.url = config.baseurl + 'admin/login-admin/';
            console.log("Constructed URL:", $scope.url);
            console.log("Data being sent:", $scope.data);
    
            $http.post($scope.url, $scope.data, configHeaders)
                .then(function(response) {
                    console.log("Login successful:", response.data);
    
                    if (response.data.agent_id) {
                        localStorage.setItem('islogin', '1');
                        localStorage.setItem('name', response.data.first_name);
                        localStorage.setItem('email', response.data.email);
                        localStorage.setItem('phone', response.data.mobile_number);
                        localStorage.setItem('agent_id', response.data.agent_id);
                        localStorage.setItem('org_id', response.data.org_id);
                        localStorage.setItem('isSuperAdmin', response.data.is_super_admin);
                        
                        console.log("Admin ID stored in local storage:", localStorage.getItem('admin_id'));
                        $window.location = "product.html"; // Redirect to agent page
                    } else {
                        console.error("User data not found in the response.");
                        $scope.message = "Login failed: User information is not available.";
                    }
                })
                .catch(function(response) {
                    $scope.message = "Login failed: " + (response.data.message || "Invalid email or password.");
                    console.error("Login error:", response);
                });
        } else {
            console.log("Validation error occurred");
        }
    };
    

    $scope.init();
});
