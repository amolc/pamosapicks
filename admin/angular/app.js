var app = angular.module('website', ['angular-storage', 'angularPayments','chart.js']);
app.constant("config", {
    apiurl: "http://localhost:9999/1/api",
    imageurl: "http://localhost:9999/assets/img",
    business_id: 40
});