import React from 'react';
import { useMutation } from '@deriv/api';
import { CFD_PLATFORMS, getPlatformSettings } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { Localize, localize } from '@deriv/translations';
import FormSubHeader from '../../../Components/form-sub-header';
import SentEmailModal from '../../../Components/sent-email-modal';
import PlatformPartials from './platform-partials';

type TPasswordsPlatformProps = {
    has_dxtrade_accounts?: boolean;
    has_mt5_accounts?: boolean;
};

/**
 * Displays a change password instructions for MT5 and/or DXTrade.
 * @name PasswordsPlatform
 * @param [has_dxtrade_accounts=false] - Whether the user has DXTrade accounts.
 * @param [has_mt5_accounts=false] - Whether the user has MT5 accounts.
 * @returns React.ReactNode
 */
const PasswordsPlatform = observer(
    ({ has_dxtrade_accounts = false, has_mt5_accounts = false }: TPasswordsPlatformProps) => {
        const { mutate } = useMutation('verify_email');

        const {
            client: { email },
        } = useStore();

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
                        <PlatformPartials
                            type={CFD_PLATFORMS.MT5}
                            handleClick={onClickSendEmail}
                            description={
                                <Localize i18n_default_text='Your Deriv MT5 password is for logging in to your Deriv MT5 accounts on the desktop, web, and mobile apps.' />
                            }
                        />
                    )}
                    {has_dxtrade_accounts && (
                        <PlatformPartials
                            type={CFD_PLATFORMS.DXTRADE}
                            handleClick={onClickSendEmail}
                            description={
                                <Localize i18n_default_text='Your Deriv X password is for logging in to your Deriv X accounts on the web and mobile apps.' />
                            }
                        />
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
    }
);
export default PasswordsPlatform;
