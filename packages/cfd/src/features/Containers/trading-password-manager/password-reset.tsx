import React from 'react';
import { SendEmailTemplate } from '@deriv/components';
import { localize, Localize } from '@deriv/translations';
import { getCFDPlatformLabel } from '@deriv/shared';
import { useVerifyEmail } from '@deriv/api';
import { TPasswordResetAndTradingPasswordManager } from 'Containers/props.types';
import { CATEGORY, CFD_PLATFORMS } from 'Helpers/cfd-config';

export const PasswordReset = ({ email, platform, account_group }: TPasswordResetAndTradingPasswordManager) => {
    const { mutate: verifyEmail } = useVerifyEmail();
    const onClickSendEmail = React.useCallback(() => {
        let redirect_to = platform === CFD_PLATFORMS.MT5 ? 1 : 2;

        // if account type is real convert redirect_to from 1 or 2 to 10 or 20
        // and if account type is demo convert redirect_to from 1 or 2 to 11 or 21
        if (account_group === CATEGORY.REAL) {
            redirect_to = Number(`${redirect_to}0`);
        } else if (account_group === CATEGORY.DEMO) {
            redirect_to = Number(`${redirect_to}1`);
        }

        const password_reset_code =
            platform === CFD_PLATFORMS.MT5
                ? 'trading_platform_mt5_password_reset'
                : 'trading_platform_dxtrade_password_reset';

        verifyEmail({
            verify_email: email,
            type: password_reset_code,
            url_parameters: {
                redirect_to,
            },
        });
    }, [platform, account_group, verifyEmail, email]);

    React.useEffect(() => {
        onClickSendEmail();
    }, [onClickSendEmail]);

    return (
        <SendEmailTemplate
            title={localize("We've sent you an email")}
            subtitle={
                <Localize
                    i18n_default_text='Please click on the link in the email to change your {{platform}} password.'
                    values={{
                        platform: getCFDPlatformLabel(platform),
                    }}
                />
            }
            lbl_no_receive={localize("Didn't receive the email?")}
            txt_resend={localize('Resend email')}
            txt_resend_in={localize('Resend email in')}
            onClickSendEmail={onClickSendEmail}
        />
    );
};
