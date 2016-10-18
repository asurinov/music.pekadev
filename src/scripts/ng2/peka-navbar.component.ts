import { Component, EventEmitter } from '@angular/core';
import {UserInfo } from './userInfo.model';

@Component({
    selector: 'peka-navbar',
    template: `
<nav class="navbar navbar-default">
    <div class="container-fluid">
        <button class="btn btn-primary navbar-btn" uiSref="main"><i class="fa fa-home"></i></button>
        <button class="btn btn-primary navbar-btn" uiSref="playlists">Плейлисты</button>
        <button class="btn btn-primary navbar-btn" *ngIf="!isAuthorized" (click)="login()">
            <i class="fa fa-vk"></i>
            <span>Войти</span>
        </button>
        <button type="button" class="btn btn-primary" *ngIf="isAuthorized" uiSref="mytracks" [uiParams]="{ page: 1 }">
            <span class="glyphicon glyphicon-ok-sign"></span>
            Мои аудиозаписи
        </button>
        <button class="btn btn-primary" *ngIf="isAuthorized" uiSref="recommended" [uiParams]="{ page: 1 }">
            <span class="glyphicon glyphicon-question-sign"></span>
            Мои рекомендации
        </button>
        <button class="btn btn-primary" *ngIf="isAuthorized" uiSref="popular">
            <span class="glyphicon glyphicon-warning-sign"></span>
            Популярное
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
