app.controller("editcategoryCtrl", function ($scope, $http, $window, config) {
    // Extract `category_id` from the URL
    var urlParams = new URLSearchParams($window.location.search);
    var categoryId = urlParams.get('category_id'); 

    $scope.baseurl = config.baseurl;
    $scope.isSubmitting = false;

    if (!categoryId) {
        console.error("Category ID is missing from the URL!");
        alert("Category ID is missing! Please check the URL.");
        return;
    }

    console.log("Extracted Category ID:", categoryId);

    // Initialize category object
    $scope.category = {
        category_name: '',
        category_description: '',
        created_on: '',
        is_active: ''
    };

    // Fetch category details
    $scope.getCategoryDetails = function () {
        var urlconfig = {
            headers: {
                "Content-Type": "application/json"
            }
        };
    
        $http.get(`${$scope.baseurl}category/get-category/${categoryId}`, urlconfig)
            .then(function (response) {
                console.log("Category details fetched successfully:", response.data);
    
                // Directly map response data to category object
                if (response.data) {
                    $scope.category = {
                        category_name: response.data.category_name || '',
                        category_description: response.data.category_description || '',
                        created_on: response.data.created_at || '',  // Ensure backend field matches
                        is_active: response.data.is_active || false // Default value if not provided
                    };
                } else {
                    console.error("Unexpected response structure:", response.data);
                    alert("Invalid response from the server.");
                }
            })
            .catch(function (error) {
                console.error("Error fetching Category details:", error);
                alert("Failed to fetch Category details.");
            });
    };
    
    // Submit updated category data
    $scope.submitCategory = function () {
        if ($scope.isSubmitting) return;

        $scope.isSubmitting = true;

        const categoryData = {
            category_name: $scope.category.category_name,
            category_description: $scope.category.category_description,
            created_at: $scope.category.created_on, // Check if this matches backend expectations
            is_active: $scope.category.is_active
        };

        $http.patch(`${$scope.baseurl}category/get-category/${categoryId}/`, categoryData)
            .then(function (response) {
                console.log("Category updated successfully:", response.data);
                alert("Category successfully updated!");
                $window.location.href = 'category.html'; // Redirect after success
            })
            .catch(function (error) {
                console.error("Update failed:", error);
                alert("Failed to update Category.");
            })
            .finally(function () {
                $scope.isSubmitting = false;
            });
    };

    // Initialize the controller
    $scope.init = function () {
        console.log("Initializing editcategoryCtrl with Category ID:", categoryId);
        $scope.getCategoryDetails();
    };

    $scope.init();
});
