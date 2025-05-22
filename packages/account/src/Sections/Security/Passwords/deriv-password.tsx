import { Fragment, useState } from 'react';
import { useVerifyEmail } from '@deriv/api';
import { toTitleCase } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { useTranslations } from '@deriv-com/translations';
import SentEmailModal from '../../../Components/sent-email-modal';
import PlatformDescription from './platform-description';
import { Divider } from '@deriv-com/ui';
import { SocialAppleBlackIcon, SocialFacebookBrandIcon, SocialGoogleBrandIcon } from '@deriv/quill-icons';
import EmailPasswordSection from './email-password-section';

/**
 * Displays a change password button and with instructions on how to change the password.
 * @name DerivPassword
 * @returns {React.ReactNode}
 */
const DerivPassword = observer(() => {
    const { localize } = useTranslations();
    const {
        client: { social_identity_provider, is_social_signup, email },
    } = useStore();
    const { mutate } = useVerifyEmail();

    const [is_sent_email_modal_open, setIsSentEmailModalOpen] = useState(false);

    const onClickSendEmail = () => {
        if (social_identity_provider === 'apple') {
            mutate({ verify_email: email, type: 'request_email' });
        } else {
            mutate({ verify_email: email, type: 'reset_password' });
        }
        setIsSentEmailModalOpen(true);
    };

    const getButtonText = () => {
        if (is_social_signup && social_identity_provider) {
            return localize('Unlink from {{identifier_title}}', { identifier_title: capitalized_identifier });
        }
        return localize('Change password');
    };

    const getButtonIcon = () => {
        const Icon = {
            apple: <SocialAppleBlackIcon iconSize='xs' />,
            google: <SocialGoogleBrandIcon iconSize='xs' />,
            facebook: <SocialFacebookBrandIcon iconSize='xs' />,
        };
        return is_social_signup && social_identity_provider
            ? Icon[social_identity_provider as keyof typeof Icon]
            : null;
    };

    const capitalized_identifier = social_identity_provider ? toTitleCase(social_identity_provider) : '';

    return (
        <Fragment>
            <div className='account__passwords-wrapper'>
                <Divider className='account__divider' />
                <EmailPasswordSection
                    title={localize('Deriv password')}
                    title_icon='deriv_password'
                    description={<PlatformDescription />}
                    onClick={onClickSendEmail}
                    button_text={getButtonText()}
                    button_icon={getButtonIcon()}
                />
                <SentEmailModal
                    is_open={is_sent_email_modal_open}
                    onClose={() => setIsSentEmailModalOpen(false)}
                    identifier_title={capitalized_identifier}
                    onClickSendEmail={onClickSendEmail}
                    is_modal_when_mobile={true}
                />
            </div>
        </Fragment>
    );
});

export default DerivPassword;
