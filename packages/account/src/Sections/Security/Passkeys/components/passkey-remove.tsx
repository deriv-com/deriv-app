import { useState } from 'react';
import { Icon } from '@deriv/components';
import { Localize } from '@deriv-com/translations';
import { DerivLightIcVerifyPasskeyIcon, DerivLightIcEmailSentPasskeyIcon } from '@deriv/quill-icons';
import { observer, useStore } from '@deriv/stores';
import { PasskeysStatusLayout, TPasskeysButtonOnClicks } from './passkeys-status-layout';
import { TCurrentManagedPasskey } from '../passkeys';

type TPasskeyRemove = { current_managed_passkey: TCurrentManagedPasskey } & TPasskeysButtonOnClicks;

export const PasskeyRemove = observer(
    ({ current_managed_passkey, onPrimaryButtonClick, onSecondaryButtonClick }: TPasskeyRemove) => {
        const [isOTPVerificationOpen, setIsOTPVerificationOpen] = useState(false);
        const { client } = useStore();
        const { email_address } = client;

        const onBackButtonClock = () => {
            isOTPVerificationOpen ? setIsOTPVerificationOpen(false) : onSecondaryButtonClick?.();
        };

        const onVerifyOTP = () => {
            // TODO: implement OTP verification
        };

        return (
            <div className='passkeys'>
                <Icon
                    data_testid='dt_learn_more_back_button'
                    icon='IcBackButton'
                    onClick={onBackButtonClock}
                    className='passkeys-status__description-back-button'
                />
                {isOTPVerificationOpen ? (
                    <PasskeysStatusLayout
                        className='passkeys-status__wrapper--expanded'
                        icon={
                            <DerivLightIcEmailSentPasskeyIcon
                                height='96px'
                                width='96px'
                                className='passkey-status__icon'
                            />
                        }
                        title={
                            <Localize
                                i18n_default_text='We’ve sent a verification code to {{email_address}}'
                                values={{ email_address }}
                            />
                        }
                        onPrimaryButtonClick={onVerifyOTP}
                        primary_button_text={<Localize i18n_default_text='Verify OTP' />}
                    >
                        {isOTPVerificationOpen && 'Input'}
                    </PasskeysStatusLayout>
                ) : (
                    <PasskeysStatusLayout
                        className='passkeys-status__wrapper--expanded'
                        description={
                            <Localize i18n_default_text='To keep your account safe, we need to verify your identity before removing this passkey.' />
                        }
                        icon={
                            <DerivLightIcVerifyPasskeyIcon
                                height='96px'
                                width='96px'
                                className='passkey-status__icon'
                            />
                        }
                        title={<Localize i18n_default_text='Security verification' />}
                        onPrimaryButtonClick={onPrimaryButtonClick}
                        onSecondaryButtonClick={() => setIsOTPVerificationOpen(true)}
                        primary_button_text={<Localize i18n_default_text='Verify with passkey' />}
                        secondary_button_text={<Localize i18n_default_text='Verify with email' />}
                    />
                )}
            </div>
        );
    }
);
