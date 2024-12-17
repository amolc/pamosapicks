var app = angular.module('website', ['angular-storage']);
app.config(['storeProvider', function(storeProvider) {
    storeProvider.setStore('sessionStorage');

}]);



