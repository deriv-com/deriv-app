import moment from 'moment';
import { isSessionAvailable } from '../start-date';

jest.mock('_common/base/server_time', () => ({
    get: jest.fn(() => ({
        unix: jest.fn(() => 1687046399),
    })),
}));

describe('isSessionAvailable', () => {
    it('should return true if sessions are empty', () => {
        const sessions: { open: moment.Moment; close: moment.Moment }[] | undefined = [];
        const result = isSessionAvailable(sessions);
        expect(result).toBe(true);
    });
    it('should return false if session is not empty', () => {
        const sessions = [{ open: moment('2023-11-21T10:00:00Z'), close: moment('2023-11-21T18:00:00Z') }];
        const result = isSessionAvailable(sessions);
        expect(result).toBe(false);
    });
    it('should return false if compare moment is before current time', () => {
        const sessions = [{ open: moment('2023-11-21T14:00:00Z'), close: moment('2023-11-21T18:00:00Z') }];
        const result = isSessionAvailable(sessions);
        expect(result).toBe(false);
    });

    it('should return false if compare moment is after session close time', () => {
        const sessions = [{ open: moment('2023-11-21T10:00:00Z'), close: moment('2023-11-21T12:00:00Z') }];
        const result = isSessionAvailable(sessions);
        expect(result).toBe(false);
    });
});
