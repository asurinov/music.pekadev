/**
 * Created by Machete on 01.11.2015.
 */
(function(){
    angular.module('app').service('urlService', urlService);

    urlService['$inject'] = ['$location']

    function urlService($location) {
        var vm = this;

        vm.baseApiUrl = 'https://api.vk.com/method/';

        vm.getAuthUrl = getAuthUrl;
        vm.getMethodUrl = getMethodUrl;
        vm.getHost = getHost;

        function formatQueryParams(params){
            if(params){
                var req = '?';
                for(var key in params){
                    req += key + '=' + params[key] + '&';
                }
                return req.substr(0, req.length -  1);
            }
            return null;
        }

        function getAuthUrl(params){
            return 'https://oauth.vk.com/authorize' + formatQueryParams(params);
        }

        function getMethodUrl(method, params){
           return vm.baseApiUrl + method + formatQueryParams(params);
        }

        function getHost(){
            var isLocalhost = $location.host() === 'localhost';
            return isLocalhost
                ? $location.protocol() + '://'+ $location.host() +':'+  $location.port()
                : $location.protocol() + '://'+ $location.host();
        }
    }
})();