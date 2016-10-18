import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import { LocalStorageService, LOCAL_STORAGE_SERVICE_CONFIG } from 'angular-2-local-storage';
import {UIRouterModule} from "ui-router-ng2";
import {AppComponent} from './app.component';
import {NavbarComponent} from "./peka-navbar.component";
import {PlayerComponent} from "./peka-player.component";
import * as States from './app.states';
import {TrackGridComponent} from "./track-grid.component";
import {AppService} from "./app.service";
import {AudioService} from "./audio.service";
import {StringService} from "./string.service";

let localStorageServiceConfig = {
    prefix: 'peka',
    storageType: 'localStorage'
};

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        UIRouterModule.forRoot({
            states: [
                States.mainState,
                States.myTracksState,
                States.popularState,
                States.recommendedState,
                States.searchState
            ],
            useHash: false
        })
    ],
    declarations: [ AppComponent, NavbarComponent, PlayerComponent, TrackGridComponent ],
    providers: [LocalStorageService, AppService, AudioService, StringService,
        {
            provide: LOCAL_STORAGE_SERVICE_CONFIG, useValue: localStorageServiceConfig
        }],
    bootstrap: [ AppComponent ]
})
export class AppModule { }