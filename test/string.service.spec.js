/**
 * Created by Machete on 29.12.2015.
 */
describe('StringService', function(){
    var stringService;

    beforeEach(module('app'));
    beforeEach(inject(function(_stringService_){
        stringService = _stringService_;
    }));

    it('should return getWordEnding 0', function(){
        expect(stringService.getWordEnding(1, 'pages')).toEqual('1 страница');
        expect(stringService.getWordEnding(21, 'pages')).toEqual('21 страница');
    });

    it('should return getWordEnding 1', function(){
        expect(stringService.getWordEnding(524, 'pages')).toEqual('524 страницы');
        expect(stringService.getWordEnding(1352, 'pages')).toEqual('1352 страницы');
    });

    it('should return getWordEnding 2', function(){
        expect(stringService.getWordEnding(11, 'pages')).toEqual('11 страниц');
        expect(stringService.getWordEnding(1145, 'pages')).toEqual('1145 страниц');
    });
});