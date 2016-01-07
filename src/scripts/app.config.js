/**
 * Created by Machete on 01.11.2015.
 */
(function(){
    angular
        .module('app')
        .config(['$locationProvider', '$httpProvider', '$routeProvider', function ($locationProvider,$httpProvider, $routeProvider) {
            $locationProvider.html5Mode(true);
            $httpProvider.defaults.useXDomain = true;
            delete $httpProvider.defaults.headers.common['X-Requested-With'];

            VK.init({
                apiId: 5130198
            });

            VK.UI.button('vk-auth');

            $routeProvider
                .when('/', {
                    templateUrl: '/partials/tracks.view.html',
                    controller: 'tracksController',
                    controllerAs: 'trc'
                })
                .when('/playlists', {
                    templateUrl: '/partials/playlists.view.html',
                    controller: 'playlistController'
                })
                .when('/playlist/:listId', {
                    templateUrl: '/partials/playlist.view.html',
                    controller: 'playlistController'
                })
                .otherwise({
                    redirectTo: '/'
                });
        }]);
})();