import moment from 'moment';
import { isSessionAvailable } from '../start-date';

jest.mock('_common/base/server_time', () => ({
    get: jest.fn(() => 1687046399),
}));

describe('isSessionAvailable', () => {
    it('should return true if sessions are empty', () => {
        const sessions: { open: moment.Moment; close: moment.Moment }[] | undefined = [];
        const result = isSessionAvailable(sessions);
        expect(result).toBeTruthy();
    });
    it('should return false if session is not empty', () => {
        const sessions = [{ open: moment('2023-11-21T10:00:00Z'), close: moment('2023-11-21T18:00:00Z') }];
        const result = isSessionAvailable(sessions);
        expect(result).toBeFalsy();
    });
    it('should return false if compare moment is before current time', () => {
        const sessions = [{ open: moment('2023-11-21T14:00:00Z'), close: moment('2023-11-21T18:00:00Z') }];
        const result = isSessionAvailable(sessions);
        expect(result).toBeFalsy();
    });
    it('should return false if compare moment is after session close time', () => {
        const sessions = [{ open: moment('2023-11-21T10:00:00Z'), close: moment('2023-11-21T12:00:00Z') }];
        const result = isSessionAvailable(sessions);
        expect(result).toBeFalsy();
    });
    it('should returns true when sessions are not empty and within range', () => {
        const sessions = [{ open: moment('2023-12-05T08:00:00'), close: moment('2023-12-05T12:00:00') }];
        const compare_moment = moment('2023-12-05T10:30:00');
        const start_moment = moment('2023-12-05T09:00:00');
        const result = isSessionAvailable(sessions, compare_moment, start_moment, false);
        expect(result).toBeTruthy();
    });
});
