import { Fragment, useState } from 'react';
import { Localize, useTranslations } from '@deriv-com/translations';
import SentEmailModal from '../../../Components/sent-email-modal';
import { Text } from '@deriv/components';
import { useMutation } from '@deriv/api';
import { observer, useStore } from '@deriv/stores';
import { Divider } from '@deriv-com/ui';
import { CFD_PLATFORMS } from '@deriv/shared';
import EmailPasswordSection from './email-password-section';

const DerivMt5Password = observer(() => {
    const { localize } = useTranslations();
    const [is_sent_email_modal_open, setIsSentEmailModalOpen] = useState(false);
    const { mutate } = useMutation('verify_email');
    const {
        client: { email },
    } = useStore();

    const onClickSendEmail = () => {
        mutate({
            payload: {
                verify_email: email,
                type: 'trading_platform_mt5_password_reset',

                url_parameters: {
                    redirect_to: 3,
                },
            },
        });

        setIsSentEmailModalOpen(true);
    };

    return (
        <Fragment>
            <div className='account__passwords-wrapper'>
                <Divider className='account__divider' />
                <EmailPasswordSection
                    title={localize('Deriv MT5 password')}
                    title_icon='deriv_mt5_password'
                    description={
                        <Localize
                            i18n_default_text='Use your <0>Deriv MT5 password</0> to log in to your Deriv MT5 accounts on the desktop, web and mobile apps.'
                            components={[<Text as='span' weight='bold' key={0} />]}
                        />
                    }
                    onClick={onClickSendEmail}
                    button_text={localize('Change password')}
                />
                <SentEmailModal
                    is_open={is_sent_email_modal_open}
                    onClose={() => setIsSentEmailModalOpen(false)}
                    identifier_title={CFD_PLATFORMS.MT5}
                    onClickSendEmail={onClickSendEmail}
                    is_modal_when_mobile={true}
                />
            </div>
        </Fragment>
    );
});

export default DerivMt5Password;
