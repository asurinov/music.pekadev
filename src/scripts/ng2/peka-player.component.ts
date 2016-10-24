import {Component, OnInit} from '@angular/core';
import {StateService} from 'ui-router-ng2';
import {TrackTypes} from './enums';
import {Paging, ITrackList, ITrack} from './player.models';
import {AppService} from "./app.service";

@Component({
    selector: 'peka-player',
    template: `
<div class="container">
    <div class="row">
        <div class="col-md-6 col-xs-12">
            <div class="row">
                <div class="input-group">
                    <span class="input-group-btn">
                        <button type="button" class="btn btn-default">
                            <i class="fa fa-users"></i>
                        </button>
                    </span>
                    <input type="text" class="form-control" placeholder="Поиск аудиозаписей" [(ngModel)]="pattern" (keyup.enter)="goToAudioSearch(true)">
                    <span class="input-group-btn">
                        <button class="btn btn-default" type="button" (click)="goToAudioSearch(true)" [disabled]="!pattern">
                            <i class="fa fa-search"></i>
                        </button>
                    </span>
                </div>
            </div>
        </div>
    </div>
    <ui-view></ui-view>
</div>`
})

export class PlayerComponent implements OnInit {
    static ItemsPerPage = 50;

    byArtist: boolean = false;
    dataType: TrackTypes;
    pattern: string;
    paging: Paging;

    tracks: ITrack[];

    constructor(
        private appService: AppService,
        private stateService: StateService
    ) {
        this.paging = new Paging(1);
    }

    ngOnInit(): void {
        switch(this.stateService.$current.name){
            case 'recommended':
                this.dataType = TrackTypes.Recommended;
                this.paging.currentPage = parseInt(this.stateService.params['page'], 10) || 1;
                this.getRecommendationsList();
                break;
            case 'popular':
                this.dataType = TrackTypes.MyTracks;
                this.getPopularList();
                break;
            case 'mytracks':
                this.dataType = TrackTypes.Popular;
                this.paging.currentPage = parseInt(this.stateService.params['page'], 10) || 1;
                this.getAudioList();
                break;
            case 'search':
                this.dataType = TrackTypes.Search;
                this.pattern = this.stateService.params['query'];
                this.byArtist = this.stateService.params['artist'] === "true" || false;
                this.paging.currentPage = parseInt(this.stateService.params['page'], 10) || 1;
                this.audioSearch();
                break;
            case 'track':
                if(this.stateService.params['trackId']){
                    this.getAudioById(this.stateService.params['trackId']);
                }
                this.resetPaging();
                break;
            default:
                break;
        }
    }

    goToAudioSearch(newSearch){
        if(newSearch){
            this.resetPaging();
        }

        this.checkPaging(TrackTypes.Search);
        this.stateService.go('search', { query: this.pattern, artist: this.byArtist, page: this.getCurrentPage() });
    }

    goToPopular(){
        this.checkPaging(TrackTypes.Popular);
        this.stateService.go('popular');
    }

    goToRecommended(){
        this.checkPaging(TrackTypes.Recommended);
        this.stateService.go('recommended', { page: this.getCurrentPage() });
    }

    goToMyTracks(){
        this.checkPaging(TrackTypes.MyTracks);
        this.stateService.go('mytracks', { page: this.getCurrentPage() });
    }

    getPopularList(){
        this.appService.getPopularList(this.paging).then((res: any[]) => {
            this.paging.setTotalItems(res.length);
            this.tracks = res;
        });
    }

    getAudioList(){
        this.appService.getAudioList(this.paging).then((res: ITrackList) => {
            this.paging.setTotalItems(res.count);
            this.tracks = res.items;
        });
    }

    getRecommendationsList(params?){
        return this.appService.getRecommendations(this.paging).then((res: ITrackList) => {
            this.paging.setTotalItems(res.count);
            this.tracks = res.items;
        });
    }

    audioSearch(){
        this.appService.searchAudio(this.pattern, this.byArtist, this.paging).then((res: ITrackList) => {
            this.paging.setTotalItems(res.count);
            this.tracks = res.items;
        });
    }

    getAudioById(trackId){
        this.appService.getAudioById(trackId).then((res: ITrackList) => {
            this.paging.setTotalItems(res.count);
            this.tracks = res.items;
        });
    }

    private checkPaging(type: TrackTypes){
        if(this.dataType !== type){
            this.dataType = type;
            this.paging.currentPage = 1;
        }
    }

    private resetPaging(){
        this.paging = new Paging(1);
    }

    getCurrentPage(){
        return this.paging.currentPage;
    }
}