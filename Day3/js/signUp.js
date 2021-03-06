VideoPlayerApp.controller('signupController', function($scope, $http, $timeout, $location) {
    /*Open modal when signup*/
    if (localStorage.getItem('token') !== null) {
       $location.path('/alertSignUp');
    }
    $scope.alertSuccess = false;
    $scope.alertError = false;
    $scope.genders = [
        {'value': '1', 'label': 'Nam'},
        {'value': '0', 'label': 'Nữ'},
        {'value': '2', 'label': 'Khác'}
    ];
    /*Data to signin*/
    $scope.signinData = {
        "data": {
            "type": "MemberLogin",
            "attributes": {
                "username": "",
                "password": ""
            }
        }
    };
    /*Data to signup*/
    $scope.userSignupData = {
        "data": {
            "type": "Member",
            "attributes": {
                "username":"",
                "email":"",
                "gender": "2",
                "birthDay": "",
                "fullName": "",
                "avatar": "",
                "password": ""
            }
        }
    };

    $scope.signup = function () {
        $scope.signinData.data.attributes.username = $scope.userSignupData.data.attributes.username;
        $scope.signinData.data.attributes.password = $scope.userSignupData.data.attributes.password;
        $timeout(function () {
            $http({
                method: 'POST',
                url: membersApi,
                data: $scope.userSignupData
            }).then(function successCallback(response) {
                $scope.alertSuccess = true;
                $scope.alertError = false;
                $http({
                    method: 'POST',
                    url: authenticationApi,
                    data: $scope.signinData
                }).then(function successCallback(response) {
                    localStorage.setItem('username', response.config.data.data.attributes.username);
                    localStorage.setItem('token', response.data.data.attributes.secretToken);
                    var signinTime = new Date(response.data.data.attributes.createdTimeMLS).toLocaleDateString();
                    var expireTime = new Date(response.data.data.attributes.expiredTimeMLS).toLocaleDateString();
                    localStorage.setItem('signinTime', signinTime);
                    localStorage.setItem('expireTime', expireTime);
                    $timeout(function () {
                        window.location.href = "index.html";
                    }, 2000);
                }, function errorCallback(response) {
                    alert('Tài khoản đăng nhập thất bại, vui lòng đăng nhập lại!');
                });


            }, function errorCallback(response) {
                $scope.alertError = true;
                $scope.responseDetail = response.data.errors[0].detail;
            });
        }, 500);


    };

    $scope.resetForm = function (formModel) {
        angular.copy({}, formModel);
    }

});