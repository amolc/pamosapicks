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

app.filter('range', function() {
    return function(input, total) {
        total = parseInt(total);
        for (var i = 0; i < total; i++) {
            input.push(i);
        }
        return input;
    };
});


app.filter('display_availability', () => {
    return (availability) => {
        if (availability) {
            return 'In Stock';
        } else {
            return 'Out of Stock';
        }
    }
});

// Add this to enable HTML5 mode for cleaner URLs (optional)
app.config(['$locationProvider', function($locationProvider) {
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false
    });
}]);