const getProductList = async (config, urlParams, $http) => {
  let url = '';

  if (urlParams.length == 0) {
    url = `${config.baseurl}product/products/`;
  } else {
    const queryString = jsonToQueryString(urlParams);
    url = `${config.baseurl}product/products?${queryString}`;
  }

  const response = await $http.get(
    url
  )
  
  if (response.data.status === 'false') {
      console.error("Error fetching product list:", response.data.message);
  } else {
    return {
      productdataset: response.data.data,
      num_products: response.data.data.length,
      num_pages: response.data.num_pages,
      start_index: response.data.start_index,
      end_index: response.data.end_index,
      current_page: response.data.current_page,
    }
  }
};

const getCategoryList = async (config, urlParams, $http) => {
  const response = await $http.get(
    `${config.baseurl}category/category/`
  );

  if (response.data.status === 'false') {
    console.error("Error fetching category list:", response.data.message);
  } else {
    return {
      categorydataset: response.data
    };
  }
}
