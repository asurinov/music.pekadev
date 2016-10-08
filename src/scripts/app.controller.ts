module App {
    class AppController {

        static $inject = ['appService'];

        isAuthorized = false;
        userInfo = {};

        constructor(
          private appService: IAppService
        ){
            appService.getLoginStatus().then(() => {
                this.isAuthorized = true;
                this.getUserInfo();
            });
        }

        login(){
            this.appService.auth().then(() => {
                this.isAuthorized = true;
                this.getUserInfo();
            });
        }

        logout(){
            this.appService.logout().then(() => {
                this.isAuthorized = false;
                this.userInfo = null;
            });
        }

        getUserInfo(){
            this.appService.getUserInfo().then((res) => {
                this.userInfo = res[0];
            });
        }
    }

    angular.module('app').controller('appController', AppController);
}