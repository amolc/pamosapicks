var app = angular.module('website', ['angular-storage', 'angularPayments']);
app.config(['storeProvider', function(storeProvider) {
    storeProvider.setStore('sessionStorage');

}]);