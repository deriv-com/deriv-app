import { getUnitMap, formatResetDuration } from '../details';

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

describe('formatResetDuration', () => {
    it('should return correct reset time if duration is 2 hours', () => {
        const contract_info_mock = {
            date_expiry: 1698850564,
            date_start: 1698843364,
        } as Parameters<typeof formatResetDuration>[0];
        expect(formatResetDuration(contract_info_mock)).toEqual('1 hour');
    });
    it('should return correct reset time if duration is 1 hour', () => {
        const contract_info_mock = {
            date_expiry: 1698848317,
            date_start: 1698844717,
        } as Parameters<typeof formatResetDuration>[0];
        expect(formatResetDuration(contract_info_mock)).toEqual('30 minutes');
    });
    it('should return correct reset time if duration is 1 minute', () => {
        const contract_info_mock = {
            date_expiry: 1698844953,
            date_start: 1698844893,
        } as Parameters<typeof formatResetDuration>[0];
        expect(formatResetDuration(contract_info_mock)).toEqual('30 seconds');
    });
    it('should return correct reset time if duration is 2 minutes', () => {
        const contract_info_mock = {
            date_expiry: 1698845083,
            date_start: 1698844963,
        } as Parameters<typeof formatResetDuration>[0];
        expect(formatResetDuration(contract_info_mock)).toEqual('1 minute');
    });
    it('should return correct reset time if duration is 3 minutes', () => {
        const contract_info_mock = {
            date_expiry: 1698845322,
            date_start: 1698845142,
        } as Parameters<typeof formatResetDuration>[0];
        expect(formatResetDuration(contract_info_mock)).toEqual('1 minutes 30 seconds');
    });
    it('should return correct reset time if duration is 60 minutes', () => {
        const contract_info_mock = {
            date_expiry: 1698848874,
            date_start: 1698845274,
        } as Parameters<typeof formatResetDuration>[0];
        expect(formatResetDuration(contract_info_mock)).toEqual('30 minutes');
    });
    it('should return correct reset time if duration is 110 minutes', () => {
        const contract_info_mock = {
            date_expiry: 1698851951,
            date_start: 1698845351,
        } as Parameters<typeof formatResetDuration>[0];
        expect(formatResetDuration(contract_info_mock)).toEqual('55 minutes');
    });
    it('should return correct reset time if duration is 120 minutes', () => {
        const contract_info_mock = {
            date_expiry: 1698852623,
            date_start: 1698845423,
        } as Parameters<typeof formatResetDuration>[0];
        expect(formatResetDuration(contract_info_mock)).toEqual('1 hour');
    });
    it('should return correct reset time if duration is 20 seconds', () => {
        const contract_info_mock = {
            date_expiry: 1698845527,
            date_start: 1698845507,
        } as Parameters<typeof formatResetDuration>[0];
        expect(formatResetDuration(contract_info_mock)).toEqual('10 seconds');
    });
    it('should return correct reset time if duration is 75 seconds', () => {
        const contract_info_mock = {
            date_expiry: 1698845651,
            date_start: 1698845576,
        } as Parameters<typeof formatResetDuration>[0];
        expect(formatResetDuration(contract_info_mock)).toEqual('37 seconds');
    });
    it('should return correct reset time if duration is 6200 seconds', () => {
        const contract_info_mock = {
            date_expiry: 1698851862,
            date_start: 1698845662,
        } as Parameters<typeof formatResetDuration>[0];
        expect(formatResetDuration(contract_info_mock)).toEqual('51 minutes 40 seconds');
    });
    it('should return correct reset time if duration is 7200 seconds', () => {
        const contract_info_mock = {
            date_expiry: 1698852946,
            date_start: 1698845746,
        } as Parameters<typeof formatResetDuration>[0];
        expect(formatResetDuration(contract_info_mock)).toEqual('1 hour');
    });
});
