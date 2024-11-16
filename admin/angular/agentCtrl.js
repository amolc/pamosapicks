
app.controller('agentCtrl', function($scope, $http, $window, $location, $sce, $timeout, store, config) {
    $scope.data = {}
    $scope.init =function(req,res){
        // alert("hello");
        $scope.list();
    }


    $scope.list = function(req, res) {
        console.log(config.baseurl);
        
        $http.get(config.baseurl + 'agent/get-agent/')
            .success(function(res) {
                if (res.status == 'false') {} else {
                    $scope.dataset = res.data;
                    console.log('dataset: ', $scope.dataset);
                }
            }).error(function() {});
    }


    $scope.add = function(req, res) {
        console.log($scope.data);
        console.log(config.baseurl + 'agent/create-agent/');
        
        $http.post(config.baseurl + 'agent/create-agent/', $scope.data)
            .success(function(res) {

                if (res.status == 'false') {} else {
                    $scope.response = res.data;
                    console.log('message: ', $scope.response);
                    // window.location.reload();
                }
            }).error(function() {});
        

    }


    $scope.update = function(id) {
        console.log(config.baseurl + 'agent/update-agent/' + id);
        $http.patch(config.baseurl + 'agent/update-agent/' + id + '/', $scope.data)
            .success(function(res) {
                if (res.status == 'false') {} else {
                    $scope.data = res.data;
                    console.log('data: ', $scope.data);
                  
                }
            }).error(function() {});
    }

   

    $scope.delete = function(id) {
        $http.delete(config.baseurl + 'agent/delete-agent/' + id + '/')
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
