import { localize } from '@deriv/translations';
import { error_message_map } from './error-config';
import { observer } from './observer';

const onKeyDownHandleError = event => {
    if (Blockly.selected !== null) {
        //keyboard gives keyCode 46 and Laptop gives 8
        if (event.keyCode === 8 || event.keyCode === 46) {
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
                observer.emit('ui.log.error', localize(error_message_map[Blockly.selected.category_]));
            }
            break;
        default:
            break;
    }
};
