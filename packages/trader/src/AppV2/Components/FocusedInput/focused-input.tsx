import React from 'react';

type TFocusedInputProps = {
    focused_ref?: React.RefObject<HTMLInputElement>;
    setIsFocused: React.Dispatch<React.SetStateAction<boolean>>;
};

const FocusedInput = ({ focused_ref, setIsFocused }: TFocusedInputProps) => {
    const input_ref = React.useRef<HTMLInputElement>(null);
    const focus_timeout = React.useRef<ReturnType<typeof setTimeout>>();

    React.useEffect(() => {
        const current_input_ref = input_ref.current;
        if (current_input_ref && focused_ref?.current) {
            // Put this temporary input element as a child of the page <body> and focus on it
            current_input_ref.focus({ preventScroll: true });

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
    }, []);

    return <input className='input--focused' ref={input_ref} />;
};

export default FocusedInput;
