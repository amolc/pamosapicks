app.controller('productCtrl', function($scope, $http, $window, $location, $sce, $timeout, store, config) {

    $scope.data = {};
    $scope.properties = []; // Array to hold the properties
    $scope.adminInfo = {};  // Object to hold agent information

    $scope.init = function() {
        $scope.fetchAdminProduct(); // Fetch properties on initialization
        $scope.fetchAdminInfo();       // Fetch agent info on initialization
    };

    // Function to fetch properties for the logged-in agent
    $scope.fetchAdminProduct = function() {
        const admin_id = localStorage.getItem('admin_id'); // Use the correct key for agent ID
    
        if (!admin_id) {
            console.error('Admin ID not found in local storage.');
            return;
        }
    
        console.log("Fetching properties for agent ID:", agent_id); // Log agent ID
    
        // Fetch properties using the agent ID
        $http.post(config.baseurl + 'property/properties/agent', { agent_id: agent_id })
            .then(function(response) {
                if (response.data.status == 'success') {
                    $scope.dataset = response.data.data; // Assuming the data is in response.data.data
                    console.log('dataset: ', $scope.dataset);
                } else {
                    console.error('Error fetching properties:', response.data.message);
                }
            })
            .catch(function(error) {
                console.error('Error fetching properties:', error);
            });
    };

    // Function to fetch agent info
    $scope.fetchAdminInfo = function() {
        const admin_id = localStorage.getItem('admin_id');
    
        if (!admin_id) {
            console.error('Admin ID not found.');
            return;
        }

        console.log("Fetching info for admin ID:", admin_id);

        $http.get(config.baseurl + 'admin/get-admin/' + admin_id + '/')

            .then(function(response) {
                $scope.adminInfo = response.data.data;
                console.log('Admin Info:', $scope.agentInfo);
            })
            .catch(function(error) {
                console.error('Error fetching admin info:', error);
            });
    };

    $scope.signOut = function() {
        // Remove any stored authentication information, e.g., token or agent_id
        localStorage.removeItem('admin_id');
        
        // Optionally, you might also want to remove other data
        localStorage.clear(); // Clear all localStorage data
    
        // Redirect to the login or index page
        window.location.href = 'index.html'; // Adjust the path based on your project structure
    };
    

    // Function to add property
    $scope.add = function(req, res) {
        console.log($scope.data);
        
        $http.post(config.baseurl + 'property/properties/', $scope.data)
            .success(function(res) {
                if (res.status == 'false') {
                    // Handle error
                } else {
                    $scope.response = res.data;
                    console.log('message: ', $scope.response);
                    // window.location.reload();
                }
            }).error(function() {
                // Handle error
            });
    };

    // Function to update property
    $scope.update = function(id) {
        $http.patch(config.baseurl + 'property/properties/' + id + '/', $scope.data)
            .success(function(res) {
                if (res.status == 'false') {
                    // Handle error
                } else {
                    $scope.data = res.data;
                    console.log('data: ', $scope.data);
                }
            }).error(function() {
                // Handle error
            });
    };

    // Function to delete property
    $scope.delete = function(id) {
        console.log("delete id:", id);
        
        $http.delete(config.baseurl + 'property/properties/' + id + '/')
            .then(function(response) {
                if (response.data.status === 'false') {
                    // Handle error
                    console.log("Error: ", response.data.message);
                } else {
                    console.log("Property deleted successfully.");
    
                    // Optionally, show a success message
                    alert("Property deleted successfully.");
    
                    // Refresh the property list after successful deletion
                    $scope.list();
    
                    // Redirect to the property page
                    $scope.redirect();
                }
            })
            .catch(function(error_response) {
                console.error("Error response:", error_response);
            });
    };
    
    // Modal and form handling functions
    $scope.redirect = function() {
        console.log("Redirecting to product.html");
        window.location.href = 'product.html';
    };

    $scope.list = function() {
        return $http.get(config.baseurl + 'product/products/')
            .then(function(response) {
                // Assuming response.data contains the properties list
                $scope.properties = response.data; // Adjust according to your data structure
            })
            .catch(function(error) {
                console.error("Error fetching properties:", error);
            });
    };

    $scope.onedit = function(data) {
        console.log(data);
        $scope.data = data;
        console.log($scope.data);
        $("#editform").modal("show");
    };

    $scope.ondelete = function(data) {
        console.log("delete modal");
        $scope.data = data;
        $("#deleteform").modal("show");
    };

    $scope.addform = function() {
        $scope.data = {};
        $("#addform").modal("show");
    };

    $scope.editform = function() {
        $scope.data = {};
        $("#editform").modal("show");
    };

    $scope.onsubmit = function(data) {
        $scope.data = data;
        console.log($scope.data);
        $scope.add($scope.data);
        $("#addform").modal("hide");
    };

    $scope.oneditsubmit = function(data) {
        console.log("onedit");
        $scope.data = data;
        console.log($scope.data.id);
        $scope.update($scope.data.id);
        $("#editform").modal("hide");
    };

    // Additional modal functions for handling form versions (if required)
    $scope.addform1 = function() {
        $scope.data = {};
        $("#addform1").modal("show");
    };

    $scope.editform1 = function() {
        $scope.data = {};
        $("#editform1").modal("show");
    };

    $scope.onsubmit1 = function(data) {
        $scope.data = data;
        console.log($scope.data);
        $scope.add($scope.data);
        $("#addform1").modal("hide");
    };

    $scope.oneditsubmit1 = function(data) {
        console.log("onedit");
        $scope.data = data;
        console.log($scope.data.id);
        $scope.update($scope.data.id);
        $("#editform1").modal("hide");
    };

});
