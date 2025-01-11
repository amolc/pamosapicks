const getProductList = ($scope, $http) => {
  $scope.fetchingProductList = true;
  let url = '';

  if ($scope.urlParams.length == 0) {
    url = `${config.baseurl}product/products/`;
  } else {
    const queryString = jsonToQueryString($scope.urlParams);
    url = `${config.baseurl}product/products?${queryString}`;
  }

  $http.get(
    url
  ).then(function (response) {
      if (response.data.status === 'false') {
          console.error("Error fetching product list:", response.data.message);
      } else {
        $scope.productdataset = response.data.data;
        $scope.num_products = $scope.productdataset.length;
        $scope.num_pages = response.data.num_pages;
        $scope.start_index = response.data.start_index;
        $scope.end_index = response.data.end_index;
        $scope.current_page = response.data.page;
      }
  }).catch(function (error) {
      console.error("Error fetching product list:", error);
  }).finally(() => {
    $scope.fetchingProductList = false;
  });
};

const getCategoryList = ($scope, $http) => {
  $scope.fetchingCategoryList = true;
  
  $http.get(
    `${config.baseurl}category/category/`
  ).then(function (response) {
    if (response.data.status === 'false') {
        console.error("Error fetching category list:", response.data.message);
    } else {
      $scope.categorydataset = response.data;

      if ($scope.urlParams.hasOwnProperty('category_id')) {
        $scope.categorydataset.forEach(category => {
          if (category.id === parseInt($scope.urlParams['category_id'])) {
            $scope.categoryFilter = category.category_name;
          }
        });
      }
    }
  }).catch(function (error) {
    console.error("Error fetching category list:", error);
  }).finally(() => {
    $scope.fetchingCategoryList = false;
  });
}
