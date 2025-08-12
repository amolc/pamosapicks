app.controller('login-ctrl', function($scope, $http, $window, config) {
    $scope.data = {};

    $scope.init = function() {
        const islogin = localStorage.getItem('islogin');
        if (islogin === '1') {
            $window.location.href = "/admin/products.html";
        }
        $("#pagecounter").load("/pagecounter.html");
    };

    $scope.loginvalidate = function(data) {
        if ((!data.email && !data.mobile_number) || !data.password) {
            $scope.message = "Please provide email or mobile number and a password.";
            return false;
        }
        return true;
    };

    $scope.login = function() {
        $scope.message = "";

        if (!$scope.loginvalidate($scope.data)) {
            return;
        }

        const url = config.baseurl + 'customers/login-customer/';
        console.log("POST to:", url, "Data:", $scope.data);

        $http.post(url, $scope.data, { headers: { 'Content-Type': 'application/json' } })
            .then(function(response) {
                if (response.data.status === "success") {
                    const user = response.data.data.user;

                    localStorage.setItem('islogin', '1');
                    localStorage.setItem('name', user.first_name || "");
                    localStorage.setItem('email', user.email || "");
                    localStorage.setItem('phone', user.mobile_number || "");

                    $window.location.href = "/admin/products.html";
                } else {
                    $scope.message = response.data.message || "Login failed.";
                }
            })
            .catch(function(error) {
                console.error("Login error:", error);
                $scope.message = error.data?.message || "Unable to connect.";
            });
    };

    $scope.init();
});
