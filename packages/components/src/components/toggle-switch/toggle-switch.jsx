import * as React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const ToggleSwitch = ({ className, classNameButton, classNameLabel, handleToggle, id, is_enabled }) => {
    return (
        <React.Fragment>
            <input
                className={classNames('dc-toggle-switch', className)}
                id={id}
                type='checkbox'
                checked={is_enabled}
                onChange={handleToggle}
            />
            <label className={classNames('dc-toggle-switch__label', classNameLabel)} htmlFor={id}>
                <span className={classNames('dc-toggle-switch__button', classNameButton)} />
            </label>
        </React.Fragment>
    );
};

ToggleSwitch.propTypes = {
    className: PropTypes.string,
    classNameButton: PropTypes.string,
    classNameLabel: PropTypes.string,
    handleToggle: PropTypes.func.isRequired,
    id: PropTypes.string.isRequired,
    is_enabled: PropTypes.bool.isRequired,
};

export default ToggleSwitch;
