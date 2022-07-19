import React from 'react';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import { WS } from '@deriv/shared';
import { Localize, localize } from '@deriv/translations';
import { Button, Text, Input } from '@deriv/components';
import FormSubHeader from 'Components/form-sub-header';
import SentEmailModal from 'Components/sent-email-modal';

const DerivEmail = ({ email }) => {
    const [is_send_email_modal_open, setIsSendEmailModalOpen] = React.useState(false);

    const onClickChangeEmail = () => {
        // Todo: will add the condition to check if it's social account and wants to be unlinked
        WS.verifyEmail(email, 'request_email');
        setIsSendEmailModalOpen(true);
    };

    const onClickResendEmail = () => {
        WS.verifyEmail(email, 'request_email');
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
                                label={localize('Email address')}
                                value={email}
                                disabled={true}
                            />
                        </fieldset>
                    </Formik>
                    <Button
                        className='email-change_button'
                        type='submit'
                        onClick={onClickChangeEmail}
                        has_effect
                        is_disabled={false}
                        is_loading={false}
                        text={localize('Change email')}
                        large
                        primary
                    />
                </div>
                <SentEmailModal
                    is_open={is_send_email_modal_open}
                    onClose={() => setIsSendEmailModalOpen(false)}
                    identifier_title={'Change_Email'}
                    onClickSendEmail={onClickResendEmail}
                    has_live_chat={true}
                    is_modal_when_mobile={true}
                />
            </div>
        </React.Fragment>
    );
};

DerivEmail.propTypes = {
    email: PropTypes.string,
};

export default DerivEmail;
