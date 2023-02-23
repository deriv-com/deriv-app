import React from 'react';
import PropTypes from 'prop-types';
import { Button, Icon, Popover, Text } from '@deriv/components';
import { getBrandWebsiteName, getPlatformSettings, toTitleCase, WS } from '@deriv/shared';
import { Localize, localize } from '@deriv/translations';
import FormSubHeader from 'Components/form-sub-header';
import SentEmailModal from 'Components/sent-email-modal';
import DerivComLogo from 'Assets/ic-brand-deriv-red.svg';
import DerivGoLight from 'Assets/ic-brand-deriv-go-light.svg';
import DerivGoDark from 'Assets/ic-brand-deriv-go-dark.svg';

const DerivPassword = ({ email, is_dark_mode_on, is_social_signup, social_identity_provider }) => {
    const [is_sent_email_modal_open, setIsSentEmailModalOpen] = React.useState(false);

    const onClickSendEmail = () => {
        if (social_identity_provider === 'apple') {
            WS.verifyEmail(email, 'request_email');
        } else {
            WS.verifyEmail(email, 'reset_password');
        }
        setIsSentEmailModalOpen(true);
    };

    const capitalized_identifier = social_identity_provider ? toTitleCase(social_identity_provider) : '';
    const brand_website_name = getBrandWebsiteName();
    const platform_name_dbot = getPlatformSettings('dbot').name;
    const platform_name_go = getPlatformSettings('go').name;
    const platform_name_smarttrader = getPlatformSettings('smarttrader').name;
    const platform_name_trader = getPlatformSettings('trader').name;

    return (
        <React.Fragment>
            <FormSubHeader title={localize('Deriv password')} />
            <div className='account__passwords-wrapper'>
                <React.Fragment>
                    <Text as='p' className='passwords-platform__desc' color='prominent' size='xs' weight='lighter'>
                        <Localize
                            i18n_default_text='Use the <0>Deriv password</0> to log in to {{brand_website_name}}, {{platform_name_go}}, {{platform_name_trader}}, {{platform_name_smarttrader}}, and {{platform_name_dbot}}.'
                            components={[<strong key={0} />]}
                            values={{
                                brand_website_name,
                                platform_name_trader,
                                platform_name_dbot,
                                platform_name_smarttrader,
                                platform_name_go,
                            }}
                        />
                    </Text>
                    <Text as='p' className='passwords-platform__desc' color='prominent' size='xs' weight='lighter'>
                        <Localize
                            i18n_default_text='Apps you have linked to your <0>Deriv password:</0>'
                            components={[<strong key={0} />]}
                        />
                    </Text>
                    <div className='passwords-platform__logo-container'>
                        <DerivComLogo className='passwords-platform__single-icon' />
                        <Text line_height='l' size='xs' weight='bold'>
                            {brand_website_name}
                        </Text>
                    </div>
                    <div className='passwords-platform__icons'>
                        <Popover alignment='bottom' message={platform_name_trader}>
                            <Icon icon={getPlatformSettings('trader').icon} size={32} />
                        </Popover>
                        <Popover alignment='bottom' message={platform_name_dbot}>
                            <Icon icon={getPlatformSettings('dbot').icon} size={32} />
                        </Popover>
                        <Popover alignment='bottom' message={platform_name_smarttrader}>
                            <Icon icon={getPlatformSettings('smarttrader').icon} size={32} />
                        </Popover>
                        <Popover alignment='bottom' message={platform_name_go}>
                            {is_dark_mode_on ? <DerivGoDark /> : <DerivGoLight />}
                        </Popover>
                    </div>
                </React.Fragment>
                {is_social_signup ? (
                    <React.Fragment>
                        <div className='account__passwords-item passwords-social-buttons'>
                            <div className='account__passwords-linked' onClick={onClickSendEmail}>
                                {social_identity_provider ? (
                                    <React.Fragment>
                                        <Icon icon={`IcStock${capitalized_identifier}`} size={16} />
                                        <Text size='xs'>
                                            <Localize
                                                i18n_default_text='Unlink from {{identifier_title}}'
                                                values={{ identifier_title: capitalized_identifier }}
                                            />
                                        </Text>
                                        <Icon icon='IcChevronRight' size={16} />
                                    </React.Fragment>
                                ) : (
                                    ''
                                )}
                            </div>
                        </div>
                    </React.Fragment>
                ) : (
                    <div>
                        <Text as='p' className='passwords-platform__desc' color='prominent' size='xs' weight='lighter'>
                            <Localize
                                i18n_default_text='Click the <0>Change password</0> button to change your Deriv password.'
                                components={[<strong key={0} />]}
                            />
                        </Text>
                        <Button
                            className='account__passwords-footer-btn'
                            type='button'
                            onClick={onClickSendEmail}
                            has_effect
                            text={localize('Change password')}
                            primary
                            large
                        />
                    </div>
                )}
                <SentEmailModal
                    is_open={is_sent_email_modal_open}
                    onClose={() => setIsSentEmailModalOpen(false)}
                    identifier_title={capitalized_identifier}
                    onClickSendEmail={onClickSendEmail}
                    is_modal_when_mobile={true}
                />
            </div>
        </React.Fragment>
    );
};

DerivPassword.propTypes = {
    email: PropTypes.string,
    is_dark_mode_on: PropTypes.bool,
    is_social_signup: PropTypes.bool,
    social_identity_provider: PropTypes.string,
};

export default DerivPassword;
