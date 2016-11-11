import { Injectable } from '@angular/core';
import {Http, Response, ResponseContentType} from "@angular/http";
import {Paging} from "./player.models";

@Injectable()
export class AppService {

    static VK_API_VERSION: string = '5.53';
    static VK_CLIENT_ID: number = 5130198;

    private expire: number;
    private userId: number;
    private audioAccessLevel: number = 8;

    constructor(private http:Http){}

    auth(){
        return new Promise((resolve, reject) => {
            VK.Auth.login((response) => {
                if (response.session) {
                    /* Пользователь успешно авторизовался */
                    resolve();
                    if (response.settings) {
                        /* Выбранные настройки доступа пользователя, если они были запрошены */
                    }
                } else {
                    /* Пользователь нажал кнопку Отмена в окне авторизации */
                    reject();
                }
            }, this.audioAccessLevel);
        });
    }

    logout(){
        return new Promise((resolve, reject) => {
            VK.Auth.logout((response) => {
                if (response) {
                    resolve();
                } else {
                    reject();
                }
            });
        });
    }

    getUserInfo(userId?: number): Promise<any> {
        const params = {
            user_ids: userId || this.getUserId(),
            fields: 'first_name,last_name,photo_50',
            v: AppService.VK_API_VERSION
        };

        return this.callApi('users.get', params);
    }

    getLoginStatus(){
        return new Promise((resolve, reject) => {
            VK.Auth.getLoginStatus((res) => {
                if (res.session) {
                    this.setAccessParams(res.session);
                    resolve();
                } else {
                    reject();
                }
            });
        });
    }

    getPopularList(paging: Paging){
        const params = this.getParamsWithPaging(paging);
        return this.callApi('audio.getPopular', params);
    }

    getAudioList(paging: Paging){
        const params = Object.assign(this.getParamsWithPaging(paging), { owner_id: this.getUserId() });

        return this.callApi('audio.get', params);
    }

    searchAudio(pattern: string, byArtist: boolean, paging: Paging){
        const params = Object.assign(this.getParamsWithPaging(paging), {
            q: pattern,
            performer_only: byArtist ? 1 : 0,
            auto_complete: 0,
            sort: 2
        });

        return this.callApi('audio.search', params);
    }

    getRecommendations(paging: Paging){
        var params = Object.assign(this.getParamsWithPaging(paging), {user_id: this.getUserId()});
        return this.callApi('audio.getRecommendations', params);
    }

    getAudioById(id){
        const params = {
            audios: id,
            v: AppService.VK_API_VERSION
        };

        return this.callApi('audio.getById', params);
    }

    private getParamsWithPaging(paging: Paging){
        return Object.assign(this.getBaseParam(), {
            offset: (paging.currentPage - 1) * paging.itemsPerPage,
            count: paging.itemsPerPage,
        })
    }

    private getBaseParam(){
        return {
            v: AppService.VK_API_VERSION
        };
    }

    private callApi(method: string, params) {
        const promise = new Promise((resolve) => {
            return resolve(this.isSessionExpires() ? this.getLoginStatus() : true);
        });

        return promise.then(() => {
            return new Promise((resolve, reject) => {
                VK.Api.call(method, params, (r) => {
                    return r.response ? resolve(r.response) : reject('');
                });
            });
        });
    }

    private isSessionExpires(){
        return this.expire < new Date().getTime() / 1000;
    }

    private setAccessParams(session){
        this.userId = session.mid;
        this.expire = session.expire;
    }

    getUserId(){
        return this.userId;
    }

    copyToClipboard(str: string){
        var textArea = document.createElement("textarea");

        //
        // *** This styling is an extra step which is likely not required. ***
        //
        // Why is it here? To ensure:
        // 1. the element is able to have focus and selection.
        // 2. if element was to flash render it has minimal visual impact.
        // 3. less flakyness with selection and copying which **might** occur if
        //    the textarea element is not visible.
        //
        // The likelihood is the element won't even render, not even a flash,
        // so some of these are just precautions. However in IE the element
        // is visible whilst the popup box asking the user for permission for
        // the web page to copy to the clipboard.
        //

        // Place in top-left corner of screen regardless of scroll position.
        textArea.style.position = 'fixed';
        textArea.style.top = 0;
        textArea.style.left = 0;

        // Ensure it has a small width and height. Setting to 1px / 1em
        // doesn't work as this gives a negative w/h on some browsers.
        textArea.style.width = '2em';
        textArea.style.height = '2em';

        // We don't need padding, reducing the size if it does flash render.
        textArea.style.padding = 0;

        // Clean up any borders.
        textArea.style.border = 'none';
        textArea.style.outline = 'none';
        textArea.style.boxShadow = 'none';

        // Avoid flash of white box if rendered for any reason.
        textArea.style.background = 'transparent';


        textArea.value = str;

        document.body.appendChild(textArea);

        textArea.select();

        try {
            var successful = document.execCommand('copy');
            var msg = successful ? 'successful' : 'unsuccessful';
            console.log('Copying text command was ' + msg);
        } catch (err) {
            console.log('Oops, unable to copy');
        }

        document.body.removeChild(textArea);
    }

    download(name: string, url: string){
        this.http.get(url, { responseType: ResponseContentType.ArrayBuffer }).subscribe((response: Response) => {
            const blob = new Blob([response._body]);
            saveAs(blob, name);
        });
    }
}