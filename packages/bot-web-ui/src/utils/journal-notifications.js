import { localize } from '@deriv/translations';
import { messageWithButton } from '../components/notify-item.jsx';

const showErrorMessageWithButton = (message, block_id, showErrorMessage, centerAndHighlightBlock) => {
    showErrorMessage(
        messageWithButton({
            unique_id: block_id,
            type: 'error',
            message: message,
            btn_text: localize('Go to block'),
            onClick: () => {
                centerAndHighlightBlock();
            },
        })
    );
};

export const validateJournalMessageWithButton = (
    { message, block_id, variable_name },
    showErrorMessage,
    centerAndHighlightBlock
) => {
    // notify undefined variable block
    if (message === undefined && variable_name != null) {
        showErrorMessageWithButton(
            localize(
                "Variable '{{variable_name}}' has no value. Please set a value for variable '{{variable_name}}' to notify.",
                { variable_name }
            ),
            block_id,
            showErrorMessage,
            centerAndHighlightBlock
        );
        return true;
    }
    // notify operations represented by NaN
    if (isNaN(message)) {
        showErrorMessageWithButton(
            localize('Tried to perform an invalid operation.'),
            block_id,
            showErrorMessage,
            centerAndHighlightBlock
        );
        return true;
    }
    return false;
};
