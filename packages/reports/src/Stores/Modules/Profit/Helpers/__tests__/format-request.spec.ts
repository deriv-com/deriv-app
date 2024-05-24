import getDateBoundaries from '../format-request';

describe('getDateBoundaries', () => {
    it('should return date_from and date_to', () => {
        const date_from = 1635724800;
        const date_to = 1635811200;
        const partial_fetch_time = false;
        const should_load_partially = false;
        const returnValue = getDateBoundaries(date_from, date_to, partial_fetch_time, should_load_partially);
        expect(returnValue).toEqual({
            date_from,
            date_to,
        });
    });

    it('should return date_from and date_to with partial_fetch_time', () => {
        jest.useFakeTimers('modern').setSystemTime(new Date('2021-11-01').getTime());
        const date_from = 1635724900;
        const date_to = 1635811200;
        const partial_fetch_time = 1635724800;
        const should_load_partially = true;
        const returnValue = getDateBoundaries(date_from, date_to, partial_fetch_time, should_load_partially);
        expect(returnValue).toEqual({
            date_from: partial_fetch_time,
            date_to: 1635811199,
        });
        jest.useRealTimers();
    });

    it('should not return date_from if date from is not available', () => {
        const date_from = null;
        const date_to = 1635724900;
        const partial_fetch_time = false;
        const should_load_partially = false;
        const returnValue = getDateBoundaries(date_from, date_to, partial_fetch_time, should_load_partially);
        expect(returnValue).toEqual({
            date_to,
        });
    });
});
