import { Fragment, useState } from 'react';
import { useVerifyEmail } from '@deriv/api';
import { Button, Icon, Text } from '@deriv/components';
import { getBrandWebsiteName, getPlatformSettings, toTitleCase } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { useTranslations } from '@deriv-com/translations';
import SentEmailModal from '../../../Components/sent-email-modal';
import PlatformDescription from './platform-description';
import EmailPasswordTitle from './email-password-title';
import { Divider } from '@deriv-com/ui';
import { SocialAppleBlackIcon, SocialFacebookBrandIcon, SocialGoogleBrandIcon } from '@deriv/quill-icons';

/**
 * Displays a change password button and with instructions on how to change the password.
 * @name DerivPassword
 * @returns {React.ReactNode}
 */
const DerivPassword = observer(() => {
    const { localize } = useTranslations();
    const {
        traders_hub: { is_eu_user, financial_restricted_countries },
        client: { email },
    } = useStore();
    const { mutate } = useVerifyEmail();

    const social_identity_provider = 'apple';
    const is_social_signup = true;

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
        return is_social_signup && social_identity_provider ? Icon[social_identity_provider] : null;
    };

    const capitalized_identifier = social_identity_provider ? toTitleCase(social_identity_provider) : '';
    const brand_website_name = getBrandWebsiteName();
    const platform_name_dbot = getPlatformSettings('dbot').name;
    const platform_name_go = getPlatformSettings('go').name;
    const platform_name_smarttrader = getPlatformSettings('smarttrader').name;
    const platform_name_trader = getPlatformSettings('trader').name;
    const platform_name_ctrader = getPlatformSettings('ctrader').name;
    const platform_values = {
        platform_name_trader,
        platform_name_dbot,
        platform_name_smarttrader,
        platform_name_go,
        platform_name_ctrader,
    };

    return (
        <Fragment>
            <EmailPasswordTitle icon='deriv_password' title={localize('Deriv password')} />
            <div className='account__passwords-wrapper'>
                <Fragment>
                    <Text as='p' className='passwords-platform__desc' color='prominent' size='xs'>
                        <PlatformDescription
                            brand_website_name={brand_website_name}
                            platform_values={platform_values}
                            is_eu_user={is_eu_user}
                            financial_restricted_countries={financial_restricted_countries}
                        />
                    </Text>
                </Fragment>
                <Button
                    className='account__passwords-footer-btn'
                    type='button'
                    onClick={onClickSendEmail}
                    has_effect
                    text={getButtonText()}
                    icon={getButtonIcon()}
                    secondary
                    large
                />
                <SentEmailModal
                    is_open={is_sent_email_modal_open}
                    onClose={() => setIsSentEmailModalOpen(false)}
                    identifier_title={capitalized_identifier}
                    onClickSendEmail={onClickSendEmail}
                    is_modal_when_mobile={true}
                />
                <Divider className='account__divider' />
            </div>
        </Fragment>
    );
});

export default DerivPassword;
