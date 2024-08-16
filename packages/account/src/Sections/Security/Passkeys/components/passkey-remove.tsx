import { useState } from 'react';
import { Icon, Input, Text } from '@deriv/components';
import { Localize } from '@deriv-com/translations';
import { DerivLightIcVerifyPasskeyIcon, DerivLightIcEmailSentPasskeyIcon } from '@deriv/quill-icons';
import { observer, useStore } from '@deriv/stores';
import { PasskeysStatusLayout, TPasskeysButtonOnClicks } from './passkeys-status-layout';
import { TCurrentManagedPasskey } from '../passkeys';

type TPasskeyRemove = { current_managed_passkey: TCurrentManagedPasskey } & TPasskeysButtonOnClicks;

const getOTPCodesTips = () =>
    [
        {
            id: 1,
            description: <Localize i18n_default_text='Make sure you’ve entered your email correctly.' />,
        },
        {
            id: 2,
            description: <Localize i18n_default_text='Check your spam folder.' />,
        },
        {
            id: 3,
            description: <Localize i18n_default_text='Make sure the email isn’t blocked by firewalls or filters.' />,
        },
    ] as const;

export const PasskeyRemove = observer(
    ({ current_managed_passkey, onPrimaryButtonClick, onSecondaryButtonClick }: TPasskeyRemove) => {
        const [isOTPVerificationOpen, setIsOTPVerificationOpen] = useState(false);
        const { client } = useStore();
        const { email_address } = client;

        const tips = getOTPCodesTips();

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
                        <div className='passkeys-status__otp-code-container'>
                            <Input />
                            <Text size='xs'>
                                <Localize i18n_default_text="Didn't get a code?" />
                            </Text>
                            <span>Resend code in 59s</span>
                            <Text as='ul' size='xxs'>
                                {tips.map(({ id, description }) => (
                                    <li key={`tip-${id}`}>
                                        <Text size='xxs' line_height='l'>
                                            {description}
                                        </Text>
                                    </li>
                                ))}
                            </Text>
                        </div>
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
