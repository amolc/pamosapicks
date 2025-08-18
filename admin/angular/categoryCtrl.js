app.controller('categoryCtrl', function ($scope, $http, $window, $location, $sce, $timeout, store, config, categoryService) {   
   $scope.data = {};
   $scope.dataset = [];
   $scope.category = {
      category_name: '',
      category_description: '',
      category_image: '',
      is_active: ''
   };

   // Fetch the list of categories
$scope.list = function () {
    console.log("Fetching category list from:", config.apiurl);
    categoryService.getCategories()
        .then(function (response) {
            if (!response.data || response.data.length === 0) {
                console.error("Category list is undefined or empty!");
                $scope.dataset = [];
            } else {
                $scope.dataset = response.data; // Directly assign the array
                console.log("Category list fetched:", $scope.dataset);
            }
        })
        .catch(function (error) {
            console.error("Error fetching category list:", error);
        });
};

   $scope.getcategorybyid = function (category_id) {
      if (!category_id) {
         console.error("category_id is missing!");
         return;
      }
   
      $http.get(`${config.apiurl}/1/api/categories/${category_id}/`)
         .then(function (response) {
            if (response.data.status === 'false') {
               console.error("Error fetching product:", response.data.message);
            } else {
               if (!response.data.data) {
                  console.error("Category not found for ID:", category_id);
                  $scope.category = {}; // Empty category data if not found
               } else {
                  $scope.category = response.data.data;
                  console.log("Category fetched:", $scope.category);
               }
            }
         })
         .catch(function (error) {
            console.error("Error fetching product:", error);
         }); };

   $scope.add = function () {
    if (
        !$scope.category.category_name ||
        !$scope.category.category_description ||
        $scope.category.is_active === '' ||
        $scope.category.is_active === undefined
    ) {
        alert("Please fill all required fields");
        return;
    }

    var fileInput = document.getElementById('category-image');
    if (!fileInput || !fileInput.files || !fileInput.files[0]) {
        alert("Please select an image");
        return;
    }

    var formData = new FormData();
    formData.append('category_name', $scope.category.category_name);
    formData.append('category_description', $scope.category.category_description);
    formData.append('is_active', $scope.category.is_active);
    formData.append('category_image', fileInput.files[0]);

    $scope.isSubmitting = true;
    console.log("Submitting category with FormData");

    categoryService.createCategory(formData)
        .then(function (response) {
            $scope.isSubmitting = false;
            if (response.data.status === 'false') {
                alert("Error adding category: " + response.data.message);
            } else {
                alert("Category added successfully!");
                $scope.category = { category_name: '', category_description: '', category_image: '', is_active: '' };
                fileInput.value = '';
                $scope.init();
                $("#addform").modal("hide");
            }
        })
        .catch(function (error) {
            $scope.isSubmitting = false;
            alert("An error occurred while adding the category. Please try again.");
            console.error(error);
        });
};



   // Update a category
   $scope.update = function (id) {
       if (!id) {
           alert("Invalid ID!");
           return;
       }
   
       if (!$scope.data.category_name || !$scope.data.category_description || 
           $scope.data.is_active === '' || $scope.data.is_active === undefined) {
           alert("Please fill all required fields");
           return;
       }
   
       var fileInput = document.getElementById('category-image');
       var formData = new FormData();
       formData.append('category_name', $scope.data.category_name);
       formData.append('category_description', $scope.data.category_description);
       formData.append('is_active', $scope.data.is_active);
       
       if (fileInput && fileInput.files && fileInput.files[0]) {
           formData.append('category_image', fileInput.files[0]);
       }
   
       $http.put(`${config.apiurl}/1/api/categories/update/${id}/`, formData, {
           transformRequest: angular.identity,
           headers: { 'Content-Type': undefined }
       })
       .then(function (response) {
           if (response.data.status === 'false') {
               console.error("Error updating category:", response.data.message);
               alert("Error updating category: " + response.data.message);
           } else {
               alert("Category updated successfully!");
               $scope.init();
               $("#editform").modal("hide");
           }
       })
       .catch(function (error) {
           console.error("Error updating category:", error);
           alert("An error occurred while updating the category. Please try again.");
       });
   };

   // Delete a product
   $scope.delete = function (id) {
      if (!id) {
         alert("Invalid  ID!");
         return;
      }

      if (!confirm("Are you sure you want to delete this ?")) {
         return;
      }

      $http.delete(`${config.apiurl}/1/api/categories/delete/${id}/`)
         .then(function (response) {
            if (response.data.status === 'false') {
               alert("Failed to delete category: " + response.data.message);
            } else {
               alert("Category deleted successfully!");
               $scope.init(); // Refresh the product list
               $("#deleteform").modal("hide");
            }
         })
         .catch(function (error) {
            console.error("Error deleting category:", error); // Fixed comment
            alert("An error occurred while deleting the category. Please try again."); // Fixed message
         });
   };

   $scope.init = function () {
      $scope.list();
   }

   // Open the delete modal and bind the selected product data
   $scope.ondelete = function (data) {
      console.log("Delete modal triggered with data:", data);
      $scope.category = angular.copy(data); // Bind the product data to $scope.product
      $("#deleteform").modal("show"); // Show the delete confirmation modal
   };

   // Open the edit modal
   $scope.onedit = function (data) {
       $scope.data = angular.copy(data); // Use data consistently
       console.log($scope.data)
       $("#editform").modal("show");
   };



   // Open the add modal
   $scope.addform = function () {
       $scope.category = {
           category_name: '',
           category_description: '',
           category_image: '',
           is_active: ''
       }; // Reset form for new category
       $("#addform").modal("show");
   };

   // Add product submit handler
   $scope.onsubmit = function () {
       var fileInput = document.getElementById('categoryImage');
       if (!fileInput || !fileInput.files || !fileInput.files[0]) {
           alert('Please select an image');
           return;
       }
       
       var formData = new FormData();
       formData.append('name', $scope.category.name);
       formData.append('description', $scope.category.description);
       formData.append('active', $scope.category.active || 'Yes');
       formData.append('image', fileInput.files[0]);
       
       categoryService.createCategory(formData)
           .then(function (response) {
               if (response.data.success) {
                   $('#addform').modal('hide');
                   $scope.getCategories();
                   $scope.category = {};
                   document.getElementById('categoryImage').value = '';
               } else {
                   alert(response.data.message || 'Error creating category');
               }
           })
           .catch(function (error) {
               console.error('Error creating category:', error);
               alert('Error creating category. Please try again.');
           });
   };
   // Edit product submit handler
   $scope.oneditsubmit = function (data) {
      console.log("are we calling the functon")
      $scope.data = data
      if ($scope.data && $scope.data.id) {
         $scope.update($scope.data.id);
      } else {
         alert("Invalid product ID!");
      }
   };

   // Close modal manually
   $scope.closeModal = function () {
      $("#deleteform").modal("hide");
   };

   $scope.closeaddModal = function () {
      $("#addform").modal("hide");
   };
});



function propertyNameFromModelPath(modelPath) {
   return modelPath.split('.').pop();
}
