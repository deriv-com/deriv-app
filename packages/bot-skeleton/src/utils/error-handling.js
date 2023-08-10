import { localize } from '@deriv/translations';
import { error_message_map } from './error-config';
import { observer } from './observer';

const onKeyDownHandleError = event => {
    if (Blockly.selected !== null && Blockly.selected.parentBlock_ === null) {
        if (event.key === 'Delete' || event.key === 'Backspace') {
            handleError('BLOCK_DELETION', observer);
        }
    }
};

export const removeErrorHandlingEventListener = (type = 'keydown') => {
    window.removeEventListener(type, onKeyDownHandleError);
};

export const initErrorHandlingListener = (type = 'keydown') => {
    window.addEventListener(type, onKeyDownHandleError);
};

export const handleError = (errorCode, observer) => {
    switch (errorCode) {
        case 'BLOCK_DELETION':
            if (error_message_map[Blockly.selected.category_]) {
                observer.emit(
                    'ui.log.error',
                    localize(
                        error_message_map[Blockly.selected.category_]?.default ||
                            error_message_map[Blockly.selected.category_]
                    )
                );
            }
            break;
        default:
            break;
    }
};
