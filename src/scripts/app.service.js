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
        vm.getUserId = getUserId;
        vm.getAudioList = getAudioList;
        vm.searchAudio = searchAudio;
        vm.getUserInfo = getUserInfo;
        vm.getPopularList = getPopularList;
        vm.getAlbums = getAlbums;

        function setAccessParams(token, userId){
            vm.token = token;
            vm.userId = userId;
        }

        function getAccessToken(){
            return vm.token;
        }

        function getUserId(){
            return vm.userId;
        }

        function auth(){
            var params = {
                client_id: clientId,
                display: 'page',
                redirect_uri: urlService.getHost(),
                scope: 'friends,audio',
                response_type: 'token',
                v: apiVersion
            };

            return urlService.getAuthUrl(params);
        }

        function getUserInfo(userId){
            var params = {
                user_ids: userId || getUserId(),
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

        function getFriendsList(userId){
            var params = {
                user_id: userId || getUserId(),
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

        function searchAudio(pattern, paging){
            var params = {
                q: pattern,
                auto_complete: 1,
                sort: 2,
                offset: (paging.currentPage - 1) * paging.itemsPerPage,
                count: paging.itemsPerPage,
                access_token: vm.token,
                v: apiVersion
            };

            return $http.jsonp(urlService.getMethodUrl('audio.search', params) + '&callback=JSON_CALLBACK')
                .then(function(result) {
                    return result.data.response;
                })
                .catch(function(data) {
                    console.log(data);
                    return [];
                });
        }

        function getAudioList(paging){
            var params = {
                owner_id: getUserId(),
                access_token: vm.token,
                offset: (paging.currentPage - 1) * paging.itemsPerPage,
                count: paging.itemsPerPage,
                v: apiVersion
            };

            return $http.jsonp(urlService.getMethodUrl('audio.get', params) + '&callback=JSON_CALLBACK')
                .then(function(result) {
                    return result.data.response;
                })
                .catch(function(data) {
                    console.log(data);
                    return [];
                });
        }

        function getPopularList(){
            var params = {
                access_token: vm.token,
                v: apiVersion
            };

            return $http.jsonp(urlService.getMethodUrl('audio.getPopular', params) + '&callback=JSON_CALLBACK')
                .then(function(result) {
                    return result.data.response;
                })
                .catch(function(data) {
                    console.log(data);
                    return [];
                });
        }

        function getAlbums(){
            var params = {
                access_token: vm.token,
                v: apiVersion
            };

            return $http.jsonp(urlService.getMethodUrl('audio.getAlbums', params) + '&callback=JSON_CALLBACK')
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