import { Icon } from '@deriv/components';
import { Localize, useTranslations } from '@deriv-com/translations';
import { DerivLightIcEmailSentPasskeyIcon } from '@deriv/quill-icons';
import { InputGroupButton } from '@deriv-com/quill-ui';
import { observer, useStore } from '@deriv/stores';
import { PasskeysStatusLayout, TPasskeysButtonOnClicks } from './passkeys-status-layout';
import React, { useEffect } from 'react';

export const PasskeyRemoveWithEmail = observer(
    ({ onBackButtonClick, onPrimaryButtonClick }: TPasskeysButtonOnClicks) => {
        const { client } = useStore();
        const { email_address } = client;
        const { localize } = useTranslations();
        const [code, setCode] = React.useState('');

        const getVerificationCodeToEmail = () => {
            // API call for email verification code
        };

        useEffect(() => {
            getVerificationCodeToEmail();
        }, []);

        const onSubmitValues = () => {
            onPrimaryButtonClick?.(code);
        };

        const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            setCode(e.target.value);
        };
        return (
            <div className='passkeys'>
                <Icon
                    data_testid='dt_learn_more_back_button'
                    icon='IcBackButton'
                    onClick={onBackButtonClick}
                    className='passkeys-status__description-back-button'
                />
                <PasskeysStatusLayout
                    icon={<DerivLightIcEmailSentPasskeyIcon height='96px' width='96px' />}
                    title={
                        <Localize
                            i18n_default_text='We’ve sent a verification code to {{email_address}}'
                            values={{ email_address }}
                        />
                    }
                >
                    <InputGroupButton
                        buttonLabel={localize('Verify')}
                        label={localize('Enter 6-digit code')}
                        inputMode='numeric'
                        buttonColor='coral'
                        type='number'
                        maxLength={6}
                        onChange={handleOnChange}
                        buttonDisabled={code.length < 6}
                        required
                        value={code}
                        buttonCallback={onSubmitValues}
                        className='passkeys-status__description-code-input'
                        size={16}
                    />
                </PasskeysStatusLayout>
            </div>
        );
    }
);
