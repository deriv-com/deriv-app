import React from 'react';
import { Button, Icon, Popover, Text } from '@deriv/components';
import { CFD_PLATFORMS, getPlatformSettings } from '@deriv/shared';
import { localize, Localize } from '@deriv/translations';
import FormSubHeader from 'Components/form-sub-header';
import SentEmailModal from 'Components/sent-email-modal';
import { useRequest } from '@deriv/api';

type TPasswordsPlatformProps = {
    email: string;
    has_dxtrade_accounts?: boolean;
    has_mt5_accounts?: boolean;
};

/**
 * Displays a change password instructions for MT5 and/or DXTrade.
 * @param {string} email - The user's email address.
 * @param {boolean} [has_dxtrade_accounts=false] - Whether the user has DXTrade accounts.
 * @param {boolean} [has_mt5_accounts=false] - Whether the user has MT5 accounts.
 * @returns {React.ReactNode}
 */
const PasswordsPlatform = ({
    email,
    has_dxtrade_accounts = false,
    has_mt5_accounts = false,
}: TPasswordsPlatformProps) => {
    const { mutate } = useRequest('verify_email');

    const [identifier, setIdentifier] = React.useState('');
    const [is_sent_email_modal_open, setIsSentEmailModalOpen] = React.useState(false);

    const platform_name_dxtrade = getPlatformSettings('dxtrade').name;

    const getPlatformTitle = () => {
        let title = '';
        if (has_mt5_accounts) {
            title = localize('Deriv MT5 Password');
        } else if (has_dxtrade_accounts) {
            title = localize('{{platform_name_dxtrade}} Password', { platform_name_dxtrade });
        }
        return title;
    };

    const onClickSendEmail = (cfd_platform?: string) => {
        const password_reset_code =
            cfd_platform === CFD_PLATFORMS.MT5
                ? 'trading_platform_mt5_password_reset'
                : 'trading_platform_dxtrade_password_reset';

        mutate({
            payload: {
                verify_email: email,
                type: password_reset_code,

                url_parameters: {
                    redirect_to: 3,
                },
            },
        });

        setIdentifier(cfd_platform ?? '');
        setIsSentEmailModalOpen(true);
    };

    return (
        <React.Fragment>
            <FormSubHeader title={getPlatformTitle()} />
            <div className='account__passwords-wrapper'>
                {has_mt5_accounts && (
                    <React.Fragment>
                        <Text as='p' className='passwords-platform__desc' color='prominent' size='xs' weight='lighter'>
                            <Localize i18n_default_text='Your Deriv MT5 password is for logging in to your Deriv MT5 accounts on the desktop, web, and mobile apps.' />
                        </Text>
                        <div className='passwords-platform__content'>
                            <Popover alignment='bottom' message='Deriv MT5'>
                                <Icon icon={`${getPlatformSettings('mt5').icon}-dashboard`} size={32} />
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
                                <Icon icon={`${getPlatformSettings('dxtrade').icon}-dashboard`} size={32} />
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
            </div>
        </React.Fragment>
    );
};
export default PasswordsPlatform;
