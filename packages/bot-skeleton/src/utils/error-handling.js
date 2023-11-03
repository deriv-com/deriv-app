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
            if (error_message_map[Blockly.selected.type]) {
                observer.emit('ui.log.error', error_message_map[Blockly.selected.type]?.default);
            }
            break;
        default:
            break;
    }
};
