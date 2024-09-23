import classNames from 'classnames';
import React from 'react';
import { Popover } from '@deriv/components';

// ToDo:
// - Refactor Last Digit to keep the children as array type.
//   Currently last_digit.jsx returns object (React-Element) as 'children'
//   props type.
type TFieldset = {
    children?: React.ReactNode[] | React.ReactNode;
    className: string;
    header?: string | React.ReactNode;
    header_tooltip?: string | React.ReactNode;
    is_tooltip_disabled?: boolean;
    is_center?: boolean;
    popover_wrapper_class?: string;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
};

const Fieldset = ({
    children,
    className,
    header,
    header_tooltip,
    is_center,
    is_tooltip_disabled,
    popover_wrapper_class,
    onMouseEnter,
    onMouseLeave,
}: TFieldset) => {
    const fieldset_header_class = classNames('trade-container__fieldset-header', {
        'center-text': is_center,
        'trade-container__fieldset-header--inline': header_tooltip,
    });
    const fieldset_info_class = classNames(
        'trade-container__fieldset-info',
        !is_center && 'trade-container__fieldset-info--left'
    );

    return (
        <fieldset className={className} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
            {!!header && (
                <div className={fieldset_header_class}>
                    <span className={fieldset_info_class}>{header}</span>
                    {header_tooltip && (
                        <span
                            className={classNames({
                                'trade-container__fieldset-header--tooltip-disabled': is_tooltip_disabled,
                                [popover_wrapper_class as string]: !!popover_wrapper_class,
                            })}
                        >
                            <Popover
                                alignment='left'
                                icon='info'
                                is_bubble_hover_enabled
                                message={header_tooltip}
                                margin={216}
                                relative_render
                            />
                        </span>
                    )}
                </div>
            )}
            {children}
        </fieldset>
    );
};

export default Fieldset;
