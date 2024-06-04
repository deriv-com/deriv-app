import React from 'react';
import { Button, Text, Input } from '@deriv/components';
import { useVerifyEmail } from '@deriv/api';
import { toTitleCase } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { Localize, localize } from '@deriv/translations';
import FormSubHeader from '../../../Components/form-sub-header';
import SentEmailModal from '../../../Components/sent-email-modal';
import UnlinkAccountModal from '../../../Components/unlink-account-modal';

type TVerifyEmailPayload = Parameters<ReturnType<typeof useVerifyEmail>['mutate']>[0];

/**
 * Display the user's email address and a button to change it.
 * @name DerivEmail
 * @returns {React.ReactNode}
 */
const DerivEmail = observer(() => {
    const {
        common: { is_from_derivgo },
        client: { social_identity_provider, is_social_signup, email },
    } = useStore();
    const { mutate } = useVerifyEmail();
    const [is_unlink_account_modal_open, setIsUnlinkAccountModalOpen] = React.useState(false);
    const [is_send_email_modal_open, setIsSendEmailModalOpen] = React.useState(false);

    const payload: TVerifyEmailPayload = { verify_email: email, type: 'request_email' };

    const onClickChangeEmail = () => {
        if (is_social_signup) {
            setIsUnlinkAccountModalOpen(true);
        } else {
            mutate(payload);
            setIsSendEmailModalOpen(true);
        }
    };

    const onClickSendEmail = () => {
        mutate(payload);
        setIsUnlinkAccountModalOpen(false);
        setIsSendEmailModalOpen(true);
    };

    return (
        <React.Fragment>
            <FormSubHeader title={localize('Email address')} />
            <div className='account__email-wrapper'>
                <Text as='p' className='email-platform__desc' color='prominent' size='xs' weight='lighter'>
                    <Localize i18n_default_text='This is the email address associated with your Deriv account.' />
                </Text>
                <div className='email-platform__content'>
                    <fieldset className='email-platform__content__fieldset'>
                        <Input
                            className='email-input'
                            data-lpignore='true'
                            type='text'
                            name='email'
                            id='email'
                            label={localize('Email address*')}
                            value={email}
                            disabled={true}
                        />
                    </fieldset>
                    {!is_from_derivgo && (
                        <Button
                            className='email-change_button'
                            type='button'
                            onClick={onClickChangeEmail}
                            has_effect
                            is_disabled={false}
                            is_loading={false}
                            text={localize('Change email')}
                            large
                            primary
                        />
                    )}
                </div>
                <UnlinkAccountModal
                    is_open={is_unlink_account_modal_open}
                    onClose={() => setIsUnlinkAccountModalOpen(false)}
                    identifier_title={toTitleCase(social_identity_provider)}
                    onClickSendEmail={onClickSendEmail}
                />
                <SentEmailModal
                    is_open={is_send_email_modal_open}
                    onClose={() => setIsSendEmailModalOpen(false)}
                    identifier_title={'Change_Email'}
                    onClickSendEmail={() => mutate({ verify_email: email, type: 'request_email' })}
                    has_live_chat={true}
                    is_modal_when_mobile={true}
                />
            </div>
        </React.Fragment>
    );
});

export default DerivEmail;
