import React from 'react';
import { Popover } from '@deriv/components';
import { TPopoverProps } from '@deriv/components/src/components/types';
import { isMobile } from '@deriv/shared';

/**
 * A component that renders a popover with an info icon.
 *
 * @param {TPopoverProps} props - Props for the popover component.
 * @returns React.ReactElement - A React component.
 */
export const FormFieldInfo = (props: Omit<TPopoverProps, 'alignment'>) => {
    const [is_open, setIsOpen] = React.useState(false);
    const ref = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        // Close popover when clicking outside of it
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (ref.current && !ref.current.contains(target)) {
                setIsOpen(false);
            }
        };
        // Bind the event listener to the document so it can listen for events that happen outside of the component
        document.addEventListener('click', handleClickOutside, true);
        return () => {
            // Unbind the event listener on clean up when component unmounts
            document.removeEventListener('click', handleClickOutside, true);
        };
    }, []);

    return (
        <div ref={ref}>
            <Popover
                {...props}
                data_testid='dt_form-field-info__popover'
                className='form-field-info__popover'
                icon='info'
                disable_message_icon
                zIndex='9999'
                is_open={is_open}
                onClick={() => setIsOpen(prev_is_open => !prev_is_open)}
                alignment={isMobile() ? 'left' : 'right'}
            />
        </div>
    );
};
