import { getHoveredColor } from '../barrier-utils';

describe('getHoveredColor', () => {
    it('should return red color (#ec3f3f) if passed value is TURBOSSHORT', () => {
        expect(getHoveredColor('TURBOSSHORT')).toEqual('#ec3f3f');
    });
    it('should return green color (#4bb4b3) if passed value is TURBOSLONG', () => {
        expect(getHoveredColor('TURBOSLONG')).toEqual('#4bb4b3');
    });
    it('should return blue color (#377cfc) if passed value not TURBOSLONG or TURBOSSHORT', () => {
        expect(getHoveredColor('TESTTYPE')).toEqual('#377cfc');
    });
});
