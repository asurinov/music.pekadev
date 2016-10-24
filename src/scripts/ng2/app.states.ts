import {PlayerComponent} from "./peka-player.component";
import {Transition} from "ui-router-ng2";
import {AppService} from "./app.service";
import {Paging} from "./player.models";
import {PekaTracksComponent} from "./peka-tracks.component";

export const mainState = { name: 'tracks', url: '/tracks', component: PlayerComponent};
export const myTracksState = { name: 'tracks.my', url: '/mytracks/:page',  component: PlayerComponent };
export const popularState = { name: 'tracks.popular', url: '/popular',  component: PlayerComponent };
export const searchState = { name: 'tracks.search', url: '/search?query&artist&page',  component: PlayerComponent };

export const recommendedState = {
    name: 'tracks.recommended',
    url: '/recommended/:page',
    component: PekaTracksComponent,
    resolve: [
        {
            token: 'gridModel',
            deps: [Transition, AppService],
            resolveFn: (trans, appService) => {
                const paging = new Paging(parseInt(trans.params().page, 10) || 1);

                return appService.getRecommendations(paging).then(res => {
                    paging.totalItems = res.count;

                    return {
                        paging: paging,
                        tracks: res.items
                    }
                });
            }
        }
    ]
};

