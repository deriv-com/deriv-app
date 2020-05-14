import { localize } from '@deriv/translations';
import { messageWithButton, arrayAsMessage } from '../components/notify-item.jsx';

const showErrorMessageWithButton = (message, block_id, showErrorMessage, centerAndHighlightBlock) => {
    showErrorMessage(
        messageWithButton({
            unique_id: block_id,
            type: 'error',
            message,
            btn_text: localize('Go to block'),
            onClick: () => {
                centerAndHighlightBlock();
            },
        })
    );
};

export const validateJournalMessage = (
    { message, block_id, variable_name },
    showErrorMessage,
    centerAndHighlightBlock,
    pushMessage
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
    // notify list block
    if (Array.isArray(message)) {
        const parsedArray = {
            header: message.length,
            content: parseArray(message),
        };
        pushMessage(arrayAsMessage(parsedArray));
        return true;
    }
    // notify boolean results
    if (typeof message === 'boolean') {
        pushMessage(message.toString());
        return true;
    }

    return false;
};

const parseArray = message => {
    return message.map(item => {
        return {
            id: new Date().getTime() * Math.random(),
            value: Array.isArray(item) ? parseArray(item) : item,
        };
    });
};
