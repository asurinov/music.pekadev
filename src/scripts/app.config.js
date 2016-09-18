/**
 * Created by Machete on 01.11.2015.
 */
(function(){
    angular
        .module('app')
        .config(['$locationProvider', '$httpProvider', '$stateProvider', '$urlRouterProvider', function ($locationProvider,$httpProvider, $stateProvider, $urlRouterProvider) {
            $locationProvider.html5Mode(true);
            $httpProvider.defaults.useXDomain = true;
            delete $httpProvider.defaults.headers.common['X-Requested-With'];

            VK.init({
                apiId: 5130198
            });

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
        }]);

    angular.module('app').run(['$rootScope', function($rootScope){
        $rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){
            $rootScope.currentState = toState.name;
        });
    }]);
})();