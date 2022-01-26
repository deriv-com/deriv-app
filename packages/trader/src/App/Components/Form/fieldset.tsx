import classNames from 'classnames';
import React from 'react';
import { Popover } from '@deriv/components';

type FieldsetProps = {
    children: React.ReactNode;
    className: string;
    header: unknown | string;
    header_tooltip: unknown | string;
    onMouseEnter: () => void;
    onMouseLeave: () => void;
};

const Fieldset = ({
    children,
    className,
    header,
    header_tooltip,
    is_center,
    onMouseEnter,
    onMouseLeave,
}: FieldsetProps) => {
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
                        <Popover
                            alignment='left'
                            icon='info'
                            is_bubble_hover_enabled
                            message={header_tooltip}
                            margin={216}
                            relative_render
                        />
                    )}
                </div>
            )}
            {children}
        </fieldset>
    );
};

export default Fieldset;
