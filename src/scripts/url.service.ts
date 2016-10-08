module App {
    class UrlService implements IUrlService {
        static $inject = ['$location'];

        baseApiUrl = 'https://api.vk.com/method/';

        constructor(private $location: ng.ILocationService){}

        formatQueryParams(params){
            if(params){
                var req = '?';
                for(var key in params){
                    req += key + '=' + params[key] + '&';
                }
                return req.substr(0, req.length -  1);
            }
            return null;
        }

        getAuthUrl(params){
            return 'https://oauth.vk.com/authorize' + this.formatQueryParams(params);
        }

        getMethodUrl(method, params){
            return this.baseApiUrl + method + this.formatQueryParams(params);
        }

        getHost(){
            var isLocalhost = this.$location.host() === 'localhost';
            return isLocalhost
                ? this.$location.protocol() + '://'+ this.$location.host() +':'+  this.$location.port()
                : this.$location.protocol() + '://'+ this.$location.host();
        }

    }

    angular.module('app').service('urlService', UrlService);
}