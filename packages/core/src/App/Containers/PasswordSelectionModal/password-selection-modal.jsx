import classNames from 'classnames';
import { Field } from 'formik';
import React from 'react';
import { Button, PasswordInput, PasswordMeter, Text } from '@deriv/components';
import { getErrorMessages, redirectToSignUp } from '@deriv/shared';
import { localize, Localize } from '@deriv/translations';
import SignupSeparatorContainer from '../AccountSignupModal/signup-separator-container.jsx';
import 'Sass/app/modules/account-signup.scss';

const PasswordSelectionModal = ({
    api_error,
    errors,
    handleBlur,
    handleChange,
    is_appstore,
    isModalVisible,
    isSubmitting,
    touched,
    pw_input,
    setFieldTouched,
    updatePassword,
    values,
}) => (
    <div className='account-signup__password-selection'>
        <Text as='p' weight='bold' className='account-signup__heading' align='center'>
            <Localize i18n_default_text='Keep your account secure with a password' />
        </Text>
        <Field name='password'>
            {({ field }) => (
                <PasswordMeter
                    input={pw_input}
                    has_error={!!(touched.password && errors.password)}
                    custom_feedback_messages={getErrorMessages().password_warnings}
                >
                    <PasswordInput
                        {...field}
                        autoComplete='new-password'
                        className='account-signup__password-field'
                        label={localize('Create a password')}
                        error={touched.password && errors.password}
                        required
                        value={values.password}
                        onBlur={handleBlur}
                        onChange={e => {
                            const input = e.target;
                            setFieldTouched('password', true);
                            if (input) updatePassword(input.value);
                            handleChange(e);
                        }}
                        input_id='dt_core_account-signup-modal_account-signup-password-field'
                    />
                </PasswordMeter>
            )}
        </Field>

        <Text as='p' size='xxs' className='account-signup__subtext' align='center'>
            <Localize i18n_default_text='Strong passwords contain at least 8 characters, combine uppercase and lowercase letters, numbers, and symbols.' />
        </Text>
        <SignupSeparatorContainer />
        {api_error ? (
            <React.Fragment>
                <Text
                    as='p'
                    size='xxs'
                    color='loss-danger'
                    className='account-signup__subtext account-signup__subtext--error'
                    align='center'
                >
                    {api_error}
                </Text>
                <div className='account-signup__error-wrapper'>
                    <Button
                        large
                        secondary
                        text={localize('Cancel')}
                        type='button'
                        onClick={() => isModalVisible(false)}
                    />
                    <div>
                        <Button
                            large
                            primary
                            text={localize('Create new account')}
                            type='button'
                            onClick={() => redirectToSignUp({ is_appstore })}
                        />
                    </div>
                </div>
            </React.Fragment>
        ) : (
            <div className='account-signup__footer'>
                <Button
                    className={classNames('account-signup__btn', {
                        'account-signup__btn--disabled': !values.password || errors.password || isSubmitting,
                    })}
                    id='dt_core_account-signup-modal_submit-btn'
                    type='submit'
                    is_disabled={!values.password || !!errors.password || isSubmitting}
                    text={localize('Start trading')}
                    large
                    primary
                />
            </div>
        )}
    </div>
);

export default PasswordSelectionModal;
