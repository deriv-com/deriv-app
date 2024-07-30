import React from 'react';
import './focused-input.scss';

type TFocusedInputProps = {
    focused_ref?: React.RefObject<HTMLInputElement>;
};

export const focusAndOpenKeyboard = (
    target_element_ref?: React.RefObject<HTMLInputElement>,
    temporary_input_ref?: React.RefObject<HTMLInputElement>
) => {
    const current_target_element_ref = target_element_ref?.current;
    const current_temporary_input_ref = temporary_input_ref?.current;

    if (current_target_element_ref && current_temporary_input_ref) {
        current_temporary_input_ref.focus({ preventScroll: true });

        return setTimeout(() => {
            current_target_element_ref.focus();
            current_target_element_ref.click();
        }, 300);
    }
};

export const FocusedInput = ({ focused_ref }: TFocusedInputProps) => (
    <input className='input--focused' ref={focused_ref} />
);
