
app.controller('bookingCtrl', function($scope, $http, $window, $location, $sce, $timeout, store, config) {
    $scope.data = {}
    $scope.init =function(req,res){
        // alert("hello");
        $scope.list();
    }


    $scope.list = function(req, res) {
        console.log(config.baseurl);
        
        $http.get(config.baseurl + 'booking/get-bookings/')
            .success(function(res) {
                if (res.status == 'false') {} else {
                    $scope.dataset = res.data;
                    console.log('dataset: ', $scope.dataset);
                }
            }).error(function() {});
    }


    $scope.add = function(req, res) {
        console.log($scope.data);
        console.log(config.baseurl + 'booking/create-booking/');
        
        $http.post(config.baseurl + 'booking/create-booking/', $scope.data)
            .success(function(res) {

                if (res.status == 'false') {} else {
                    $scope.response = res.data;
                    console.log('message: ', $scope.response);
                    // window.location.reload();
                }
            }).error(function() {});
        

    }


    $scope.update = function(id) {
        console.log(config.baseurl + 'booking/update-booking/' + id);
        $http.patch(config.baseurl + 'booking/update-booking/' + id + '/', $scope.data)
            .success(function(res) {
                if (res.status == 'false') {} else {
                    $scope.data = res.data;
                    console.log('data: ', $scope.data);
                  
                }
            }).error(function() {});
    }

   

    $scope.delete = function(id) {
        $http.delete(config.baseurl + 'booking/delete-booking/' + id + '/')
            .success(function(res) {
                if (res.status == 'false') {} else {
                    $scope.list();

                }
            }).error(function(error_response) {
                console.log(error_response);
            });
        $window.location.reload();
    }



    $scope.redirect = function() {
        //console.log("redirect");
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
        $scope.data = data ;
        $("#deleteform").modal("show");
      };

      $scope.addform = function () {
        $scope.data = {}
        $("#addform").modal("show");
      };

      $scope.editform = function () {
        $scope.data = {}
        $("#editform").modal("show");
      };


      $scope.onsubmit  = function (data) {
        
        $scope.data = data
        console.log($scope.data);
        $scope.add( $scope.data);
        $("#addform").modal("hide");
      };
  
      $scope.oneditsubmit  = function (data) {
        console.log("onedit");
        
        $scope.data = data
        console.log($scope.data.id);
        $scope.update( $scope.data.id);
        $("#editform").modal("hide");
      };
  
      //orderCtrl ends
    



    //orderCtrl ends
});
