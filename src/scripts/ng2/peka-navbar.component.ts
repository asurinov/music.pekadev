import { Component, EventEmitter } from '@angular/core';
import {UserInfo } from './userInfo.model';

@Component({
    selector: 'peka-navbar',
    template: `
<nav class="navbar navbar-default navbar-fixed-top">
    <div class="container-fluid">
        <button class="btn btn-primary navbar-btn" ui-sref="main"><i class="fa fa-home"></i></button>
        <button class="btn btn-primary navbar-btn" ui-sref="playlists">Плейлисты</button>
        <button class="btn btn-primary navbar-btn" *ngIf="!isAuthorized" (click)="login()">
            <i class="fa fa-vk"></i>
            <span>Войти</span>
        </button>
        <span *ngIf="isAuthorized" class="pull-right">
            <img class="img-circle hidden-xs" [src]="userInfo.photo_50" alt="">
            <span class="hidden-xs">{{userInfo.last_name}}</span>
            <span class="hidden-xs">{{userInfo.first_name}}</span>
            <button class="btn btn-primary navbar-btn" (click)="logout()">
                <i class="fa fa-vk"></i>
                <span>Выйти</span>
            </button>
        </span>
    </div>
</nav>`,
    inputs: ['isAuthorized', 'userInfo'],
    outputs: ['onLogout', 'onLogin']
})

export class NavbarComponent {
    userInfo: UserInfo;
    isAuthorized: boolean;

    onLogin: EventEmitter<any>;
    onLogout: EventEmitter<any>;

    constructor() {
        this.onLogin = new EventEmitter();
        this.onLogout = new EventEmitter();
    }

    logout(){
        this.onLogout.emit();
    }

    login(){
        this.onLogin.emit();
    }
}
