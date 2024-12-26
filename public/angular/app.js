var app = angular.module('website', ['angular-storage']);
app.config(['storeProvider', function(storeProvider) {
    storeProvider.setStore('sessionStorage');
}]);

app.filter('round', function() {
    return function(input, decimals) {
        if (!input) return input; // Handle undefined or null
        return Math.round(input * Math.pow(10, decimals)) / Math.pow(10, decimals);
    };
});