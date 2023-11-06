import { journalError } from '../bot-notifications';

describe('journalError function', () => {
    it('Should return the correct error object', () => {
        const mockOnClick = jest.fn();
        const error = journalError(mockOnClick);

        expect(error.key).toBe('bot_error');
        expect(error.header).toBe('The bot encountered an error while running.');
        expect(error.action.text).toBe('View in Journal');
        expect(error.type).toBe('danger');

        error.action.onClick();
        expect(mockOnClick).toHaveBeenCalledTimes(1);
    });
});
