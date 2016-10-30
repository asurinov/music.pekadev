import {Inject, Injectable} from '@angular/core';
import {Howler, Howl } from 'howler';
import { LocalStorageService } from 'angular-2-local-storage';

@Injectable()
export class AudioService {
    static VolumeKey: string = 'VOLUME';

    repeatMode = false;

    player;

    constructor(private localStorageService: LocalStorageService){
        const volume = localStorageService.get<number>(AudioService.VolumeKey);
        if(volume !== null){
            if(volume <= 100 && volume > 0){
                Howler.volume(volume / 100);
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
        this.player = new Howl({src: urls, html5: true});
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
        Howler.volume(val / 100);
    }

    getVolume(){
        return Howler.volume() * 100;
    }

    play(){
        this.player.play();
    }

    pause(){
        this.player.pause();
    }

}
