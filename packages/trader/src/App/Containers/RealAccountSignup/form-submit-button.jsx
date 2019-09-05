import classNames from 'classnames';
import { Button } from 'deriv-components';
import PropTypes  from 'prop-types';
import React      from 'react';
import Localize   from 'App/Components/Elements/localize.jsx';

const FormSubmitButton = ({
    cancel_label,
    has_cancel,
    form_error,
    is_center,
    is_disabled,
    is_absolute,
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
                className={'account-wizard__btn account-wizard__btn--cancel'}
                onClick={onCancel}
            >
                <Localize i18n_default_text={cancel_label} />
            </Button>
            }
            <Button
                type='submit'
                is_disabled={is_disabled}
                className={classNames('account-wizard__btn', {
                    'account-wizard__btn--disabled': is_disabled,
                })}
            >
                <Localize i18n_default_text={label} />
            </Button>
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
