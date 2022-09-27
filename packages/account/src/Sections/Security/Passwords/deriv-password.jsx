import React from 'react';
import PropTypes from 'prop-types';
import { Button, Icon, Popover, Text } from '@deriv/components';
import { getBrandWebsiteName, getPlatformSettings, toTitleCase, WS } from '@deriv/shared';
import { Localize, localize } from '@deriv/translations';
import FormSubHeader from 'Components/form-sub-header';
import SentEmailModal from 'Components/sent-email-modal';
import UnlinkModal from 'Components/unlink-modal';
import DerivComLogo from 'Assets/ic-brand-deriv-red.svg';
import DerivGoLight from 'Assets/ic-brand-deriv-go-light.svg';
import DerivGoDark from 'Assets/ic-brand-deriv-go-dark.svg';

const DerivPassword = ({ email, is_dark_mode_on, is_social_signup, social_identity_provider }) => {
    const [is_unlink_modal_open, setIsUnlinkModalOpen] = React.useState(false);
    const [is_sent_email_modal_open, setIsSentEmailModalOpen] = React.useState(false);

    const onClickSendEmail = () => {
        WS.verifyEmail(email, 'reset_password');
        setIsUnlinkModalOpen(false);
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
                        <Localize i18n_default_text='Apps you can use with your Deriv login:' />
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
                            <div className='passwords-social-buttons__desc'>
                                <Text
                                    as='p'
                                    className='passwords-platform__desc'
                                    color='prominent'
                                    size='xs'
                                    weight='lighter'
                                >
                                    <Localize
                                        i18n_default_text="You're using your {{identifier_title}} account to log in to your Deriv account. To change your login method into using a username and password, click the <0>Unlink</0> button."
                                        components={[<strong key={0} />]}
                                        values={{ identifier_title: capitalized_identifier }}
                                    />
                                </Text>
                            </div>
                            <div className='account__passwords-linked'>
                                {social_identity_provider ? (
                                    <React.Fragment>
                                        <Icon icon={`IcStock${capitalized_identifier}`} size={16} />
                                        <Text size='xs'>
                                            <Localize
                                                i18n_default_text='Linked with {{identifier_title}}'
                                                values={{ identifier_title: capitalized_identifier }}
                                            />
                                        </Text>
                                    </React.Fragment>
                                ) : (
                                    ''
                                )}
                            </div>
                            <Button
                                onClick={() => {
                                    setIsUnlinkModalOpen(true);
                                    setIsSentEmailModalOpen(true);
                                }}
                                type='button'
                                text={localize('Unlink')}
                                tertiary
                                large
                            />
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
                <UnlinkModal
                    is_open={is_unlink_modal_open}
                    onClose={() => {
                        setIsUnlinkModalOpen(false);
                        setIsSentEmailModalOpen(false);
                    }}
                    identifier_title={capitalized_identifier}
                    onClickSendEmail={onClickSendEmail}
                />
                <SentEmailModal
                    is_open={is_sent_email_modal_open && !is_unlink_modal_open}
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
