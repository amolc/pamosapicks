app.controller("editCategoryCtrl", function ($scope, $http, $window, config) {
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
      category_image: '',
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
               console.log(response.data);
               $scope.category = {
                  id: response.data.id,
                  category_image: response.data.category_image,
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
         category_image: $scope.category.category_image,
         created_at: $scope.category.created_on, // Check if this matches backend expectations
         is_active: $scope.category.is_active
      };

      $http.patch(`${$scope.baseurl}category/get-category/${categoryId}/`, categoryData)
         .then(function (response) {
            console.log("Category updated successfully:", response.data);
            alert("Category successfully updated!");
            $window.location.href = `/admin/editCategory.html?category_id=${categoryId}`; // Redirect after success
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
});

// Attach function to window for global access
window.convertToBase64 = function (inputId, modelPath) {
   const fileInput = document.getElementById(inputId);
   const file = fileInput.files[0];

   if (file) {
      const reader = new FileReader();
      reader.onload = function (event) {
         const base64String = event.target.result;

         const scope = angular.element(document.querySelector('[ng-controller="editCategoryCtrl"]')).scope();
         scope.category['category_image'] = base64String;

         scope.$apply();
      };

      reader.readAsDataURL(file);
   } else {
      console.error("No file selected for:", inputId); // Log if no file is selected
   }
};

function propertyNameFromModelPath(modelPath) {
   return modelPath.split('.').pop();
}
