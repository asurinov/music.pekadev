import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'pekaDuration'})
export class PekaDurationPipe implements PipeTransform {
    transform(input: number): string {
        let output = '';

        let hours: number;

        let minutes = Math.floor(input / 60);
        const seconds = Math.floor(input % 60);
        if(minutes > 59){
            hours = Math.floor(minutes / 60);
            minutes = Math.floor(minutes % 60);
        }

        if(hours){
            output += hours + ':';
        }

        if(minutes < 10){
            output += '0';
        }

        output += minutes;
        output += ':';

        if(seconds < 10){
            output += '0';
        }

        output += seconds;

        return output;
    }
}