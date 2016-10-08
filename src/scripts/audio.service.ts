module App {

    import ILocalStorageService = angular.local.storage.ILocalStorageService;
    class AudioService implements IAudioService {
        static $inject = ['localStorageService', 'Howl', 'Howler'];
        static VolumeKey: string = 'VOLUME';

        repeatMode = false;
        player;

        constructor(
            private localStorageService: ILocalStorageService,
            private Howl,
            private Howler
        ){
            const volume = localStorageService.get(AudioService.VolumeKey);
            if(volume !== null){
                if(volume <= 1 && volume > 0){
                    this.Howler.volume(volume);
                } else {
                    localStorageService.remove(AudioService.VolumeKey);
                }
            }
        }

        setRepeatMode(val: boolean){
            this.repeatMode = val;
        }

        getRepeatMode(){
            return this.repeatMode;
        }

        getPlayer(){
            return this.player;
        }

        loadRecords(urls: string[]){
            this.player = new this.Howl({src: urls, html5: true});
            return this.player;
        }

        seekRecord(val: number){
            if(this.player){
                this.player.pause();
                this.player.seek(val *  this.player.duration());
                this.player.play();
            }
        }

        setVolume(val: number){
            this.localStorageService.set(AudioService.VolumeKey, val);
            this.Howler.volume(val);
        }

        getVolume(){
            return this.Howler.volume();
        }

        play(){
            this.player.play();
        }

        pause(){
            this.player.pause();
        }

    }

    angular.module('app').service('audioService', AudioService);
}