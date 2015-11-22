/**
 * Created by Machete on 01.11.2015.
 */
(function(){
    angular.module('app').service('appService', appService);

    appService['$inject'] = ['$http', 'urlService'];

    function appService($http, urlService) {
        var vm = this;

        var clientId = 5130198;
        var apiVersion = '5.37';

        vm.token = null;
        vm.userId = null;

        vm.auth = auth;
        vm.getFriendsList = getFriendsList;
        vm.setAccessParams = setAccessParams;
        vm.getAccessToken = getAccessToken;
        vm.getAudioList = getAudioList;
        vm.searchAudio = searchAudio;
        vm.getUserInfo = getUserInfo;

        function setAccessParams(token, userId){
            vm.token = token;
            vm.userId = userId;
        }

        function getAccessToken(){
            return vm.token;
        }

        function auth(){
            var params = {
                client_id: clientId,
                display: 'page',
                redirect_uri: 'http://music.pekadev.ru',
                scope: 'friends,audio',
                response_type: 'token',
                v: apiVersion
            };

            return urlService.getAuthUrl(params);
        }

        function getUserInfo(userId){
            var params = {
                user_ids: userId || vm.userId,
                fields: 'first_name,last_name,photo_50',
                v: apiVersion
            };

            return $http.jsonp(urlService.getMethodUrl('users.get', params) + '&callback=JSON_CALLBACK')
                .then(function(result) {
                    return result.data.response[0];
                })
                .catch(function(data) {
                    console.log(data);
                    return [];
                });
        }

        function getFriendsList(){
            var params = {
                user_id: vm.userId,
                fields: 'first_name,last_name',
                v: apiVersion
            };

            return $http.jsonp(urlService.getMethodUrl('friends.get', params) + '&callback=JSON_CALLBACK')
                .then(function(result) {
                    return result.data.response.items;
                })
                .catch(function(data) {
                    console.log(data);
                    return [];
                });
        }

        function searchAudio(pattern){
            var params = {
                q: pattern,
                auto_complete: 1,
                sort: 2,
                access_token: vm.token,
                v: apiVersion
            };

            return $http.jsonp(urlService.getMethodUrl('audio.search', params) + '&callback=JSON_CALLBACK')
                .then(function(result) {
                    return result.data.response.items;
                })
                .catch(function(data) {
                    console.log(data);
                    return [];
                });
        }

        function getAudioList(){
            var params = {
                owner_id: vm.userId,
                access_token: vm.token,
                v: apiVersion
            };

            return $http.jsonp(urlService.getMethodUrl('audio.get', params) + '&callback=JSON_CALLBACK')
                .then(function(result) {
                    return result.data.response.items;
                })
                .catch(function(data) {
                    console.log(data);
                    return [];
                });
        }
    }
})();