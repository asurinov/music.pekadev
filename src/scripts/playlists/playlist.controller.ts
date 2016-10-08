module App {

    interface IStateParams extends ng.ui.IStateParamsService{
        listId: string;
    }

    class PlaylistController {
        static $inject = ['$scope', '$state', '$stateParams', 'appService', '$uibModal'];

        constructor(
            private $scope,
            private $state: ng.ui.IStateService,
            private $stateParams: IStateParams,
            private appService: IAppService,
            private $modal
        ){
            switch($state.current.name){
                case 'playlists.element':
                    this.getAlbumTracks($stateParams.listId);
                    break;
                case 'playlists.new':
                    this.createAlbum().finally(() => {
                        this.$state.go('playlists');
                    });
                    break;
                default:
                    this.getAlbums();
                    break;
            }
        }

        createAlbum(){
            return this.$modal.open({
                templateUrl: '/partials/playlists/create-album.modal.view.html',
                controller: 'CreateAlbumCtrl',
                controllerAs: 'ac'
            }).result.then((data) => {
                return this.appService.createAlbum(data).then((res) => {
                    this.$scope.albums.push({id: res.album_id, title: data});
                });
            });
        }

        getAlbums(){
            return this.appService.getAlbums().then((res) => {
                this.$scope.albums = res.items;
            });
        }

         getAlbumTracks(albumId){
            return this.appService.getAlbumTracks(albumId).then((res) => {
                this.$scope.audios = res.items;
            });
        }
    }

    angular.module('app').controller('playlistController', PlaylistController);
}