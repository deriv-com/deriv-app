import moment from 'moment';
import { getSelectedTime, getBoundaries } from '../end-time';

describe('getSelectedTime', () => {
    const server_time = moment('2023-11-21T14:30:00');
    let market_open_times = [moment('2023-11-21T08:00:00'), moment('2023-11-21T09:00:00')];
    const market_close_times = [moment('2023-11-21T12:50:00'), moment('2023-11-21T13:50:00')];

    it('returns the closest time in a 5-minute interval when selected time is within market open and close times', () => {
        const selected_time = moment('2023-11-21T12:45:00');
        const result = getSelectedTime(server_time, selected_time, market_open_times, market_close_times);
        expect(result).toBe('12:45');
    });
    it('returns the closest time in a 5-minute interval when selected time not in between market open and close times', () => {
        const selected_time = moment('2023-11-21T15:30:00');
        const result = getSelectedTime(server_time, selected_time, market_open_times, market_close_times);
        expect(result).toBe('14:30');
    });
    it('returns the closest time opening time in a 5-minute interval when market_opening time is after server_time', () => {
        const selected_time = moment('2023-11-21T11:00:00');
        market_open_times = [moment('2023-11-21T15:00:00'), moment('2023-11-21T16:00:00')];
        const result = getSelectedTime(server_time, selected_time, market_open_times, market_close_times);
        expect(result).toBe('15:00');
    });
});

describe('getBoundaries', () => {
    const market_open_times = [moment.utc('2023-12-15T09:00:00'), moment.utc('2023-12-15T10:00:00')];
    const market_close_times = [moment.utc('2023-12-15T16:00:00'), moment.utc('2023-12-15T17:00:00')];
    it('returns correct boundaries when server_time is before market_open_times', () => {
        const server_time = moment.utc('2023-12-15T08:00:00');
        const result = getBoundaries(server_time, market_open_times, market_close_times);

        expect(result.start).toHaveLength(market_open_times.length);
        expect(result.start[0]).not.toEqual(server_time);
        expect(result.end).toEqual(market_close_times);
    });
    it('returns correct boundaries when start boundaries length is greater than 0', () => {
        const server_time = moment.utc('2023-12-15T09:00:00');
        const result = getBoundaries(server_time, market_open_times, market_close_times);

        expect(result.start).toHaveLength(market_open_times.length);
        expect(result.start[0]).toEqual(server_time);
        expect(result.end).toEqual(market_close_times);
    });
});
