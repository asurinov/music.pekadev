module App {

    class AppService implements IAppService {
        static $inject = ['$q', 'urlService', 'VK', 'VK_API_VERSION'];

        clientId = 5130198;
        audioAccessLevel = 8;
        userId = null;

        token: string;
        expire: number;

        constructor(
            private $q: ng.IQService,
            private urlService: IUrlService,
            private VK,
            private VK_API_VERSION: string
        ){}

        createAlbum(name: string){
            return this.callApi('audio.addAlbum', { title: name});
        }

        setAccessParams(session){
            this.userId = session.mid;
            this.expire = session.expire;
        }

        getAccessToken(){
            return this.token;
        }

        getUserId(){
            return this.userId;
        }

        auth(){
            var deferred = this.$q.defer();

            this.VK.Auth.login((response) => {
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
            }, this.audioAccessLevel);

            return deferred.promise;
        }

        logout(){
            var deferred = this.$q.defer();
            this.VK.Auth.logout((response) => {
                if (response) {
                    deferred.resolve();
                } else {
                    deferred.reject();
                }
            });
            return deferred.promise;
        }

        getUserInfo(userId?: number){
            var params = {
                user_ids: userId || this.getUserId(),
                fields: 'first_name,last_name,photo_50',
                v: this.VK_API_VERSION
            };

            return this.callApi('users.get', params);
        }

        getFriendsList(userId){
            var params = {
                user_id: userId || this.getUserId(),
                fields: 'first_name,last_name',
                v: this.VK_API_VERSION
            };

            return this.callApi('friends.get', params);
        }

        searchAudio(pattern, byArtist, paging){
            var params = angular.extend(this.getParamsWithPaging(paging), {
                q: pattern,
                performer_only: byArtist ? 1 : 0,
                auto_complete: 0,
                sort: 2
            });

            return this.callApi('audio.search', params);
        }

        getAudioList(paging){
            var params = angular.extend(this.getParamsWithPaging(paging), {owner_id: this.getUserId()});
            return this.callApi('audio.get', params);
        }

        getAudioById(id){
            var params = {
                audios: id,
                v: this.VK_API_VERSION
            };

            return this.callApi('audio.getById', params);
        }

        getPopularList(paging){
            var params = this.getParamsWithPaging(paging);
            return this.callApi('audio.getPopular', params);
        }

        getAlbums(){
            var params = this.getBaseParam();
            return this.callApi('audio.getAlbums', params);
        }

        getAlbumTracks(albumId){
            var params = angular.extend(this.getBaseParam(), {album_id: albumId});
            return this.callApi('audio.get', params);
        }

        private callApi(method, params){
            var promise = this.$q.when(this.isSessionExpires() ? this.getLoginStatus() : true);

            return promise.then(() => {
                var deferred = this.$q.defer();

                this.VK.Api.call(method, params, (r) => {
                    if(r.response) {
                        deferred.resolve(r.response);
                    } else {
                        deferred.reject();
                    }
                });
                return deferred.promise;
            });
        }

        getTrackLink(record){
            return this.urlService.getHost() + '/track/' + record.owner_id + '_' + record.id;
        }

        getRecommendations(param, paging){
            var params = angular.extend(this.getParamsWithPaging(paging), param);
            return this.callApi('audio.getRecommendations', params);
        }

        private getParamsWithPaging(paging){
            return angular.extend(this.getBaseParam(), {
                offset: (paging.currentPage - 1) * paging.itemsPerPage,
                count: paging.itemsPerPage,
            })
        }

        private getBaseParam(){
            return {
                v: this.VK_API_VERSION
            };
        }

        private isSessionExpires(){
            return this.expire < new Date().getTime() / 1000;
        }

        getLoginStatus(){
            return this.$q((resolve, reject) => {
                this.VK.Auth.getLoginStatus((res) => {
                    if (res.session) {
                        this.setAccessParams(res.session);
                        resolve();
                    } else {
                        reject();
                    }
                });
            });
        }

    }

    angular.module('app').service('appService', AppService);
}