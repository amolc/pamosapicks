
app.controller(
  "alpacaportfolioedit",
  function ($scope, $http, $window, $location, config) {
    $scope.baseurl = config.baseurl;
    console.log(config);

    $scope.init = function (req, res) {
      console.log("smartPortfolio");
      console.log(config.baseurl);
      

      $scope.portfolioList();
    };
    
    $scope.name = localStorage.getItem("name");

    

    $scope.portfolioList = function (req, res) {
      data = {}
      
      data['customerId'] = localStorage.getItem("customerId");
      

      $http
        .post($scope.baseurl + "stockdata/alpacaportfolio",data)
        .success(function (res) {
          if (res.status == "false") {
          } else {
            
            $scope.mangoes = res;
            
            custID = localStorage.getItem("custID");
            PortID = localStorage.getItem("PortID");

            for(var i=0;i<$scope.mangoes.data.length;i++){
             
              if($scope.mangoes.data[i].portfolioId==PortID){
                console.log(PortID,"...Portfolio ID..")
                $scope.dataset = $scope.mangoes.data[i]
                
                localStorage.setItem("portfolio_name",$scope.dataset['portfolio_name'] );
                }
            }
          }
        })
        .error(function (data, status, header, config) {
          
           console.log(data);
           
         });
    };

   
    $scope.logout = function (req, res) {
      localStorage.clear();
      location.href = "index.html";
    };

    $scope.onedit = function (custID,PortID) {
      localStorage.setItem("custID",custID );
      localStorage.setItem("PortID",PortID );
      location.href = "index.html";
    };
    $scope.previous = function (req, res) {
      location.href = "/app/alpaca-portfolio.html";
    };


    $scope.confirm = function (data) {
      
      var config = {
        headers: {
          "Content-Type": "application/json;"
        },
      };
      data['portfolio_name'] = localStorage.getItem("portfolio_name");

  
      $http
        .patch($scope.baseurl + "stockdata/alpacaportfolio",data)
        .success(function (data, status, headers, config) {
          console.log(data);
          $scope.data = data;
          console.log($scope.data);
          location.href = "/app/alpaca-portfolio.html";
  
        })
        .error(function (data, status, header, config) {
          console.log(data);
        });
  
    }

  }
);
