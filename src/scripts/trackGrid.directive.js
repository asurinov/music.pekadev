(function(){
    angular.module('app').directive('trackGrid', trackGridDirective);

    trackGridDirective.$inject = ['ngAudio'];

    function trackGridDirective(ngAudio){
        function controller($scope){
            var vm = this;
            var volume = 0.2;

            vm.currentRecord = {};

            $scope.audioPlayer = null;

            vm.togglePlayback = togglePlayback;

            function togglePlayback(record){
                if(record.playing){
                    $scope.audioPlayer.pause();
                    record.playing = false;
                } else {
                    if(record.url !== vm.currentRecord.url){
                        vm.currentRecord.playing = false;
                        vm.currentRecord = record;
                        if($scope.audioPlayer){
                            volume = $scope.audioPlayer.volume;
                            $scope.audioPlayer.pause();
                        }
                    }
                    if(!$scope.audioPlayer || $scope.audioPlayer.id !== record.url) {
                        $scope.audioPlayer = ngAudio.play(record.url);
                        $scope.audioPlayer.setVolume(volume);
                    } else {
                        $scope.audioPlayer.play();
                    }

                    record.playing = true;
                }
            }
        }

        return {
            restrict: 'E',
            templateUrl: '/partials/trackGrid.view.html',
            scope: {
                tracks: '='
            },
            controller: ['$scope', controller],
            controllerAs: 'tgc'
        }
    }
})();