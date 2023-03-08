import React from 'react';
import { Text, Button, Icon, MultiStep, SendEmailTemplate } from '@deriv/components';
import { localize, Localize } from '@deriv/translations';
import { getCFDPlatformLabel, CFD_PLATFORMS, WS } from '@deriv/shared';
import ChangePasswordConfirmation from './cfd-change-password-confirmation';
import { TChangePassword, TPasswordResetAndTradingPasswordManager } from './props.types';

const ChangePassword = ({ platform, onConfirm }: TChangePassword) => (
    <div className='cfd-change-password'>
        <Icon
            className='cfd-change-password__icon'
            icon={platform === CFD_PLATFORMS.MT5 ? 'IcMt5OnePassword' : 'IcDxtradeOnePassword'}
            width='122'
            height='108'
        />
        <Text as='p' align='center' size='s' weight='bold'>
            <Localize
                i18n_default_text='{{platform}} password'
                values={{
                    platform: getCFDPlatformLabel(platform),
                }}
            />
        </Text>
        <Text as='p' align='center' className='cfd-change-password__description' size='xs'>
            {platform === CFD_PLATFORMS.MT5 ? (
                <Localize i18n_default_text='Use this password to log in to your Deriv MT5 accounts on the desktop, web, and mobile apps.' />
            ) : (
                <Localize i18n_default_text='Use this password to log in to your Deriv X accounts on the web and mobile apps.' />
            )}
        </Text>
        <Button
            className='dc-btn dc-btn--primary dc-btn__large dc-modal__container_cfd-reset-password-modal__button'
            onClick={onConfirm}
        >
            <Text size='xs' weight='bold' color='colored-background'>
                <Localize i18n_default_text='Change password' />
            </Text>
        </Button>
    </div>
);

const PasswordReset = ({ email, platform, account_group }: TPasswordResetAndTradingPasswordManager) => {
    const onClickSendEmail = React.useCallback(() => {
        let redirect_to = platform === CFD_PLATFORMS.MT5 ? 1 : 2;

        // if account type is real convert redirect_to from 1 or 2 to 10 or 20
        // and if account type is demo convert redirect_to from 1 or 2 to 11 or 21
        if (account_group === 'real') {
            redirect_to = Number(`${redirect_to}0`);
        } else if (account_group === 'demo') {
            redirect_to = Number(`${redirect_to}1`);
        }

        const password_reset_code =
            platform === CFD_PLATFORMS.MT5
                ? 'trading_platform_mt5_password_reset'
                : 'trading_platform_dxtrade_password_reset';

        WS.verifyEmail(email, password_reset_code, {
            url_parameters: {
                redirect_to,
            },
        });
    }, [email, platform, account_group]);

    React.useEffect(() => {
        onClickSendEmail();
    }, [onClickSendEmail]);

    return (
        <SendEmailTemplate
            title={localize("We've sent you an email")}
            subtitle={localize('Please click on the link in the email to change your {{platform}} password.', {
                platform: getCFDPlatformLabel(platform),
            })}
            lbl_no_receive={localize("Didn't receive the email?")}
            txt_resend={localize('Resend email')}
            txt_resend_in={localize('Resend email in')}
            onClickSendEmail={onClickSendEmail}
        />
    );
};

const TradingPasswordManager = ({ platform, email, account_group }: TPasswordResetAndTradingPasswordManager) => {
    const multi_step_ref = React.useRef<{ goNextStep: () => void; goPrevStep: () => void }>();

    const steps = [
        {
            component: <ChangePassword platform={platform} onConfirm={() => multi_step_ref.current?.goNextStep()} />,
        },
        {
            component: (
                <ChangePasswordConfirmation
                    confirm_label={localize('Confirm')}
                    platform={platform}
                    onConfirm={() => multi_step_ref.current?.goNextStep()}
                    onCancel={() => multi_step_ref.current?.goPrevStep()}
                />
            ),
        },
        {
            component: <PasswordReset platform={platform} email={email} account_group={account_group} />,
        },
    ];

    return (
        <div className='cfd-trading-password'>
            <MultiStep ref={multi_step_ref} steps={steps} />
        </div>
    );
};

export default TradingPasswordManager;
