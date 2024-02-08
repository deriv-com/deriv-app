import { formatTime } from '../orders';

describe('formatTime', () => {
    it('display the formatted time value', () => {
        expect(formatTime(60)).toEqual('1 hour');
        expect(formatTime(45)).toEqual('45 minutes');
        expect(formatTime(90)).toEqual('1 hour 30 minutes');
        expect(formatTime(120)).toEqual('2 hours');
    });
});
