const getRegisteringUser = () => {
    const registeringUser = JSON.parse(
        localStorage.getItem("registeringUser")
    );
    return registeringUser;
}

const clearRegisteringUser = () => {
    return localStorage.removeItem("registeringUser");
}

const getSignInUser = () => {
    const signInUser = JSON.parse(
        localStorage.getItem('signInUser')
    );

    return signInUser;
}

const clearSignInUser = () => {
    localStorage.clearItem('signInUser');
};

app.controller(
    "authCtrl",
    ($scope, $http, $window, $location, config) => {
    $scope.init = () => {
        $scope.registeringUser = getRegisteringUser();
        $scope.signInUser = getSignInUser();
    };

    $scope.login = () => {
        const url = `${config.baseurl}users/login`;

        $http.post(
            url,
            $scope.signInUser
        ).then(response => {
            if(response.status == "success") {
                $scope.user = response.data.data;
            } else if (response.status == "error") {
                console.error("response.message");
            }
        }).error(error => {
            
        });
    };

    $scope.register = () => {

    };
});
