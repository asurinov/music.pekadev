/**
 * Created by Machete on 27.12.2015.
 */
(function(){
    angular
        .module('app')
        .controller('tracksController', tracksController);

    tracksController['$inject'] = ['$scope', 'appService', 'ngAudio', 'stringService'];

    function tracksController($scope, appService, ngAudio, stringService){
        var vm = this;
        vm.currentRecord = {};

        vm.paging = null;
        vm.dataType = null;

        resetPaging();

        vm.loadGrid = loadGrid;

        $scope.audioPlayer = null;

        $scope.getFriendsList = getFriendsList;
        $scope.getAudioList = getAudioList;
        $scope.getPopularList = getPopularList;
        $scope.audioSearch = audioSearch;
        $scope.togglePlayback = togglePlayback;

        $scope.$on('$destroy', function(){
            if($scope.audioPlayer){
                $scope.audioPlayer.stop();
            }
        });

        function loadGrid(){
            switch(vm.dataType){
                case 'popular':
                    getPopularList();
                    break;
                case 'search':
                    audioSearch();
                    break;
                case 'mytracks':
                    getAudioList();
                    break;
                default:
                    break;
            }
        }

        function togglePlayback(record){
            if(record.playing){
                $scope.audioPlayer.pause();
                record.playing = false;
            } else {
                if(record.url !== vm.currentRecord.url){
                    vm.currentRecord.playing = false;
                    vm.currentRecord = record;
                    if($scope.audioPlayer){
                        $scope.audioPlayer.pause();
                    }
                }
                if(!$scope.audioPlayer || $scope.audioPlayer.id !== record.url) {
                    $scope.audioPlayer = ngAudio.load(record.url);
                }
                $scope.audioPlayer.setVolume(0.2);
                $scope.audioPlayer.play();
                record.playing = true;
            }
        }

        function getFriendsList(){
            appService.getFriendsList().then(function(res){
                $scope.friends = res;
            });
        }

        function audioSearch(){
            if(vm.dataType !== 'search'){
                vm.dataType = 'search';
                resetPaging();
            }

            appService.searchAudio(vm.pattern, vm.paging).then(function(res){
                recalculatePaging(vm.paging, res.count);
                vm.paging.totalItems = res.count;
                prepareRecords(res.items);
                $scope.audios = res.items;
            });
        }

        function getAudioList(){
            if(vm.dataType !== 'mytracks'){
                vm.dataType = 'mytracks';
                resetPaging();
            }

            appService.getAudioList(vm.paging).then(function(res){
                recalculatePaging(vm.paging, res.count);
                prepareRecords(res.items);
                $scope.audios = res.items;
            });
        }

        function getPopularList(){
            if(vm.dataType !== 'popular'){
                vm.dataType = 'popular';
                resetPaging();
            }

            appService.getPopularList().then(function(res){
                vm.paging.totalItems = res.length;
                vm.paging.itemsPerPage = res.length;
                vm.paging.totalPages = 1;
                vm.paging.totalPagesCaption = stringService.getWordEnding(vm.paging.totalPages, 'pages');
                vm.paging.totalItemsCaption = stringService.getWordEnding(vm.paging.totalItems, 'records');
                prepareRecords(res);
                $scope.audios = res;
            });
        }

        function prepareRecords(records){
            for(var i = 0; i < records.length; i++){
                records[i].duration = moment.duration(records[i].duration, 'seconds').format('mm:ss', { trim: false });
            }
        }

        function recalculatePaging(paging, count){
            paging.totalItems = count;
            paging.totalPages = Math.ceil(count / paging.itemsPerPage);
            paging.totalPagesCaption = stringService.getWordEnding(paging.totalPages, 'pages');
            paging.totalItemsCaption = stringService.getWordEnding(paging.totalItems, 'records');
        }

        function resetPaging(){
            vm.paging = {
                totalItems: 0,
                totalPages: 0,
                currentPage: 1,
                maxSize: 10,
                itemsPerPage: 30
            };
        }
    }
})(angular, moment);