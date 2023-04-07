import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { Popover } from '@deriv/components';

const Fieldset = ({
    children,
    className,
    header,
    header_tooltip,
    is_center,
    is_tooltip_disabled,
    onMouseEnter,
    onMouseLeave,
}) => {
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
                            disable_target_icon={is_tooltip_disabled}
                        />
                    )}
                </div>
            )}
            {children}
        </fieldset>
    );
};

// ToDo:
// - Refactor Last Digit to keep the children as array type.
//   Currently last_digit.jsx returns object (React-Element) as 'children'
//   props type.
Fieldset.propTypes = {
    children: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    className: PropTypes.string,
    header: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    header_tooltip: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    is_center: PropTypes.bool,
    is_tooltip_disabled: PropTypes.bool,
    onMouseEnter: PropTypes.func,
    onMouseLeave: PropTypes.func,
};

export default Fieldset;
