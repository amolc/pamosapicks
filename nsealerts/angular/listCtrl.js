app.controller(
  "listCtrl",
  function ($scope, $http, $window, $location, $sce, $timeout, store) {
    var baseurl = "http://localhost:9001/shop/";
    $scope.listAdd = function(){
      window.location.assign("list-add.html")
      // console.log(123456);
    }

    $scope.list = function (req, res) {
      // console.log(123465);
      //   const data = JSON.parse(localStorage.getItem("itemDetails"));

      //   console.log(data);
      //   $scope.list = data;
      //   console.log($scope.list.item_name);
      // };
      // $scope.listPage = function(){
      //   window.location.assign("list.html")
      //   console.log("11223")
      // }

      $http
        .get(baseurl + "api/item/allItems")
        .success(function (res) {
          // console.log(res[0].item_picture.data[0]);
          if (res.status == "false") {
          } else {
            $scope.mangoes = res;
            var data = $scope.mangoes;
            console.log($scope.mangoes[1].org_id);

            $scope.addMango = function (id) {
              $scope.mangoes = res;
              var data = $scope.mangoes;
              console.log($scope.mangoes[1].org_id);

              for (let i = 0; i < data.length; i++) {
                if (data[i].org_id === id) {
                  console.log(data[i]);
                  let mangoData = data[i];
                  console.log(mangoData);

                  break;
                }
              }
            };
          }
        })
        .error(function () {});
    };
   $scope.adjustInput = function(e){
     console.log(e)
   }
    $scope.ItemData = function () {
      const d = $scope;
      console.log($scope.data)

      var formData = {
        item_name:  $scope.data.item_name,
        item_description: $scope.data.item_description,
        item_price:$scope.data.item_price,
        item_stock: $scope.data.item_stock,
        item_longtext: $scope.data.item_longtext,
        item_size: $scope.data.item_size,
        item_quantity: $scope.data.item_quantity,
        item_photo: $scope.data.item_photo,
        item_title: $scope.data.item_title,
        item_color: $scope.data.item_color,
      };
        console.log($scope.data);
  
        $http
          .post(baseurl + "/api/additem", formData)
          .success(function (res) {
            $scope.response = res;
            console.log(res);
            if (res.status == "false") {
              alert(res.message);
            } else {
              alert("org save Successfully");
              $window.location = "list.html";
            }
          })
          .error(function () {
            // var msg = res;
            // console.log(res);
            // alert(res);
          });
    };

}
);
