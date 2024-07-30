import React from 'react';

type TFocusedInputProps = {
    focused_ref?: React.RefObject<HTMLInputElement>;
    is_visible?: boolean;
    setIsFocused: React.Dispatch<React.SetStateAction<boolean>>;
};

const FocusedInput = ({ focused_ref, is_visible, setIsFocused }: TFocusedInputProps) => {
    const input_ref = React.useRef<HTMLInputElement>(null);
    const focus_timeout = React.useRef<ReturnType<typeof setTimeout>>();

    React.useEffect(() => {
        if (is_visible && input_ref.current && focused_ref?.current) {
            // Align temporary input element approximately where the real input element is
            // so the cursor doesn't jump around
            input_ref.current.style.top = `${focused_ref.current.offsetTop + 7}px`;
            input_ref.current.style.left = `${focused_ref.current.offsetLeft}px`;

            // Put this temporary input element as a child of the page <body> and focus on it
            input_ref.current.focus();

            clearTimeout(focus_timeout.current);
            // The keyboard is open, so now adding a delayed focus on the target element and remove temporary input element
            focus_timeout.current = setTimeout(() => {
                if (focused_ref?.current) {
                    focused_ref.current.focus();
                    focused_ref.current.click();
                    setIsFocused(false);
                }
            }, 300);
        }
        return () => clearTimeout(focus_timeout.current);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [is_visible, input_ref, focused_ref]);

    return is_visible ? <input className='input--focused' ref={input_ref} /> : null;
};

export default FocusedInput;
