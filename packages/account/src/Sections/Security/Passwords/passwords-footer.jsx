import React from 'react';
import { localize } from '@deriv/translations';
import { FormSubmitErrorMessage, Button } from '@deriv/components';
import { isMobile } from '@deriv/shared';

const PasswordsFooter = ({
    errors,
    is_btn_loading,
    is_set_trade_password,
    is_submit_success,
    isSubmitting,
    onClickSendEmail,
    status,
    values,
}) => (
    <React.Fragment>
        {isMobile() && status?.msg && (
            <FormSubmitErrorMessage className='account-form__error-message' message={status.msg} />
        )}
        <div className='account__passwords-footer'>
            {!isMobile() && status?.msg && <FormSubmitErrorMessage message={status.msg} />}
            {is_set_trade_password ? (
                <Button
                    className='account__passwords-footer-btn'
                    green={is_submit_success}
                    type='submit'
                    is_disabled={isSubmitting || !!(errors.new_password || !values.new_password)}
                    is_loading={is_btn_loading}
                    is_submit_success={is_submit_success}
                    has_effect
                    text={localize('Set trading password')}
                    primary
                    large
                />
            ) : (
                <React.Fragment>
                    <Button
                        className='account__passwords-footer-btn'
                        type='button'
                        onClick={onClickSendEmail}
                        text={localize('Forgot password')}
                        tertiary
                        large
                    />
                    <Button
                        className='account__passwords-footer-btn'
                        green={is_submit_success}
                        type='submit'
                        is_disabled={
                            isSubmitting ||
                            !!(
                                errors.new_password ||
                                !values.new_password ||
                                errors.old_password ||
                                !values.old_password
                            )
                        }
                        is_loading={is_btn_loading}
                        is_submit_success={is_submit_success}
                        has_effect
                        text={localize('Change password')}
                        primary
                        large
                    />
                </React.Fragment>
            )}
        </div>
    </React.Fragment>
);

export default PasswordsFooter;
