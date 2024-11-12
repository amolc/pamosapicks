app.controller(
  "orgCtrl",
  function ($scope, $http, $window, $location, $sce, $timeout, store) {
    var baseurl = "https://api.superadmin.shop/api/";

$scope.listPage = function(){
  window.location.assign("list.html")
  // console.log(123456);
}



    $(document).ready(function () {
      if (window.location.pathname === "/admin/org-add.html") {
        let s = new URL(window.location.href);
        if (s.searchParams.get("id")) {
          const data = JSON.parse(localStorage.getItem("data"));
          $("#name").val(data[0].org_name).trigger("change");
          $("#address").val(data[0].org_address).trigger("change");
          $("#telephoneNumber").val(data[0].org_telephone).trigger("change");
          $("#zip").val(data[0].org_zip).trigger("change");
          $("#email").val(data[0].org_email).trigger("change");
          $("#password").val(data[0].org_password).trigger("change");
        }
      }
    });
    $scope.givealert = function (req, res) {
      alert("I am alert");
    };

    $scope.listorg = function (req, res) {
      $http
        .get(baseurl + "org/")

        .success(function (res) {
          if (res.status == "false") {
          } else {
            $scope.organisations = res.data;
            console.log("org: ", $scope.organisations);
          }
        })
        .error(function () {});
    };

    $scope.redirect = function () {
      //console.log("redirect");
      location.href = "index.html";
    };

    $scope.orgadd = function () {
      console.log("hello");
      $scope.formvalidate = "true";
      console.log("New Cars");
      console.log($scope.data);

      $http
        .post(baseurl + "org/", $scope.data)
        .success(function (res) {
          $scope.response = res;
          console.log(res);
          if (res.status == "false") {
            alert(res.message);
          } else {
            alert("org save Successfully");
            $window.location = "org.html";
          }
        })
        .error(function () {
          // var msg = res;
          // console.log(res);
          // alert(res);
        });
    };

    //orderCtrl ends

    $scope.orgdelete = function (id) {
      console.log(id);
      $scope.formvalidate = "true";
      console.log("New delete");
      console.log($scope.data);
      $http.delete(baseurl + "org/" + id, $scope.data).success(function (res) {
        $scope.response = res;
        console.log(res);
        if (res.status == "false") {
          alert(res.message);
        } else {
          alert("org save Successfully deleted");
          location.reload();
          //   $window.location = "org.html";
        }
      });
    };

    $scope.orgedit = function (id) {
      // console.log(id)
      $scope.formvalidate = "true";
      console.log("New Cars", $scope.organisations);
      const data = $scope.organisations.filter((e) => e.id === id);
      console.log(data);
      $http.patch(baseurl + "org/" + id, $scope.data).success(function (res) {
        localStorage.setItem("data", JSON.stringify(data));
        $window.location = `org-add.html?id=${id}`;
      });
    };

    $scope.ngOnInit = () => {};
  }
);
