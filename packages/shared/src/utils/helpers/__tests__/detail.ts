import { getUnitMap } from '../details';

describe('getUnitMap', () => {
    it('should return object with proper fields', () => {
        const duration = getUnitMap();

        expect(duration.d.name_plural).toEqual('days');
        expect(duration.h.name_plural).toEqual('hours');
        expect(duration.m.name_plural).toEqual('minutes');
        expect(duration.s.name).toEqual('seconds');
        expect(duration.t.name_plural).toEqual('ticks');
    });
});
