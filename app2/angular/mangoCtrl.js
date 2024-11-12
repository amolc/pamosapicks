app.controller(
  "mangoCtrl",
  function ($scope, $http, $window, $location, $sce, $timeout, store) {
    var baseurl = "http://localhost:9001/shop/";
    // console.log("Mangoose");
    $scope.listmango = function (req, res) {
      $http
        .get(baseurl + "api/item/allItems")
        .success(function (res) {
          // console.log(res[0].item_picture.data[0]);
          if (res.status == "false") {
          } else {
            console.log(res);
            if (res.length) {
              let temp = [];
              res.forEach((e) => {
                if (e) {
                  var imageUrl =
                    "https://www.mango.org/wp-content/uploads/2017/11/tommy-variety.jpg";
                  if (e.item_picture) {
                    var arrayBufferView = new Uint8Array(e.item_picture.data);
                    var blob = new Blob([arrayBufferView], {
                      type: "image/jpeg",
                    });
                    var urlCreator = window.URL || window.webkitURL;
                    imageUrl = urlCreator.createObjectURL(blob);
                  }
                  temp.push({ ...e, item_picture: imageUrl });
                }
              });
              $scope.mangoes = temp;
            }
          }
        })
        .error(function () {});
    };

    $scope.mangoFind = function (id, mango) {
      var org_0id = id;
      localStorage.setItem("org_id", JSON.stringify(org_0id));
      $scope.mangoes.map((eachObj, index) => {
        if (eachObj.org_id == id) {
          // console.log(eachObj.item_price);
          let data = eachObj;
          // console.log(data.item_price);
          let product_price = document.getElementById("product-price");
          // console.log(product_price);
          let product_description = document.getElementById(
            "product_description"
          );
          console.log(mango);
          $scope.selected = mango;
          product_price.innerText = data.item_price;
          product_description.innerHTML = data.item_description;
        }
      });
    };
    $scope.handleCart = function (event) {
      console.log(event);
    };
    $scope.addtoCart = function () {
      let id = JSON.parse(localStorage.getItem("org_id"));
      console.log(localStorage.getItem("cid"));

      localStorage.setItem("toShowId", JSON.stringify(id));
      $http
        .post(
          baseurl + "api/cart/addToCart",
          JSON.stringify({ productID: id, cartID: localStorage.getItem("cid") })
        )
        .success(function (res) {
          if (res.status == "false") {
            // console.log(1346);
          } else {
            id = [res.cartID];
            localStorage.setItem("cid", res.cartID);

            console.log(res);
            console.log(id);
            window.location.assign("./cart.html")


          }
        })
        .error(function () {});
    };

    $scope.cart = function () {
      window.location.assign("./cart.html");
    };

    $scope.saveDataToShowDetails = function (id) {
      const data = $scope.mangoes[id - 1];

      localStorage.setItem("descriptionDetails", JSON.stringify(data));

      console.log(data);
    };
  }
);
