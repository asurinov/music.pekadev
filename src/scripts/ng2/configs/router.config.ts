import {UIRouter} from "ui-router-ng2";
import {Inject, Injectable} from "@angular/core";

/** UIRouter Config  */
@Injectable()
export class PekaUIRouterConfig {
    constructor(@Inject(UIRouter) router: UIRouter) {
        router.urlRouterProvider.otherwise(() => router.stateService.go('tracks'));
    }
}