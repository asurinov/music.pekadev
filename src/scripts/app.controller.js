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
        vm.userInfo = {};

        init();

        vm.login = login;
        vm.logout = logout;


        function login(){
            appService.auth().then(function(){
                vm.isAuthorized = true;
                getUserInfo();
            });
        }

        function logout(){
            appService.logout().then(function(){
                vm.isAuthorized = false;
                vm.userInfo = null;
            });
        }

        function getUserInfo(){
            appService.getUserInfo().then(function(res){
                vm.userInfo = res[0];
            });
        }

        function init() {
            appService.getLoginStatus().then(function(){
                vm.isAuthorized = true;
                getUserInfo();
            });
        }
    }
})(angular, moment);


