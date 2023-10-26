import { journalError } from '../bot-notifications';
import { localize } from '@deriv/translations';

describe('journalError function', () => {
    it('Should return the correct error object', () => {
        const mockOnClick = jest.fn();
        const error = journalError(mockOnClick);

        expect(error.key).toBe('bot_error');
        expect(error.header).toBe(localize('The bot encountered an error while running.'));
        expect(error.action.text).toBe(localize('View in Journal'));
        expect(error.type).toBe('danger');

        error.action.onClick();
        expect(mockOnClick).toHaveBeenCalledTimes(1);
    });
});
