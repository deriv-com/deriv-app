import classNames          from 'classnames';
import PropTypes           from 'prop-types';
import React, { Fragment } from 'react';
import Icon                from 'Assets/icon.jsx';

const DurationToggle = ({
    name,
    onChange,
    value,
}) => {
    const toggle = () => {
        onChange({ target: { value: !value, name } });
    };
    return (
        <Fragment>
            <button
                id={value ? 'dt_advanced_toggle' : 'dt_simple_toggle'}
                className={classNames('advanced-simple-toggle', {
                    'advanced-simple-toggle--active': value,
                })}
                onClick={toggle}
            >
                <Icon icon='IconChevronLeft' className='advanced-simple-toggle__icon select-arrow' />
            </button>
        </Fragment>);
};

DurationToggle.propTypes = {
    name    : PropTypes.string,
    onChange: PropTypes.func,
    value   : PropTypes.bool,
};

export default DurationToggle;
