app.controller('subscriber-ctrl', function($scope, $http, $window, $location, $sce, $timeout, store, config) {
    
  $scope.data = {}

  $scope.init = function (req, res) {
    console.log(config.baseurl, "....")
    $scope.name = localStorage.getItem("name");
       

    $http.get(config.baseurl + "stockdata/igrobotsubscriberportfolio/" )
    .success(function(res) {
        if (res.status == 'false') {} else {

            $scope.dataset = res.data;
            console.log('dataset: ', $scope.dataset);
        }
    }).error(function(data) {
      debugger
    });

      
      $scope.baseurl=config.baseurl;
      var islogin = localStorage.getItem("islogin");
      console.log("..")

      if (islogin != "1" || isStaff != true) {

        location.href = "index.html";
      } else {

          $scope.customerId = localStorage.getItem("customerId");
    
      }
    };

   
  $scope.close = function(req,res){
    $('.modal').modal("hide")
  }
 

  $scope.deleteid = function(id) {
      console.log("delete idsssss");
      console.log(id);
      $http.delete(config.baseurl + "customer/"  + id)
          .success(function(res) {
              if (res.status == 'false') {} else {
                console.log("......")
                $("#deleteform").modal("hide");

              }
          }).error(function(error_response) {
              console.log(error_response);
          });
      $window.location.reload();
  }

  $scope.editid = function(id,data) {
      console.log("edit id");
      console.log(id);
      $http.patch(config.baseurl + "customer/" + id , data)
          .success(function(res) {
              if (res.status == 'false') {} else {
                $("#editform").modal("hide");

              }
          }).error(function(error_response) {
              console.log(error_response);
          });
  }



  $scope.redirect = function() {
      location.href = '/app/';
  }


   $scope.onedit = function (data) {
      console.log(data);
      $scope.data = data;
      console.log($scope.data);
      $("#editform").modal("show");
    };

    $scope.ondelete = function (data) {
      console.log("delete modal");
      $scope.data = {}
      $scope.data.id = data.id ;
      $scope.data.stock = data.stock 

      $("#deleteform").modal("show");
    };

   



    $scope.startuser = function () {
      
      $scope.data = {}

      console.log($scope.data);
      $("#startuser").modal("show");
    };


    $scope.usersubmit = function(data) {
        data["customerId"] = $scope.customerId ;
      
        data["org_id"] = config.orgId
        console.log(".....", config.orgId)

        $http.post(config.baseurl + "customer/", data)
            .success(function(res) {
                if (res.status == 'false') {
                  console.log("data is not saved")
                } else {
                  $("#startuser").modal("hide");
                  console.log("data is saved.")
                }
            }).error(function() {});
        
    }

    $scope.logout = function (req, res) {
      localStorage.clear();
      location.href = "index.html";
    };


});