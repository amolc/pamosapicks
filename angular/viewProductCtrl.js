angular.module('website').controller('viewProductCtrl', function($scope, $http, $location, config) {
  var product_id = $location.search().product_id;

  if (!product_id) {
    console.error("Product ID is missing in the URL!");
    alert("Product ID is missing. Please check the URL.");
    return;
  }

  $scope.baseurl = config.baseurl;

  $scope.fetchProductDetails = function(id) {
    var urlconfig = {
      headers: {
        "Content-Type": "application/json"
      }
    };

    $http.get(`${$scope.baseurl}product/products/${id}/`, urlconfig)
      .then(function(response) {
        $scope.product = response.data.product;
      })
      .catch(function(error) {
        console.error("Error fetching product details:", error);
        alert("Failed to fetch product details. Please try again.");
      });
  };

  $scope.fetchProductDetails(product_id);
});
