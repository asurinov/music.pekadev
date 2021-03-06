import {Component, EventEmitter} from '@angular/core';
import {StateService} from 'ui-router-ng2';
import {ITrack} from './player.models';
import {AudioService} from './audio.service';
import {AppService} from "./app.service";
import * as _ from "underscore";

@Component({
    selector: 'track-grid',
    template: `
    <div class="col-xs-12 audio-grid">
        <table class="table">
            <colgroup>
                <col>
                <col width="55px">
                <col width="55px">
            </colgroup>
            <tbody>
                <tr *ngFor="let audio of tracks; let i = index"
                    (click)="toggle(audio, i)"
                    [ngClass]="{'playing': record.id === audio.id && record.playing}">
                    <td>
                        <a class="track-artist"
                              title="{{audio.artist}}"
                              (click)="searchByArtist(audio.artist); $event.stopPropagation();">{{audio.artist}}</a>
                        - 
                        <span title="{{audio.title}}">{{audio.title}}</span>
                    </td>
                    <td>
                        <span>{{audio.duration | pekaDuration}}</span>
                    </td>
                    <td>
                        <span title="Скачать" (click)="$event.stopPropagation();download(audio)">
                            <i class="fa fa-download"></i>
                        </span>
                        <span title="Скопировать ссылку на трек" (click)="$event.stopPropagation();copyLink(audio)">
                            <i class="fa fa-share"></i>
                        </span>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
    <div class="audio-controls col-xs-12">
        <div class="row">
            <div class="col-xs-12">
                <peka-progress [value]="record.progress" (onValueChange)="seekRecord($event)"></peka-progress>
            </div>
            <div class="col-xs-12">
                <div class="playback-buttons">
                    <button class="btn btn-sm btn-default" (click)="previousTrack()" [disabled]="!tracks || tracks.length === 0">
                        <span class="fa fa-step-backward"></span>
                    </button>
                    <button class="btn btn-sm btn-default" (click)="toggle()" [disabled]="!tracks || tracks.length === 0">
                        <span class="fa" [ngClass]="{'fa-play': !record.playing, 'fa-pause': record.playing}"></span>
                    </button>
                    <button class="btn btn-sm btn-default" (click)="nextTrack()" [disabled]="!tracks || tracks.length === 0">
                        <span class="fa fa-step-forward"></span>
                    </button>
                    <button class="btn btn-sm btn-default" [ngClass]="{'active': repeatMode}" (click)="toggleRepeatMode()">
                        <span class="fa fa-repeat"></span>
                    </button>
                </div>
                <div class="track-info">
                    <div class="marquee" *ngIf="record.id">
                        <span>{{record.author}}</span>
                        <span>&#8212;</span>
                        <span>{{record.title}}</span>
                    </div>
                </div>
                <div class="slider">
                    <peka-slider [value]="volume" (onValueChange)="setVolume($event)"></peka-slider>
                    <!--<input id="volume-control" type="range" min="0" max="1" step="0.01" [(ngModel)]="volume" (ngModelChange)="setVolume($event)"/>-->
                </div>
            </div>
        </div>
    </div>`,
    inputs: ['tracks'],
    outputs: ['onSearchByArtist']
})

export class TrackGridComponent {
    tracks: ITrack[];

    repeatMode: boolean;

    record;
    volume: number;

    onSearchByArtist: EventEmitter<string> = new EventEmitter<string>();

    constructor(
        private appService: AppService,
        private audioService: AudioService,
        private stateService: StateService,
    ){
        this.volume = audioService.getVolume();
        this.repeatMode = audioService.getRepeatMode();

        this.record = {
            id: null,
            index: 0,
            duration: 0,
            progress: 0,
            author: null,
            title: null,
            playing: false
        };
    }

    setVolume(val: number){
        this.audioService.setVolume(val);
    }

    seekRecord(val){
        this.audioService.seekRecord(val);
    }

    toggle(audio?: ITrack, index?: number){
        if(this.record.playing && (!audio || this.record.id === audio.id)){
            this.pause();
        } else {
            this.play(audio ? audio.id : this.record.id, index !== undefined ? index : this.record.index);
        }
    }

    play(recordId: number, index: number){
        if(!this.record.id || this.record.id !== recordId){
            this.loadRecord(index);
        }else {
            this.audioService.play();
        }

        this.record.playing = true;
    }

    pause(){
        this.audioService.pause();
        this.record.playing = false;
    }

    loadRecord(index){
        let trackIndex = index % this.tracks.length;

        const record = this.tracks[trackIndex];
        if(record) {
            let player = this.audioService.getPlayer();

            if(player){
                player.stop();
                player.unload();
                this.record.playing = false;
            }

            player = this.audioService.loadRecords([record.url]);

            player.on('load', () => {
                player.play();
                this.record = Object.assign(this.record, {
                    duration: Math.round(player.duration()),
                    id: record.id,
                    author: record.artist,
                    title: record.title,
                    playing: true,
                    index: trackIndex,
                    progress: 0
                });
            });

            player.on('play', () => {
                // Start upating the progress of the track.
                requestAnimationFrame(() => { this.updateProgress()});
            });

            player.on('end', () => {
                if(this.repeatMode){
                    player.play();
                } else {
                    this.loadRecord(++trackIndex);
                }
            });
        }
    }

    nextTrack(){
        this.record.index = ++this.record.index % this.tracks.length;
        this.loadRecord(this.record.index);
    }

    previousTrack(){
        var currentIndex = this.record.index;
        this.record.index = --currentIndex < 0 ? this.tracks.length + currentIndex : currentIndex;
        this.loadRecord(this.record.index);
    }

    updateProgress(){
        var player = this.audioService.getPlayer();

        if (player.playing()) {
            this.record.progress = (player.seek() || 0) / this.record.duration;
            requestAnimationFrame(() => { this.updateProgress()});
        }
    }

    searchByArtist(artist: string){
        this.onSearchByArtist.emit(artist);
    }

    toggleRepeatMode(){
        this.repeatMode = !this.repeatMode;
        this.audioService.setRepeatMode(this.repeatMode);
    }

    download(audio: ITrack){
        this.appService.download(`${audio.artist} - ${audio.title}.mp3`, audio.url);
    }

    copyLink(audio: ITrack){
        const link = this.stateService.href('track', {trackId: `${audio.owner_id}_${audio.id}`});
        this.appService.copyToClipboard(`${window.location.host}${link}`);
    }
}
