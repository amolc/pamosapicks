app.controller("editsubcategoryCtrl", function ($scope, $http, $window, $location, config) {
    var urlParams = new URLSearchParams(window.location.search);
    var subcategoryId = urlParams.get('subcategory_id');
    $scope.baseurl = config.baseurl;

    console.log(config);

    // Initialize isSubmitting to false
    $scope.isSubmitting = false;

    // Initialization function to fetch subcategory details
    $scope.init = function () {
        console.log("Initializing subcategory details...");
        if (subcategoryId) {
            $scope.getSubcategoryIdDetails(subcategoryId); // Updated function name
        } else {
            console.error("Subcategory ID is missing from the URL!");
        }
    };

    // Function to get subcategory details by ID
    $scope.getSubcategoryIdDetails = function (id) {
        var urlconfig = {
            headers: {
                "Content-Type": "application/json"
            }
        };

        $http.get($scope.baseurl + `subcategory/get-subcategory/${subcategoryId}`, urlconfig)
        .then(function (response) {
            console.log("API Response:", response.data);

            // Check if data exists in the response
            if (response.data && response.data.data) {
                $scope.subcategory = response.data.data; // Assign API data to subcategory object
                console.log("Subcategory fetched:", $scope.subcategory);
            } else {
                console.error("Invalid data structure:", response.data);
            }
        })
            .catch(function (error) {
                console.error("Error fetching subcategory details:", error);
                alert("Failed to fetch subcategory details. Please try again.");
            });
    };

    // Initialize the form fields with default values
    $scope.subcategory = {
        subcategory_name: '',
        subcategory_description: '',
        created_at: '',
        category: '', // Default to an empty string
        is_active: '',
        // id: ''
    };

    // Submit updated subcategory data
    $scope.submitSubcategory = function () {
        if ($scope.isSubmitting) {
            return; // Prevent double submission
        }

        $scope.isSubmitting = true;

        const subcategoryData = {
            subcategory_name: $scope.subcategory.subcategory_name,
            subcategory_description: $scope.subcategory.subcategory_description,
            created_at: $scope.subcategory.created_at,
            category: $scope.subcategory.category,
            // id: $scope.subcategory.id
        };

        $http.patch($scope.baseurl + `subcategory/get-subcategory/${subcategoryId}/`, subcategoryData)
            .then(function (response) {
                console.log("Subcategory updated successfully:", response.data);
                alert("Subcategory successfully updated!");
                $window.location.href = 'subcategory.html'; // Redirect after success
            })
            .catch(function (error) {
                console.error("Update failed:", error);
                alert("Failed to update subcategory. Please try again.");
            })
            .finally(function () {
                $scope.isSubmitting = false; // Reset isSubmitting
            });
    };

    // Initialize the controller
    $scope.init();
});
