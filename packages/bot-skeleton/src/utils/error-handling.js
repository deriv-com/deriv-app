import { localize } from '@deriv/translations';
import { error_message_map } from './error-config';

const onKeyDownHandleError = observer => {
    if (Blockly.selected !== null) {
        //keyboard gives keyCode 46 and Laptop gives 46
        if (event.keyCode === 8 || event.keyCode === 46) {
            handleError('BLOCK_DELETION', observer);
        }
    }
};

export const removeErrorHandlingEventListener = (type = 'keydown', observer) => {
    document.removeEventListener(type, () => onKeyDownHandleError(observer));
};

export const initErrorHandlingListener = (type = 'keydown', observer) => {
    document.addEventListener(type, () => {
        if (type === 'keydown') onKeyDownHandleError(observer);
    });
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
