(function(){
    angular.module('app').directive('trackGrid', trackGridDirective);

    trackGridDirective.$inject = [];

    function trackGridDirective(){
        function controller($scope){
            var vm = this;
            $scope.volume = 0.5;
            $scope.repeatMode = false;

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

            vm.canPlay = canPlay;
            vm.nextTrack = nextTrack;
            vm.previousTrack = previousTrack;

            vm.searchByArtist = searchByArtist;

            $scope.seekRecord = function(newVal){
                if($scope.player){
                    $scope.player.pause();
                    $scope.player.seek(newVal *  $scope.player.duration());
                    $scope.player.play();
                }
            }

            $scope.$watch('volume', function(newVal){
                Howler.volume(newVal);
            });

            function loadRecord(index){
                var trackIndex = index % $scope.tracks.length;

                var record = $scope.tracks[trackIndex];
                if(record) {
                    if($scope.player){
                        $scope.player.stop();
                        $scope.player.unload();
                        $scope.record.playing = false;
                    }

                    $scope.player = new Howl({src: [record.url], html5: true});

                    $scope.player.on('load', function () {
                        $scope.player.play();
                        $scope.record = {
                            duration: Math.round($scope.player.duration()),
                            id: record.id,
                            author: record.artist,
                            title: record.title,
                            playing: true,
                            data: record,
                            index: trackIndex
                        };
                        record.playing = true;
                    });

                    $scope.player.on('play', function () {
                        // Start upating the progress of the track.
                        requestAnimationFrame(updateProgress);
                    });

                    $scope.player.on('end', function () {
                        if($scope.repeatMode){
                            $scope.player.play();
                        } else {
                            loadRecord(++trackIndex);
                        }
                    });
                }
            }

            function play(record, index){
                if($scope.record.id !== record.id){
                    loadRecord(index);
                }else {
                    $scope.player.play();
                }

                $scope.record.playing = true;
                record.playing = true;
            }

            function pause(){
                $scope.player.pause();
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
                $scope.$apply(function(){
                    $scope.record.progress = (($scope.player.seek() || 0) / $scope.record.duration).toFixed(2);
                });
                // If the sound is still playing, continue stepping.
                if ($scope.player.playing()) {
                    requestAnimationFrame(updateProgress);
                }
            }

            function searchByArtist(artist){
                resetPlayer();
                $scope.$emit('searchByArtist', artist);
            }

            function resetPlayer(){
                if($scope.player){
                    $scope.player.stop();
                    $scope.player.unload();
                }
            }
        }

        function link(scope, element){
            var progressBar = angular.element(element[0].querySelector('.progress-control'));

            progressBar.on('click', function (e) {
                var x = e.pageX - this.parentElement.offsetLeft - this.offsetLeft;
                scope.seekRecord(x * this.max / this.offsetWidth);
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
            controller: ['$scope', controller],
            controllerAs: 'tgc',
            link: link
        }
    }
})();