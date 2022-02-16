import React from 'react';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import { Button, Text, Input } from '@deriv/components';
import { WS } from '@deriv/shared';
import { Localize, localize } from '@deriv/translations';
import FormSubHeader from 'Components/form-sub-header';
import SentEmailModal from 'Components/sent-email-modal';

const DerivEmail = ({ email }) => {
    const [is_sent_email_modal_open, setIsSentEmailModalOpen] = React.useState(false);

    const onClickResendEmail = () => {
        WS.verifyEmail(email, 'request_email');
        // setIsSentEmailModalOpen(false);
    };

    const onClickSendEmail = () => {
        WS.verifyEmail(email, 'request_email');
        setIsSentEmailModalOpen(true);
    };

    return (
        <React.Fragment>
            <FormSubHeader title={localize('Email address')} />
            <div className='account__email-wrapper'>
                <React.Fragment>
                    <Text as='p' className='email-platform__desc' color='prominent' size='xs' weight='lighter'>
                        <Localize i18n_default_text='This is the email address associated with your Deriv account.' />
                    </Text>
                </React.Fragment>
                <div className='email-platform__content'>
                    <Formik>
                        <fieldset className='email-platform__content__fieldset'>
                            <Input
                                className='email-input'
                                data-lpignore='true'
                                type='text'
                                name='email'
                                id={'email'}
                                label={localize('Email address*')}
                                value={email}
                                disabled={true}
                            />
                        </fieldset>
                    </Formik>
                    <Button
                        className='email-change_-button'
                        type='submit'
                        onClick={onClickSendEmail}
                        has_effect
                        is_disabled={false}
                        is_loading={false}
                        text={localize('Change email')}
                        large
                        primary
                    />
                </div>
                <SentEmailModal
                    is_open={is_sent_email_modal_open}
                    onClose={() => setIsSentEmailModalOpen(false)}
                    identifier_title={'Change_Email'}
                    onClickSendEmail={onClickResendEmail}
                />
            </div>
        </React.Fragment>
    );
};

DerivEmail.propTypes = {
    email: PropTypes.string,
    is_dark_mode_on: PropTypes.bool,
    is_social_signup: PropTypes.bool,
    social_identity_provider: PropTypes.string,
};

export default DerivEmail;
