/**
 * Created by Machete on 01.11.2015.
 */
(function(){
    angular
        .module('app')
        .config(['$locationProvider', '$httpProvider', function ($locationProvider,$httpProvider) {
            $locationProvider.html5Mode(true);
            $httpProvider.defaults.useXDomain = true;
            delete $httpProvider.defaults.headers.common['X-Requested-With'];
        }]);
})();