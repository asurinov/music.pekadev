module App {

    import ILocalStorageServiceProvider = angular.local.storage.ILocalStorageServiceProvider;
    class AppConfig {
        static $inject = ['$locationProvider', '$httpProvider', '$stateProvider', '$urlRouterProvider', 'localStorageServiceProvider'];

        constructor(
            $locationProvider: ng.ILocationProvider,
            $httpProvider: ng.IHttpProvider,
            $stateProvider: ng.ui.IStateProvider,
            $urlRouterProvider: ng.ui.IUrlRouterProvider,
            localStorageServiceProvider: ILocalStorageServiceProvider
        ){
            $locationProvider.html5Mode(true);
            localStorageServiceProvider.setPrefix('peka');

            delete $httpProvider.defaults.headers.common['X-Requested-With'];

            // For any unmatched url, redirect to /state1
            $urlRouterProvider.otherwise("/");

            $stateProvider
                .state('main', {
                    url: "/",
                    templateUrl: "/partials/main.view.html",
                    controller: 'tracksController',
                    controllerAs: 'trc'
                })
                .state('recommended', {
                    url: "/recommended/:page",
                    templateUrl: "/partials/main.view.html",
                    controller: 'tracksController',
                    controllerAs: 'trc'
                })
                .state('popular', {
                    url: "/popular",
                    templateUrl: "/partials/main.view.html",
                    controller: 'tracksController',
                    controllerAs: 'trc'
                })
                .state('mytracks', {
                    url: "/mytracks/:page",
                    templateUrl: "/partials/main.view.html",
                    controller: 'tracksController',
                    controllerAs: 'trc'
                })
                .state('search', {
                    url: "/search?query&artist&page",
                    templateUrl: "/partials/main.view.html",
                    controller: 'tracksController',
                    controllerAs: 'trc'
                })
                .state('playlists', {
                    url: "/playlists",
                    templateUrl: "/partials/playlists.view.html",
                    controller: 'playlistController',
                    controllerAs: 'pc'
                })
                .state('playlists.new', {
                    url: "/new",
                    templateUrl: '/partials/playlist.view.html',
                    controller: 'playlistController'
                })
                .state('playlists.element', {
                    url: "/{listId}",
                    templateUrl: '/partials/playlist.view.html',
                    controller: 'playlistController'
                })
                .state('track', {
                    url: "/track/:trackId",
                    templateUrl: '/partials/playlist.view.html',
                    controller: 'tracksController',
                    controllerAs: 'trc'
                });
        }
    }

    class AppRun {

        static $inject = ['$rootScope', 'VK', 'VK_CLIENT_ID'];

        constructor($rootScope, VK, VK_CLIENT_ID){
            $rootScope.$on('$stateChangeSuccess', function(event, toState){
                $rootScope.currentState = toState.name;
            });

            VK.init({apiId: VK_CLIENT_ID});
        }
    }

    angular.module('app').config(AppConfig);
    angular.module('app').run(AppRun);
}
