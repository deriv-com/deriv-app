import { Fragment, useState } from 'react';
import { Localize, useTranslations } from '@deriv-com/translations';
import SentEmailModal from '../../../Components/sent-email-modal';
import { Text } from '@deriv/components';
import { useMutation } from '@deriv/api';
import { observer, useStore } from '@deriv/stores';
import { CFD_PLATFORMS } from '@deriv/shared';
import EmailPasswordSection from './email-password-section';

const DerivXPassword = observer(() => {
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
                type: 'trading_platform_dxtrade_password_reset',

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
                <EmailPasswordSection
                    title={localize('Deriv X password')}
                    title_icon='deriv_x_password'
                    description={
                        <Localize
                            i18n_default_text='Use your <0>Deriv X password</0> to log in to your Deriv X accounts on the web and mobile apps.'
                            components={[<Text as='span' weight='bold' key={0} />]}
                        />
                    }
                    onClick={onClickSendEmail}
                    button_text={localize('Change password')}
                />
                <SentEmailModal
                    is_open={is_sent_email_modal_open}
                    onClose={() => setIsSentEmailModalOpen(false)}
                    identifier_title={CFD_PLATFORMS.DXTRADE}
                    onClickSendEmail={onClickSendEmail}
                    is_modal_when_mobile={true}
                />
            </div>
        </Fragment>
    );
});

export default DerivXPassword;
