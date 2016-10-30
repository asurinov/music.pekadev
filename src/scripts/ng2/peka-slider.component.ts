import { Component, OnInit, EventEmitter } from '@angular/core';

declare var Slider: Function;

interface IChange {
    newValue: number;
    oldValue: number;
}

@Component({
    selector: 'peka-slider',
    template: `<input id="peka-slider" type="number">`,
    inputs: ['value'],
    outputs: ['onValueChange']
})

export class PekaSliderComponent implements OnInit {

    value: number;
    onValueChange: EventEmitter<number> = new EventEmitter<number>();

    volume: number;

    constructor() {}

    ngOnInit(){
        // Instantiate a slider
        const slider = new Slider("#peka-slider", {
            min: 0,
            max: 100,
            step: 1
        });

        slider.on('change', (model: IChange) => {
            this.onValueChange.emit(model.newValue);
        });

        slider.setValue(this.value);
    }
}
