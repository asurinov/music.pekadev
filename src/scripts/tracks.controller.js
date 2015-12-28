/**
 * Created by Machete on 27.12.2015.
 */
(function(){
    angular
        .module('app')
        .controller('tracksController', tracksController);

    tracksController['$inject'] = ['$scope', 'appService', 'ngAudio'];

    function tracksController($scope, appService, ngAudio){
        var vm = this;
        vm.currentRecord = {};

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
                $scope.audioPlayer.setVolume(0.4);
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
            appService.searchAudio(vm.pattern).then(function(res){
                prepareRecords(res);
                $scope.audios = res;
            });
        }

        function getAudioList(){
            appService.getAudioList().then(function(res){
                prepareRecords(res);
                $scope.audios = res;
            });
        }

        function getPopularList(){
            appService.getPopularList().then(function(res){
                prepareRecords(res);
                $scope.audios = res;
            });
        }

        function prepareRecords(records){
            for(var i = 0; i < records.length; i++){
                records[i].duration = moment.duration(records[i].duration, 'seconds').format('mm:ss', { trim: false });
            }
        }
    }
})(angular, moment);