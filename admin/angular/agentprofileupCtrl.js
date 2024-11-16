app.controller(
    "addpropertyCtrl",
    function ($scope, $http, $window, $location, config) {
      
        $scope.agentInfo = {};  // Object to hold agent information

        $scope.init = function() {
            $scope.fetchAgentInfo(); // Fetch agent info on initialization
        };
    
        // Function to fetch agent info
        $scope.fetchAgentInfo = function() {
            const agent_id = localStorage.getItem('agent_id'); // Retrieve the agent ID
    
            if (!agent_id) {
                console.error('Agent ID not found.');
                return;
            }
    
            console.log("Fetching info for agent ID:", agent_id);
            $http.get(`${config.baseurl}agent/get-agent/${agent_id}/`)
                .then(function(response) {
                    if (response.data.status === 'success') {
                        $scope.agentInfo = response.data.data; // Update the agentInfo object
                    } else {
                        console.error('Error fetching agent info:', response.data.message);
                    }
                })
                .catch(function(error) {
                    console.error('Error fetching agent info:', error);
                });
        };
        
        $scope.signOut = function() {
            // Remove any stored authentication information, e.g., token or agent_id
            localStorage.removeItem('agent_id');
            
            // Optionally, you might also want to remove other data
            localStorage.clear(); // Clear all localStorage data
        
            // Redirect to the login or index page
            window.location.href = 'index.html'; // Adjust the path based on your project structure
        };
        
        // Function to update profile
        $scope.updateProfile = function() {
            const agent_id = localStorage.getItem('agent_id');
    
            if (!agent_id) {
                console.error('Agent ID not found.');
                return;
            }
    
            console.log("Updating profile for agent ID:", agent_id);
            $http.patch(`${config.baseurl}agent/update-agent/${agent_id}/`, $scope.agentInfo)
                .then(function(response) {
                    if (response.data.status === 'success') {
                        alert('Profile updated successfully!');
                    } else {
                        console.error('Error updating profile:', response.data.message);
                        $scope.message = response.data.message;
                    }
                })
                .catch(function(error) {
                    console.error('Error updating profile:', error);
                    $scope.message = 'Profile update failed!';
                });
        };
    }
  );
  