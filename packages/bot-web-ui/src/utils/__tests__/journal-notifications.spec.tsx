import { localize } from '@deriv/translations';
import { render } from '@testing-library/react';
import { messageWithButton } from 'Components/notify-item';
import { isCustomJournalMessage } from '../journal-notifications';

describe('isCustomJournalMessage', () => {
    const centerAndHighlightBlock = jest.fn();
    const showErrorMessage = jest.fn(() =>
        render(
            messageWithButton({
                unique_id: 1,
                type: 'error',
                message: '',
                btn_text: localize('Go to block'),
                onClick: () => {
                    centerAndHighlightBlock();
                },
            })
        )
    );

    const pushMessage = jest.fn();

    beforeEach(() => {
        showErrorMessage.mockClear();
        centerAndHighlightBlock.mockClear();
        pushMessage.mockClear();
    });

    it('should show error message with button when message is undefined and variable_name is not null', () => {
        const message = {
            message: undefined,
            block_id: 123,
            variable_name: 'testVariable',
        };

        isCustomJournalMessage(message, showErrorMessage, centerAndHighlightBlock, pushMessage);

        expect(showErrorMessage).toHaveBeenCalledWith(expect.any(Object));
    });

    it('should show error message with button when message is not undefined and variable_name is null', () => {
        const message = {
            message: [['item1']],
            block_id: 123,
            variable_name: 'null',
        };

        isCustomJournalMessage(message, showErrorMessage, centerAndHighlightBlock, pushMessage);

        expect(pushMessage).toHaveBeenCalled();
    });

    it('should push "NULL" message when message is null', () => {
        const message = {
            message: null,
            block_id: 123,
            variable_name: 'testVariable',
        };

        isCustomJournalMessage(message, showErrorMessage, centerAndHighlightBlock, pushMessage);

        expect(pushMessage).toHaveBeenCalledWith('NULL');
    });

    it('should show error message with button when message is NaN', () => {
        const message = {
            message: NaN,
            block_id: 123,
            variable_name: 'testVariable',
        };

        isCustomJournalMessage(message, showErrorMessage, centerAndHighlightBlock, pushMessage);

        expect(showErrorMessage).toHaveBeenCalledWith(expect.any(Object));
    });

    it('should push array as message when message is an array', () => {
        const message = {
            message: [['item1']],
            block_id: 123,
            variable_name: 'testVariable',
        };

        isCustomJournalMessage(message, showErrorMessage, centerAndHighlightBlock, pushMessage);

        expect(pushMessage).toHaveBeenCalled();
    });

    it('should push boolean value as message when message is a boolean', () => {
        const message = {
            message: true,
            block_id: 123,
            variable_name: 'testVariable',
        };

        isCustomJournalMessage(message, showErrorMessage, centerAndHighlightBlock, pushMessage);

        expect(pushMessage).toHaveBeenCalledWith('true');
    });

    it('should return false when message type is not recognized', () => {
        const message = {
            message: 123,
            block_id: 123,
            variable_name: 'testVariable',
        };

        const result = isCustomJournalMessage(message, showErrorMessage, centerAndHighlightBlock, pushMessage);

        expect(result).toBe(false);
    });
});
