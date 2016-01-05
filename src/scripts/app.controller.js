/**
 * Created by Machete on 01.11.2015.
 */
(function(){
    angular
        .module('app')
        .controller('appController', appController);

    appController['$inject'] = ['$scope', '$location', 'appService'];

    function appController($scope, $location, appService){
        var vm = this;

        vm.isAuthorized = false;

        checkAuth();

        $scope.login = login;

        function getUserInfo(){
            appService.getUserInfo().then(function(res){
                $scope.userInfo = res;
            });
        }

        function isAuthorized(){
            var token = appService.getAccessToken();
            return vm.isAuthorized = token !== null;
        }

        function login(){
            if (!isAuthorized()) {
                var path = $location.path().substr(1);
                if (path) {
                    var params = path.split('&');
                    token = getQueryVariable('access_token', params);
                }
                if (!token) {
                    window.location.href = appService.auth();
                } else {
                    var userId = getQueryVariable('user_id', params);
                    appService.setAccessParams(token, userId);
                    $location.path('/');
                    getUserInfo()
                }
            }
        }

        function getQueryVariable(variable, paramArr)
        {
            for (var i=0; i < paramArr.length ; i++) {
                var pair = paramArr[i].split("=");
                if(pair[0] == variable){return pair[1];}
            }
            return(null);
        }

        function checkAuth() {
            if (!isAuthorized()) {
                var path = $location.path();
                var token;
                if (path) {
                    var params = path.replace('/', '').split('&');
                    token = getQueryVariable('access_token', params);
                }
                if (!token) {
                    window.location.href = appService.auth();
                } else {
                    vm.isAuthorized = true;
                    var userId = getQueryVariable('user_id', params);
                    appService.setAccessParams(token, userId);
                    getUserInfo();
                }
            }else {
                vm.isAuthorized = true;
                getUserInfo();
            }
        }
    }
})(angular, moment);


