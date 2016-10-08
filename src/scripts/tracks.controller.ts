module App {

    interface IStateParams extends ng.ui.IStateService {
        trackId: string;
        page: string;
        query: string;
        artist: string;
    }

    class TracksController {
        static $inject = ['$scope', '$rootScope', 'appService', 'stringService', '$state', '$stateParams'];

        itemsPerPage = 50;

        trackType = {
            myTracks: 'mytracks',
            popular: 'popular',
            search: 'search',
            recommendationByUser: 'recommendationByUser',
            recommendationByTrack: 'recommendationByUser'
        };

        paging;

        pattern: string;
        dataType = null;
        byArtist = false;

        constructor(
            private $scope,
            private $rootScope: IRootScope,
            private appService: IAppService,
            private stringService: IStringService,
            private $state: ng.ui.IStateService,
            private $stateParams: IStateParams
        ){
            this.paging = {
                itemsPerPage: this.itemsPerPage,
                totalItems: 0,
                totalPages: 0,
                currentPage: 1,
                maxSize: 10
            };

            $scope.goToAudioSearch = (val) => { this.goToAudioSearch(val); };
            $scope.onPageChanged = () => { this.onPageChanged(); };

            $scope.goToMyTracks = () => { this.goToMyTracks(); };
            $scope.goToPopular =() => { this.goToPopular(); };
            $scope.goToRecommended = () => { this.goToRecommended(); };

            $scope.$on('searchByArtist', (event, data) => {
                this.pattern = data;
                this.byArtist = true;
                this.goToAudioSearch(true);
            });

            $scope.$watch('currentState', (newVal) => {
                switch(newVal){
                    case 'recommended':
                        this.dataType = this.trackType.recommendationByUser;
                        this.paging.currentPage = parseInt(this.$stateParams.page, 10) || 1;
                        this.getRecommendationsByUser();
                        break;
                    case 'popular':
                        this.dataType = this.trackType.myTracks;
                        this.getPopularList();
                        break;
                    case 'mytracks':
                        this.dataType = this.trackType.popular;
                        this.paging.currentPage = parseInt(this.$stateParams.page, 10) || 1;
                        this.getAudioList();
                        break;
                    case 'search':
                        this.dataType = this.trackType.search;
                        this.pattern = this.$stateParams.query;
                        this.byArtist = this.$stateParams.artist === "true" || false;
                        this.paging.currentPage = parseInt(this.$stateParams.page, 10) || 1;
                        this.audioSearch();
                        break;
                    case 'track':
                        if(this.$stateParams.trackId){
                            this.getAudioById(this.$stateParams.trackId);
                        }
                        this.resetPaging();
                        break;
                    default:
                        break;
                }
            });

            $scope.$on('$destroy', () => {
                if($scope.player){
                    $scope.player.stop();
                }
            });
        }

        onPageChanged(){
            switch(this.$rootScope.currentState){
                case 'recommended':
                    this.goToRecommended();
                    break;
                case 'popular':
                    this.goToPopular();
                    break;
                case 'mytracks':
                    this.goToMyTracks();
                    break;
                case 'search':
                    this.goToAudioSearch(false);
                    break;
                case 'track':
                    if(this.$stateParams.trackId){
                        this.getAudioById(this.$stateParams.trackId);
                    }
                    this.resetPaging();
                    break;
                default:
                    break;
            }
        }

        getFriendsList(){
            this.appService.getFriendsList().then((res) => {
                this.$scope.friends = res;
            });
        }

        goToAudioSearch(newSearch){
            if(newSearch){
                this.resetPaging();
            }

            this.checkPaging(this.trackType.search);
            this.$state.go('search', { query: this.pattern, artist: this.byArtist, page: this.getCurrentPage() });
        }

        goToPopular(){
            this.checkPaging(this.trackType.popular);
            this.$state.go('popular');
        }

        goToRecommended(){
            this.checkPaging(this.trackType.recommendationByUser);
            this.$state.go('recommended', { page: this.getCurrentPage() });
        }

        goToMyTracks(){
            this.checkPaging(this.trackType.myTracks);
            this.$state.go('mytracks', { page: this.getCurrentPage() });
        }

        audioSearch(){
            this.appService.searchAudio(this.pattern, this.byArtist, this.paging).then((res) => {
                this.recalculatePaging(this.paging, res.count);
                this.paging.totalItems = res.count;
                this.$scope.audios = res.items;
            });
        }

        getAudioList(){
            this.appService.getAudioList(this.paging).then((res) => {
                this.recalculatePaging(this.paging, res.count);
                this.$scope.audios = res.items;
            });
        }

        getAudioById(trackId){
            this.appService.getAudioById(trackId).then((res) => {
                this.recalculatePaging(this.paging, res.length);
                this.$scope.audios = res;
            });
        }

        getPopularList(){
            this.appService.getPopularList(this.paging).then((res) => {
                this.paging.totalItems = res.length;
                this.paging.itemsPerPage = res.length;
                this.paging.totalPages = 1;
                this.paging.totalPagesCaption = this.stringService.getWordEnding(this.paging.totalPages, 'pages');
                this.paging.totalItemsCaption = this.stringService.getWordEnding(this.paging.totalItems, 'records');
                this.$scope.audios = res;
            });
        }

        getRecommendationsByUser(){
            this.getRecommendationsList(this.appService.getUserId())
        }

        getRecommendationsByTrack(){
            this.getRecommendationsList();
        }

        getRecommendationsList(params?){
            return this.appService.getRecommendations(params, this.paging).then((res) => {
                this.recalculatePaging(this.paging, res.count);
                this.$scope.audios = res.items;
            });
        }

        recalculatePaging(paging, count){
            paging.totalItems = count;
            paging.totalPages = Math.ceil(count / paging.itemsPerPage);
            paging.totalPagesCaption = this.stringService.getWordEnding(paging.totalPages, 'pages');
            paging.totalItemsCaption = this.stringService.getWordEnding(paging.totalItems, 'records');
        }

        private resetPaging(){
            this.paging = {
                totalItems: 0,
                totalPages: 0,
                currentPage: 1,
                maxSize: 10,
                itemsPerPage: this.itemsPerPage
            };
        }

        getCurrentPage(){
            return this.paging.currentPage;
        }

        private checkPaging(type){
            if(this.dataType !== type){
                this.dataType = type;
                this.paging.currentPage = 1;
            }
        }
    }

    angular.module('app').controller('tracksController', TracksController);
}