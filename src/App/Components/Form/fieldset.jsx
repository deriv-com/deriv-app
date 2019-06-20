import classNames from 'classnames';
import PropTypes  from 'prop-types';
import React      from 'react';

const Fieldset = ({
    children,
    className,
    header,
    is_center,
    onMouseEnter,
    onMouseLeave,
}) => {
    const fieldset_header_class = classNames('trade-container__fieldset-header', is_center ? 'center-text' : '');
    const fieldset_info_class   = classNames('trade-container__fieldset-info', !is_center && 'trade-container__fieldset-info--left');

    return (
        <fieldset className={className} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
            {!!header &&
                <div className={fieldset_header_class}>
                    <span className={fieldset_info_class}>{header}</span>
                </div>
            }
            {children}
        </fieldset>
    );
};

// ToDo:
// - Refactor Last Digit to keep the children as array type.
//   Currently last_digit.jsx returns object (React-Element) as 'children'
//   props type.
Fieldset.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.object,
    ]),
    className   : PropTypes.string,
    header      : PropTypes.string,
    onMouseEnter: PropTypes.func,
    onMouseLeave: PropTypes.func,
};

export default Fieldset;
