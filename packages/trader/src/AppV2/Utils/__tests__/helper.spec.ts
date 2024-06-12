import moment from 'moment';
import { TGetCardLables } from '@deriv/components';
import { formatDuration, getDiffDuration } from '@deriv/shared';
import { getRemainingTime } from '../helper';

jest.mock('@deriv/shared', () => ({
    formatDuration: jest.fn(),
    getDiffDuration: jest.fn(),
}));

describe('getRemainingTime', () => {
    const mockGetCardLabels: TGetCardLables = jest.fn(() => ({
        DAYS: 'days',
        DAY: 'day',
    }));

    it('should return undefined if end_time is not provided', () => {
        const result = getRemainingTime({
            end_time: undefined,
            start_time: moment(),
            format: 'mm:ss',
            getCardLabels: mockGetCardLabels,
        });

        expect(result).toBeUndefined();
    });

    it('should return undefined if start_time is greater than end_time', () => {
        const result = getRemainingTime({
            end_time: moment().subtract(1, 'day').unix(),
            start_time: moment(),
            format: 'mm:ss',
            getCardLabels: mockGetCardLabels,
        });

        expect(result).toBeUndefined();
    });

    it('should return remaining time in correct format when days are 0', () => {
        (getDiffDuration as jest.Mock).mockReturnValue(3600);
        (formatDuration as jest.Mock).mockReturnValue({ days: 0, timestamp: '01:00:00' });

        const result = getRemainingTime({
            end_time: moment().add(1, 'hour').unix(),
            start_time: moment(),
            format: 'HH:mm:ss',
            getCardLabels: mockGetCardLabels,
        });

        expect(result).toBe('01:00:00');
    });

    it('should return remaining time with days in correct format', () => {
        (getDiffDuration as jest.Mock).mockReturnValue(90000);
        (formatDuration as jest.Mock).mockReturnValue({ days: 1, timestamp: '01:00:00' });

        const result = getRemainingTime({
            end_time: moment().add(1, 'day').add(1, 'hour').unix(),
            start_time: moment(),
            format: 'HH:mm:ss',
            getCardLabels: mockGetCardLabels,
        });

        expect(result).toBe('1 day 01:00:00');
    });

    it('should return remaining time with plural days in correct format', () => {
        (getDiffDuration as jest.Mock).mockReturnValue(180000);
        (formatDuration as jest.Mock).mockReturnValue({ days: 2, timestamp: '02:00:00' });

        const result = getRemainingTime({
            end_time: moment().add(2, 'days').add(2, 'hours').unix(),
            start_time: moment(),
            format: 'HH:mm:ss',
            getCardLabels: mockGetCardLabels,
        });

        expect(result).toBe('2 days 02:00:00');
    });
});
