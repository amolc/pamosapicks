app.controller("addsubcategoryCtrl", function ($scope, $http, $window, $location, config) {
    // Check if baseurl is correctly initialized
    console.log("Config Base URL:", config.baseurl); // Ensure this is initialized

    // Initialize base URL
    $scope.baseurl = config.baseurl;

    // Initialize the subcategory object
    $scope.subcategory = {};

    // Initialization function to fetch all subcategories
    $scope.init = function () {
        console.log("Initialization of addsubcategoryCtrl");
        $scope.getAllSubCategory(); // Corrected function name
    };

    // Function to set the agent ID from local storage
    $scope.setAId = function () {
        const id = localStorage.getItem('id'); // Retrieve ID
        console.log("Retrieved agent ID from local storage:", id); // Debugging log

        // Ensure the subcategory object is initialized before setting agent_id
        if (!$scope.subcategory) {
            $scope.subcategory = {}; // Initialize if not defined
        }

        if (id) {
            $scope.subcategory.agent_id = id; // Set agent ID in subcategory object
            console.log("Agent ID set in subcategory object:", $scope.subcategory.agent_id); // Debugging log
        } else {
            console.error('Agent ID not found in local storage.');
        }
    };

    // Function to get all subcategories
    $scope.getAllSubCategory = function () {
        var urlconfig = {
            headers: {
                "Content-Type": "application/json;",
            },
        };

        $http.get($scope.baseurl + 'subcategory/subcategory/', urlconfig)
            .then(function (response) {
                console.log("Fetched subcategory data:", response.data);
                $scope.categoryList = response.data.data;
            })
            .catch(function (error) {
                console.error("Error fetching subcategories:", error);
            });
    };

    // Sign out function to clear localStorage
    $scope.signOut = function () {
        localStorage.removeItem('agent_id');
        localStorage.clear(); // Clear all localStorage data
        window.location.href = 'index.html'; // Adjust path as necessary
    };

    // Prepare subcategory data and submit
    $scope.submitSubcategory = function () {
        // Validate subcategory data
        if (!$scope.subcategory.subcategory_name || !$scope.subcategory.subcategory_description) {
            alert("Name and Description are required.");
            return;
        }
    
        if (!$scope.subcategory.category) {
            alert("Category is required. Please select a category.");
            return;
        }
    
        console.log("Subcategory data being sent:", $scope.subcategory);
    
        // Create subcategory data object for POST request
        var subcategoryData = {
            subcategory_name: $scope.subcategory.subcategory_name,
            subcategory_description: $scope.subcategory.subcategory_description,
            is_active: $scope.subcategory.is_active,
            category_id: $scope.subcategory.category.id || $scope.subcategory.category, // Use 'id' if category is an object
        };
    
        console.log("Final subcategory data:", subcategoryData);
    
        // Send subcategory data via POST request
        $http.post($scope.baseurl + 'subcategory/create-subcategory/', subcategoryData)
            .then(function (response) {
                console.log("Subcategory added successfully:", response.data);
                alert("Subcategory successfully created!");
            })
            .catch(function (error) {
                console.error("AddSubcategory failed:", error);
                alert(error.data.message || "AddSubcategory failed! Please try again.");
            });

    
    
    };
});
