app.controller('loginCtrl', function($scope, $http, $window, config) {
  console.log(config.baseurl);

  // Initialize controller
  $scope.init = function() {
    const isCustomerLoggedIn = localStorage.getItem('isCustomerLoggedIn');

    // Check if already logged in
    if (isCustomerLoggedIn === '1') {
      $scope.name = localStorage.getItem('name');
      $scope.email = localStorage.getItem('email');
      $scope.phone = localStorage.getItem('phone');
      // Check if email exists in local storage
      if ($scope.email) {
        console.log("User found:", $scope.email);
        $window.location.href = "/"; // Redirect to customer dashboard
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
    if (!data || !data.mobile_number) {
      $scope.message = "Please provide a mobile number.";
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

    // Validate the form data using the loginvalidate function
    if ($scope.loginvalidate($scope.data)) {
      console.log("Validating login");

      const configHeaders = {
        headers: {
          'Content-Type': 'application/json',
        }
      };

      // Check if the necessary parameters exist in $scope.data
      if (!$scope.data.mobile_number || !$scope.data.password) {
        console.error("Missing required fields: email or password");
        $scope.message = "Please provide both email and password.";
        return;
      }

      // Construct the URL for the login request for customers
      let url = config.baseurl + 'customer/login-customer/';  // Changed from 'admin/get-admin/' to 'customer/get-customer/'
      
      // Make GET request to the server
      console.log("Making request with data: ");
      console.log($scope.data);
      $http.post(url, $scope.data)
        .then(function(response) {
          if (response.data.status === "success") {
            // Store relevant data in local storage (no agent ID)
            
            localStorage.setItem('isCustomerLoggedIn', '1');
            console.log(response.data);
            
            localStorage.setItem('name', response.data.first_name);
            localStorage.setItem('email', response.data.email);
            localStorage.setItem('phone', response.data.mobile_number);

            console.log("User stored in local storage:", response.data.email);
            $window.location.href = "/";  // Redirect to customer dashboard
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
