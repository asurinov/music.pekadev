(function(){
    angular.module('app').directive('trackGrid', trackGridDirective);

    trackGridDirective.$inject = [];

    function trackGridDirective(){
        function controller($scope, audioService){
            var vm = this;
            $scope.volume = audioService.getVolume();
            $scope.repeatMode = audioService.getRepeatMode();

            $scope.record = {
                id: null,
                index: 0,
                duration: 0,
                progress: 0,
                author: null,
                title: null,
                playing: false,
                data: null
            };

            vm.play = play;
            vm.pause = pause;
            vm.toggle = toggle;
            vm.toggleRepeatMode = toggleRepeatMode;

            vm.canPlay = canPlay;
            vm.nextTrack = nextTrack;
            vm.previousTrack = previousTrack;

            vm.searchByArtist = searchByArtist;

            $scope.seekRecord = function(newVal){
                audioService.seekRecord(newVal);
            };

            $scope.$watch('volume', function(newVal){
                audioService.setVolume(newVal);
            });

            function toggleRepeatMode(){
                $scope.repeatMode = !$scope.repeatMode;
                audioService.setRepeatMode($scope.repeatMode);
            }

            function loadRecord(index){
                var trackIndex = index % $scope.tracks.length;

                var record = $scope.tracks[trackIndex];
                if(record) {
                    var player = audioService.getPlayer();

                    if(player){
                        player.stop();
                        player.unload();
                        $scope.record.playing = false;
                    }

                    player = audioService.loadRecords([record.url]);

                    player.on('load', function () {
                        player.play();
                        $scope.record = {
                            duration: Math.round(player.duration()),
                            id: record.id,
                            author: record.artist,
                            title: record.title,
                            playing: true,
                            data: record,
                            index: trackIndex
                        };
                        record.playing = true;
                    });

                    player.on('play', function () {
                        // Start upating the progress of the track.
                        requestAnimationFrame(updateProgress);
                    });

                    player.on('end', function () {
                        if($scope.repeatMode){
                            player.play();
                        } else {
                            loadRecord(++trackIndex);
                        }
                    });
                }
            }

            function play(record, index){
                if($scope.record.id !== record.id){
                    loadRecord(index);
                } else {
                    audioService.play();
                }

                $scope.record.playing = true;
                record.playing = true;
            }

            function pause(){
                audioService.pause();
                $scope.record.playing = false;
                $scope.record.data.playing = false;
            }

            function toggle(){
                if(canPlay()){
                    if($scope.record.playing){
                        pause();
                    } else {
                        play($scope.record.data || $scope.tracks[$scope.record.index], $scope.record.index)
                    }
                }
            }

            function canPlay(){
                return $scope.tracks && $scope.tracks.length > 0;
            }

            function nextTrack(){
                $scope.record.index = ++$scope.record.index % $scope.tracks.length;
                loadRecord($scope.record.index);
            }

            function previousTrack(){
                var currentIndex = $scope.record.index;
                $scope.record.index = --currentIndex < 0 ? $scope.tracks.length + currentIndex : currentIndex;
                loadRecord($scope.record.index);
            }

            function updateProgress(){
                var player = audioService.getPlayer();

                $scope.$apply(function(){
                    $scope.record.progress = ((player.seek() || 0) / $scope.record.duration).toFixed(3);
                });
                // If the sound is still playing, continue stepping.
                if (player.playing()) {
                    requestAnimationFrame(updateProgress);
                }
            }

            function searchByArtist(artist){
                $scope.$emit('searchByArtist', artist);
            }
        }

        function link(scope, element){
            var progressBar = angular.element(element[0].querySelector('.progress-control'));

            progressBar.on('click', function (e) {
                scope.seekRecord((e.layerX - this.offsetLeft) * this.max / this.offsetWidth);
            });

            scope.$on('destroy', function(){
                progressBar.off('click');
            });
        }

        return {
            restrict: 'E',
            templateUrl: '/partials/trackGrid.view.html',
            scope: {
                tracks: '='
            },
            controller: ['$scope', 'audioService', controller],
            controllerAs: 'tgc',
            link: link
        }
    }
})();