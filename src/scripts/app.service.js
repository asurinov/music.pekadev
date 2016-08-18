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
        var audioAccessLevel = 8;

        vm.token = null;
        vm.userId = null;

        vm.auth = auth;
        vm.logout = logout;
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
        vm.getAlbumTracks = getAlbumTracks;
        vm.getRecommendations = getRecommendations;

        vm.createAlbum = createAlbum;

        function createAlbum(name){
            return callApi('audio.addAlbum', { title: name});
        }

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
            }, audioAccessLevel);

            return deferred.promise;
        }

        function logout(){
            var deferred = $q.defer();
            VK.Auth.logout(function(response) {
                if (response) {
                    deferred.resolve();
                } else {
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

        function searchAudio(pattern, byArtist, paging){
            var params = angular.extend(getParamsWithPaging(paging), {
                q: pattern,
                performer_only: byArtist ? 1 : 0,
                auto_complete: 0,
                sort: 2
            });

            return callApi('audio.search', params);
        }

        function getAudioList(paging){
            var params = angular.extend(getParamsWithPaging(paging), {owner_id: getUserId()});
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
            var params = getBaseParam();
            return callApi('audio.getPopular', params);
        }

        function getAlbums(){
            var params = getBaseParam();
            return callApi('audio.getAlbums', params);
        }

        function getAlbumTracks(albumId){
            var params = angular.extend(getBaseParam(), {album_id: albumId});
            return callApi('audio.get', params);
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

        function getRecommendations(param, paging){
            var params = angular.extend(getParamsWithPaging(paging), param);
            return callApi('audio.getRecommendations', params);
        }

        function getParamsWithPaging(paging){
            return angular.extend(getBaseParam(), {
                offset: (paging.currentPage - 1) * paging.itemsPerPage,
                count: paging.itemsPerPage,
            })
        }

        function getBaseParam(){
            return {
                access_token: vm.token,
                v: apiVersion
            };
        }
    }
})();