app.controller("addcategoryCtrl", function ($scope, $http, $window, $location, config) {
    // Check if baseurl is correctly initialized
    console.log("Config Base URL:", config.baseurl); // Ensure this is initialized

    // Initialize base URL
    $scope.baseurl = config.baseurl;

    // Initialize the category object
    $scope.category = {};

    // Initialization function to fetch all categories
    $scope.init = function () {
        console.log("Initialization of addcategoryCtrl");
        $scope.getAllCategory(); // Corrected function name
    };

    // Function to set the agent ID from local storage
    $scope.setAId = function () {
        const id = localStorage.getItem('id'); // Retrieve ID
        console.log("Retrieved agent ID from local storage:", id); // Debugging log

        // Ensure the category object is initialized before setting agent_id
        if (!$scope.category) {
            $scope.category = {}; // Initialize if not defined
        }

        if (id) {
            $scope.category.agent_id = id; // Set agent ID in category object
            console.log("Agent ID set in category object:", $scope.category.agent_id); // Debugging log
        } else {
            console.error('Agent ID not found in local storage.');
        }
    };

    // Function to get all categories
    $scope.getAllCategory = function () {
        var urlconfig = {
            headers: {
                "Content-Type": "application/json;",
            },
        };

        $http.get($scope.baseurl + 'category/category/', urlconfig)
            .then(function (response) {
                console.log("Fetched category data:", response.data);
                $scope.categoryList = response.data.data;
            })
            .catch(function (error) {
                console.error("Error fetching category:", error);
            });
    };

    // Sign out function to clear localStorage
    $scope.signOut = function () {
        localStorage.removeItem('agent_id');
        localStorage.clear(); // Clear all localStorage data
        window.location.href = 'index.html'; // Adjust path as necessary
    };

    // // Navigate to category detail page based on categoryId
    // $scope.goToProductDetail = function (categoryId) {
    //     $window.location.href = '/detail.html?product_id=' + categoryId;
    // };

    // Prepare category data and submit
    $scope.submitCategory = function () {
        // Validate category data
        if (!$scope.category.category_name) { // Fixed syntax issue in validation
            console.error("Category name is missing!");
            alert("Category name is required.");
            return; // Prevent form submission
        }

        console.log("Category data being sent:", $scope.category);

        // Create category data object for POST request
        var categoryData = {
            category_name: $scope.category.category_name,
            Description: $scope.category.category_description,
            IsActive: $scope.category.IsActive,
            Category: $scope.category.categoryId,
        };

        console.log("Final category data:", categoryData);

        // Send category data via POST request
        $http.post($scope.baseurl + 'category/category/', categoryData)
            .then(function (response) {
                console.log("Category added successfully:", response.data);
                alert("Category successfully created!");
            })
            .catch(function (error) {
                console.error("AddCategory failed:", error);
                alert("AddCategory failed! Please try again.");
            });
    };
});
