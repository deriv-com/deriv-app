import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import Button from '../button/button';

const FormCancelButton = ({ className, is_center, is_disabled, is_absolute, label, onCancel, ...props }) => {
    return (
        <div
            className={classNames('dc-form-cancel-button', className, {
                'dc-form-cancel-button--absolute': is_absolute,
                'dc-form-cancel-button--center': !!is_center,
                'dc-form-cancel-button--relative': !is_absolute,
            })}
        >
            <Button has_effect onClick={onCancel} text={label} type='button' tertiary large {...props} />
        </div>
    );
};

FormCancelButton.defaultProps = {
    className: undefined,
    is_disabled: false,
    is_center: false,
    is_absolute: false,
};

FormCancelButton.propTypes = {
    className: PropTypes.string,
    is_absolute: PropTypes.bool,
    is_center: PropTypes.bool,
    is_disabled: PropTypes.bool,
    label: PropTypes.string,
    onCancel: PropTypes.func,
};

export default FormCancelButton;
