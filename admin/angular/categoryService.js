angular.module('website').service('categoryService', function($http, config) {
    this.getCategories = function () {
        return $http.get(config.apiurl + "/1/api/categories/");
    };

    this.createCategory = function(formData) {
        return $http({
            method: 'POST',
            url: config.apiurl + "/categories/create/",
            data: formData,
            headers: {
                'Content-Type': undefined
            },
            transformRequest: angular.identity
        });
    };

    this.updateCategory = function (id, categoryData) {
        var formData = new FormData();
        formData.append('category_name', categoryData.category_name);
        formData.append('category_description', categoryData.category_description);
        formData.append('is_active', categoryData.is_active);

        if (categoryData.category_image) {
            formData.append('category_image', categoryData.category_image);
        }

        return $http.put(config.apiurl + "/1/api/categories/update/" + id + "/", formData, {
            transformRequest: angular.identity,
            headers: { 'Content-Type': undefined }
        });
    };

    this.deleteCategory = function (id) {
        return $http.delete(config.apiurl + "/1/api/categories/delete/" + id + "/");
    };
});
