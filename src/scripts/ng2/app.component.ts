import { Component, OnInit } from '@angular/core';
import {AppService} from './app.service';
import {UserInfo } from './userInfo.model';

@Component({
    selector: 'music-pekadev',
    template: `
<peka-navbar [isAuthorized]="isAuthorized" [userInfo]="userInfo" (onLogout)="logout()" (onLogin)="login()"></peka-navbar>
<div class="container" *ngIf="isAuthorized">
    <ui-view></ui-view>
</div>`
})

export class AppComponent implements OnInit {
    isAuthorized: boolean;
    userInfo: UserInfo;

    constructor(private appService: AppService) { }

    ngOnInit(): void {
        VK.init({apiId: 5130198});
        this.appService.getLoginStatus().then(() => {
            this.getUserInfo();
        }, () => { this.isAuthorized = false; });
    }

    login(){
        this.appService.auth().then(() => {
            this.getUserInfo();
        });
    }

    logout(){
        this.appService.logout().then(() => {
            this.isAuthorized = false;
            this.userInfo = null;
        });
    }

    private getUserInfo(): void {
        this.appService.getUserInfo().then((res: UserInfo[]) => {
            this.userInfo = res[0];
            this.isAuthorized = true;
        });
    }
}