import classNames   from 'classnames';
import { Button }   from 'deriv-components';
import PropTypes    from 'prop-types';
import React        from 'react';

const FormSubmitButton = ({
    cancel_label,
    has_cancel,
    form_error,
    is_center,
    is_disabled,
    is_absolute,
    is_loading,
    label,
    onCancel,
}) => {
    return (
        <div className={classNames('account-wizard__btn-area', {
            'account-wizard__btn-area--absolute': is_absolute,
            'account-wizard__btn-area--center'  : !!is_center,
            'account-wizard__btn-area--relative': !is_absolute,
        })}
        >
            {!!form_error &&
            <p className='account-wizard__btn-area--error'>
                {form_error}
            </p>
            }
            {has_cancel &&
            <Button
                has_effect
                onClick={onCancel}
                text={cancel_label}
                type='button'
                secondary
            />
            }
            <Button
                has_effect
                is_disabled={is_disabled}
                type='submit'
                text={label}
                is_loading={ is_loading }
                primary
            />
        </div>
    );
};

FormSubmitButton.defaultProps = {
    has_cancel : false,
    form_error : '',
    is_disabled: false,
    is_center  : false,
    is_absolute: false,
};

FormSubmitButton.propTypes = {
    has_cancel : PropTypes.bool,
    is_absolute: PropTypes.bool,
    is_center  : PropTypes.bool,
    is_disabled: PropTypes.bool,
    label      : PropTypes.string,
};

export default FormSubmitButton;
