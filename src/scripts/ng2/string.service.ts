import { Injectable } from '@angular/core';

@Injectable()
export class StringService {

    static StringDictionaries = {
        'pages': ['страница', 'страницы', 'страниц'],
        'records': ['запись', 'записи', 'записей']
    };

    getWordEnding(num: number, dictionaryCode: string){
        var dictionary = StringService.StringDictionaries[dictionaryCode];
        if(dictionary){
            var rem = num % 10;
            var rem100 = num % 100;
            if(rem === 1 && rem100 !== 11){
                return num + ' '+ dictionary[0];
            } else if(rem >= 2 && rem <= 4 && rem100 !== 12){
                return num + ' ' + dictionary[1];
            } else {
                return num + ' ' + dictionary[2];
            }
        } else {
            throw new Error('Cannot find dictionary "' + dictionaryCode + '"');
        }
    }
}
