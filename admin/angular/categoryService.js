app.service('categoryService', function($http, config) {
    this.createCategory = function(categoryData) {
        var formData = new FormData();
        formData.append('category_name', categoryData.category_name);
        formData.append('category_description', categoryData.category_description);
        formData.append('is_active', categoryData.is_active);
        
        // Get file directly from input element
        var fileInput = document.getElementById('category-image');
        if (fileInput && fileInput.files[0]) {
            formData.append('category_image', fileInput.files[0]);
        }

        return $http.post(`${config.baseurl}category/categories/`, formData, {
            transformRequest: angular.identity,
            headers: {
                'Content-Type': undefined
            }
        });
    };
});