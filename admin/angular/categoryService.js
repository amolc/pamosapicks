app.service('categoryService', function($http, config) {

    // Create category
    this.createCategory = function(formData) {
        return $http.post(`${config.baseurl}categories/create-category/`, formData, {
            transformRequest: angular.identity,
            headers: { 'Content-Type': undefined }
        });
    };

    // List categories
    this.getCategories = function() {
        return $http.get(`${config.baseurl}categories/get-categories/`);
    };

    // Get category by ID
    this.getCategory = function(id) {
        return $http.get(`${config.baseurl}categories/get-category/${id}/`);
    };

    // Delete category
    this.deleteCategory = function(id) {
        return $http.delete(`${config.baseurl}categories/delete-category/${id}/`);
    };

    // Update category
    this.updateCategory = function(id, formData) {
        return $http.put(`${config.baseurl}categories/update-category/${id}/`, formData, {
            transformRequest: angular.identity,
            headers: { 'Content-Type': undefined }
        });
    };
});
