import PropTypes        from 'prop-types';
import React            from 'react';
import {
    PasswordInput,
    PasswordMeter }     from 'deriv-components';
import {
    Localize,
    localize  }         from 'deriv-translations';

const MT5PasswordContainer = ({
    value,
    onChange,
    error,
    onBlur,
    className,
}) => {
    return (
        <div className={className}>
            <div
                className='dc-modal__container_mt5-password-modal__body'
            >
                <div className='input-element'>
                    <PasswordMeter
                        input={value}
                        error={error}
                    >
                        <PasswordInput
                            autoComplete='password'
                            label={localize('MT5 Password')}
                            name='password'
                            value={value}
                            onBlur={onBlur}
                            onChange={onChange}
                        />
                    </PasswordMeter>
                </div>
                <div
                    className='dc-modal__container_mt5-password-modal__description'
                >
                    <p>
                        <Localize
                            i18n_default_text='Strong passwords contain at least 8 characters, combine uppercase and lowercase letters with numbers'
                        />
                    </p>
                </div>
            </div>
        </div>
    );
};

MT5PasswordContainer.defaultProps = {
    className: '',
    value    : '',
    validate : () => true,
    onChange : () => (undefined),
    onBlur   : () => (undefined),
    error    : '',
};

MT5PasswordContainer.propTypes = {
    error   : PropTypes.string,
    onBlur  : PropTypes.func,
    onChange: PropTypes.func,
    validate: PropTypes.func,
    value   : PropTypes.string,
};

export default MT5PasswordContainer;
