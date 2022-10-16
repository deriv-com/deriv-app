import React from 'react';
import PropTypes from 'prop-types';
import { Button, Icon, Popover, Text } from '@deriv/components';
import { CFD_PLATFORMS, WS, getPlatformSettings } from '@deriv/shared';
import { localize, Localize } from '@deriv/translations';
import FormSubHeader from 'Components/form-sub-header';
import SentEmailModal from 'Components/sent-email-modal';

const PasswordsPlatform = ({ email, has_dxtrade_accounts, has_mt5_accounts }) => {
    const [identifier, setIdenifier] = React.useState('');
    const [is_sent_email_modal_open, setIsSentEmailModalOpen] = React.useState(false);

    const platform_name_dxtrade = getPlatformSettings('dxtrade').name;

    const getPlatformTitle = () => {
        let title = '';
        if (has_mt5_accounts) {
            title = localize('DMT5 Password');
        } else if (has_dxtrade_accounts) {
            title = localize('{{platform_name_dxtrade}} Password', { platform_name_dxtrade });
        }
        return title;
    };

    const onClickSendEmail = cfd_platform => {
        const password_reset_code =
            cfd_platform === CFD_PLATFORMS.MT5
                ? 'trading_platform_mt5_password_reset'
                : 'trading_platform_dxtrade_password_reset';

        WS.verifyEmail(email, password_reset_code, {
            url_parameters: {
                redirect_to: 3,
            },
        });
        setIdenifier(cfd_platform);
        setIsSentEmailModalOpen(true);
    };

    return (
        <React.Fragment>
            <FormSubHeader title={getPlatformTitle()} />
            <div className='account__passwords-wrapper'>
                {has_mt5_accounts && (
                    <React.Fragment>
                        <Text as='p' className='passwords-platform__desc' color='prominent' size='xs' weight='lighter'>
                            <Localize i18n_default_text='Your DMT5 password is for logging in to your Deriv MT5 accounts on the desktop, web, and mobile apps.' />
                        </Text>
                        <Text as='p' className='passwords-platform__desc' color='prominent' size='xs' weight='lighter'>
                            <Localize
                                i18n_default_text='Click the <0>Change password</0> button to change your DMT5 password.'
                                components={[<strong key={0} />]}
                            />
                        </Text>
                        <div className='passwords-platform__content'>
                            <Popover alignment='bottom' message='DMT5'>
                                <Icon icon='IcBrandDmt5' size={32} />
                            </Popover>
                            <Button
                                className='account__passwords-footer-btn'
                                type='button'
                                onClick={() => onClickSendEmail(CFD_PLATFORMS.MT5)}
                                text={localize('Change password')}
                                primary
                                large
                            />
                        </div>
                    </React.Fragment>
                )}
                {has_dxtrade_accounts && (
                    <React.Fragment>
                        <Text as='p' className='passwords-platform__desc' color='prominent' size='xs' weight='lighter'>
                            <Localize
                                i18n_default_text='Use the {{platform_name_dxtrade}} password to log in to your {{platform_name_dxtrade}} accounts on the web and mobile apps.'
                                values={{ platform_name_dxtrade }}
                            />
                        </Text>
                        <div className='passwords-platform__content'>
                            <Popover alignment='bottom' message={platform_name_dxtrade}>
                                <Icon icon={getPlatformSettings('dxtrade').icon} size={32} />
                            </Popover>
                            <Button
                                className='account__passwords-footer-btn'
                                type='button'
                                onClick={() => onClickSendEmail(CFD_PLATFORMS.DXTRADE)}
                                text={localize('Change password')}
                                primary
                                large
                            />
                        </div>
                    </React.Fragment>
                )}
                <SentEmailModal
                    is_open={is_sent_email_modal_open}
                    identifier_title={identifier}
                    onClose={() => setIsSentEmailModalOpen(false)}
                    onClickSendEmail={onClickSendEmail}
                    is_modal_when_mobile
                />
                {/*
                <SuccessDialog
                    is_open={is_success_dialog_open}
                    is_dxtrade_allowed={is_dxtrade_allowed}
                    onClose={() => setIsSuccessDialogOpen(false)}
                /> */}
            </div>
        </React.Fragment>
    );
};

PasswordsPlatform.propTypes = {
    email: PropTypes.string,
    has_dxtrade_accounts: PropTypes.bool,
    has_mt5_accounts: PropTypes.bool,
};

export default PasswordsPlatform;
