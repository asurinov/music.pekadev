import { Component, OnInit, EventEmitter } from '@angular/core';

@Component({
    selector: 'peka-progress',
    template: `<progress id="progress-control" class="progress-control" min="0" max="1" [value]="value" (click)="onClick($event)"></progress>`,
    inputs: ['value'],
    outputs: ['onValueChange']
})

export class PekaProgressComponent implements OnInit {

    value: number;
    onValueChange: EventEmitter<number> = new EventEmitter<number>();

    constructor() {}

    ngOnInit(){
        var x = 1;
    }

    onClick($event){
        this.onValueChange.emit(($event.layerX - $event.currentTarget.offsetLeft) * $event.currentTarget.max / $event.currentTarget.offsetWidth);
    }
}