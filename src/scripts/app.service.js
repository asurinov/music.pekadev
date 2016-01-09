/**
 * Created by Machete on 01.11.2015.
 */
(function(){
    angular.module('app').service('appService', appService);

    appService['$inject'] = ['$http', '$q', 'urlService'];

    function appService($http, $q, urlService) {
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
        vm.getAudioById = getAudioById;
        vm.getTrackLink = getTrackLink;

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
            var deferred = $q.defer();

            VK.Auth.login(function(response) {
                if (response.session) {
                    /* Пользователь успешно авторизовался */
                    deferred.resolve();
                    if (response.settings) {
                        /* Выбранные настройки доступа пользователя, если они были запрошены */
                    }
                } else {
                    /* Пользователь нажал кнопку Отмена в окне авторизации */
                    deferred.reject();
                }
            });

            return deferred.promise;
        }

        function getUserInfo(userId){
            var params = {
                user_ids: userId || getUserId(),
                fields: 'first_name,last_name,photo_50',
                v: apiVersion
            };

            return callApi('users.get', params);
        }

        function getFriendsList(userId){
            var params = {
                user_id: userId || getUserId(),
                fields: 'first_name,last_name',
                v: apiVersion
            };

            return callApi('friends.get', params);
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

            return callApi('audio.search', params);
        }

        function getAudioList(paging){
            var params = {
                owner_id: getUserId(),
                access_token: vm.token,
                offset: (paging.currentPage - 1) * paging.itemsPerPage,
                count: paging.itemsPerPage,
                v: apiVersion
            };

            return callApi('audio.get', params);
        }

        function getAudioById(id){
            var params = {
                audios: id,
                v: apiVersion
            };

            return callApi('audio.getById', params);
        }

        function getPopularList(){
            var params = {
                access_token: vm.token,
                v: apiVersion
            };

            return callApi('audio.getPopular', params);
        }

        function getAlbums(){
            var params = {
                access_token: vm.token,
                v: apiVersion
            };

            return callApi('audio.getAlbums', params);
        }

        function callApi(method, params){
            var deferred = $q.defer();

            VK.Api.call(method, params, function(r) {
                if(r.response) {
                    deferred.resolve(r.response);
                } else {
                    deferred.reject();
                }
            });
            return deferred.promise;
        }

        function getTrackLink(record){
            return urlService.getHost() + '/track/' + record.owner_id + '_' + record.id;
        }
    }
})();