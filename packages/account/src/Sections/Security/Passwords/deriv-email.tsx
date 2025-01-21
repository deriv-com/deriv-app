import { Fragment, useEffect, useState } from 'react';

import { useVerifyEmail } from '@deriv/api';
import { Button, Modal, Text } from '@deriv/components';
import { toTitleCase } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { Localize, useTranslations } from '@deriv-com/translations';

import SentEmailModal from '../../../Components/sent-email-modal';
import UnlinkAccountModal from '../../../Components/unlink-account-modal';

import EmailPasswordSection from './email-password-section';

type TVerifyEmailPayload = Parameters<ReturnType<typeof useVerifyEmail>['mutate']>[0];

/**
 * Display the user's email address and a button to change it.
 * @name DerivEmail
 * @returns { ReactNode }
 */
const DerivEmail = observer(() => {
    const {
        common: { is_from_derivgo },
        client: { social_identity_provider, is_social_signup, email },
    } = useStore();

    const { mutate, isError, error, isSuccess } = useVerifyEmail();
    const { localize } = useTranslations();
    const [is_unlink_account_modal_open, setIsUnlinkAccountModalOpen] = useState(false);
    const [is_send_email_modal_open, setIsSendEmailModalOpen] = useState(false);
    const [is_error_modal_open, setIsErrorModalOpen] = useState(false);

    const payload: TVerifyEmailPayload = { verify_email: email, type: 'request_email' };

    useEffect(() => {
        if (isError) {
            setIsErrorModalOpen(true);
            setIsSendEmailModalOpen(false);
        } else if (isSuccess) {
            setIsSendEmailModalOpen(true);
        }
    }, [isError, error, isSuccess]);

    const onClickChangeEmail = () => {
        if (is_social_signup) {
            setIsUnlinkAccountModalOpen(true);
        } else {
            mutate(payload);
        }
    };

    const onClickSendEmail = () => {
        mutate(payload);
        setIsUnlinkAccountModalOpen(false);
        setIsSendEmailModalOpen(true);
    };

    const onClose = () => {
        setIsErrorModalOpen(false);
    };

    return (
        <Fragment>
            <div className='account__passwords-wrapper'>
                <EmailPasswordSection
                    title={localize('Email address')}
                    title_icon='deriv_email'
                    description={
                        <Localize
                            i18n_default_text='This is the email address associated with your Deriv account. <0>{{ email }}</0>'
                            components={[<Text key={0} as='span' weight='bold' size='xs' />]}
                            values={{ email }}
                        />
                    }
                    should_display_button={!is_from_derivgo}
                    onClick={onClickChangeEmail}
                    button_text={localize('Change email')}
                />
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
            {is_error_modal_open && (
                <Modal
                    is_open={is_error_modal_open}
                    has_close_icon
                    should_header_stick_body
                    title={localize('Email change currently unavailable')}
                    toggleModal={onClose}
                    width='440px'
                    height='200px'
                >
                    <div className='unhandled-error'>
                        <Text className='account__email-error_text' as='p' line_height='xxl'>
                            {error?.code === 'EmailChangeFailP2PActive' ? (
                                <Localize i18n_default_text='Complete P2P orders and deactivate ads to proceed.' />
                            ) : (
                                <Localize i18n_default_text={error?.message} />
                            )}
                        </Text>

                        <Button onClick={onClose} has_effect primary large>
                            <Localize i18n_default_text='OK' />
                        </Button>
                    </div>
                </Modal>
            )}
        </Fragment>
    );
});

export default DerivEmail;
