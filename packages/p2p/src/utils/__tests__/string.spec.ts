import { countDecimalPlaces, getShortNickname } from '../string';

describe('countDecimalPlaces', () => {
    it('should return the correct number of decimal places', () => {
        expect(countDecimalPlaces(1.234)).toEqual(3);
        expect(countDecimalPlaces(1.2)).toEqual(1);
        expect(countDecimalPlaces(1)).toEqual(0);
    });
});

describe('getShortNickname', () => {
    it('should return the correct short nickname', () => {
        expect(getShortNickname('test')).toEqual('TE');
        expect(getShortNickname('test123')).toEqual('TE');
        expect(getShortNickname('test 123')).toEqual('TE');
        expect(getShortNickname('test 123 .,:;()@#+/-')).toEqual('TE');
    });
});
