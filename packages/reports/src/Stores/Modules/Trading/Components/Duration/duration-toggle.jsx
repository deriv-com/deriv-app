import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import { Icon } from '@deriv/components';
import { localize } from '@deriv/translations';

const DurationToggle = ({ name, onChange, value }) => {
    const toggle = () => {
        onChange({ target: { value: !value, name } });
    };
    const icon_className = classNames('advanced-simple-toggle__icon', 'select-arrow', {
        'advanced-simple-toggle__icon--active': value,
    });
    return (
        <>
            <button
                id={value ? 'dt_advanced_toggle' : 'dt_simple_toggle'}
                className='advanced-simple-toggle'
                onClick={toggle}
                aria-label={localize('Toggle between advanced and simple duration settings')}
            >
                <Icon
                    icon='IcChevronDown'
                    className={icon_className}
                    classNamePath={'advanced-simple-toggle__icon-path'}
                />
            </button>
        </>
    );
};

DurationToggle.propTypes = {
    name: PropTypes.string,
    onChange: PropTypes.func,
    value: PropTypes.bool,
};

export default DurationToggle;
