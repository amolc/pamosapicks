app.controller('categoryController', function($scope, $http, $location, categoryService, config) {
    $scope.init = function() {
        $scope.categories = [];
        $scope.category = {};
        $scope.loading = false;
        $scope.error = null;
        $scope.staticurl = config.staticurl;

        // Check if editing
        const params = new URLSearchParams(window.location.search);
        const categoryId = params.get('id');
        if (categoryId) {
            $scope.loadCategory(categoryId);
        } else {
            $scope.loadCategories();
        }
    };

    $scope.loadCategories = function() {
        $scope.loading = true;
        categoryService.getAllCategories()
            .then(function(response) {
                if (response.data.status === 'false') {
                    $scope.error = response.data.message;
                } else {
                    $scope.categories = response.data;
                }
            })
            .catch(function(error) {
                $scope.error = 'Error loading categories: ' + error.message;
            })
            .finally(function() {
                $scope.loading = false;
            });
    };

    $scope.loadCategory = function(id) {
        $scope.loading = true;
        categoryService.getCategory(id)
            .then(function(response) {
                if (response.data.status === 'false') {
                    $scope.error = response.data.message;
                } else {
                    $scope.category = response.data.data;
                }
            })
            .catch(function(error) {
                $scope.error = 'Error loading category: ' + error.message;
            })
            .finally(function() {
                $scope.loading = false;
            });
    };

    // Store file separately
    $scope.selectedImageFile = null;
    $scope.handleImageUpload = function(element) {
        if (element.files && element.files[0]) {
            $scope.selectedImageFile = element.files[0];
            $scope.$apply();
        }
    };

    $scope.saveCategory = function() {
        $scope.loading = true;
        $scope.error = null;

        let formData = new FormData();
        formData.append('category_name', $scope.category.category_name || '');
        formData.append('category_description', $scope.category.category_description || '');
        if ($scope.selectedImageFile) {
            formData.append('category_image', $scope.selectedImageFile);
        }

        let url, method;
        if ($scope.category.id) {
            url = config.baseurl + '/1/api/products/update-category/' + $scope.category.id + '/';
            method = 'PUT';
        } else {
            url = config.baseurl + '/1/api/products/create-category/';
            method = 'POST';
        }

        $http({
            method: method,
            url: url,
            data: formData,
            transformRequest: angular.identity,
            headers: { 'Content-Type': undefined }
        }).then(function(response) {
            if (response.data.status === 'false') {
                $scope.error = response.data.message;
            } else {
                window.location.href = 'categories.html';
            }
        }).catch(function(error) {
            $scope.error = 'Error saving category: ' + error.message;
        }).finally(function() {
            $scope.loading = false;
        });
    };

    $scope.deleteCategory = function(id) {
        if (!confirm('Are you sure you want to delete this category?')) {
            return;
        }

        $scope.loading = true;
        categoryService.deleteCategory(id)
            .then(function(response) {
                if (response.data.status === 'false') {
                    $scope.error = response.data.message;
                } else {
                    $scope.loadCategories();
                }
            })
            .catch(function(error) {
                $scope.error = 'Error deleting category: ' + error.message;
            })
            .finally(function() {
                $scope.loading = false;
            });
    };
});
