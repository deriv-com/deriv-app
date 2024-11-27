import { ChangeEvent, useEffect, useState } from 'react';
import { Icon } from '@deriv/components';
import { Localize, useTranslations } from '@deriv-com/translations';
import { DerivLightIcEmailSentPasskeyIcon } from '@deriv/quill-icons';
import { InputGroupButton } from '@deriv-com/quill-ui';
import { observer, useStore } from '@deriv/stores';
import { PasskeysStatusLayout, TPasskeysButtonOnClicks } from './passkeys-status-layout';
import { ResendCodeButton } from './resend-code-button';
import { useReadLocalStorage } from 'usehooks-ts';
import { makeCancellablePromise } from '@deriv/shared/src/utils/promise/make-cancellable-promise';

type TTOTPResponse = { message: string; resend_timer: number };
type TTOTPResponseError = { message: string; code: string };

export const PasskeyRemoveWithEmail = observer(
    ({ onBackButtonClick, onPrimaryButtonClick }: TPasskeysButtonOnClicks) => {
        const { client } = useStore();
        const { email_address, loginid } = client;
        const { localize } = useTranslations();
        const [code, setCode] = useState('');
        const [error, setError] = useState<string>('');
        const [timer, setTimer] = useState(0);
        const [isResendDisabled, setIsResendDisabled] = useState(true);

        // pass token to totp service to verify the account
        const accounts = useReadLocalStorage<Record<string, { token: string }>>('client.accounts');
        const login_token = accounts?.[loginid || '']?.token || '';
        const test_token = process.env.TOTP_TEST_TOKEN || '';
        const encoded_token = btoa(test_token || login_token);
        const anon_key = process.env.ANON_KEY || '';
        const totp_service_url = 'https://oadhrgilmqjitobovfpf.supabase.co/functions/v1/totp';

        const getRemainingSeconds = (timestamp: number): number => {
            const now = Date.now();
            const difference = timestamp - now;
            const secondsRemaining = Math.floor(difference / 1000);
            return secondsRemaining;
        };

        const getVerificationCodeToEmail = async (endpoint: 'create' | 'resend') => {
            try {
                const resp = await fetch(`${totp_service_url}/${endpoint}`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${anon_key}`,
                        UserAuthorization: `${encoded_token}`,
                        'Content-Type': 'application/json',
                    },
                });
                return resp.json();
            } catch (e) {
                setError((e as TTOTPResponseError).message);
            }
        };

        useEffect(() => {
            const fetchData = async () => {
                const create_res = await getVerificationCodeToEmail('create');
                setTimer(getRemainingSeconds(create_res?.resend_timer));
                setIsResendDisabled(false);
            };
            fetchData();
        }, []);

        const resendCode = async () => {
            const resend_res = await getVerificationCodeToEmail('resend');
            setTimer(getRemainingSeconds(resend_res?.resend_timer));
            setIsResendDisabled(false);
        };

        const onSubmitValues = () => {
            onPrimaryButtonClick?.(code);
        };

        const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
            setCode(e.target.value);
        };

        const onSetDummyError = () => {
            setError('show here error message');
        };

        const onClearError = () => {
            setError('');
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
                        label={code.length === 6 ? localize('Verification code') : localize('Enter 6-digit code')}
                        placeholder={localize('Enter 6-digit code')}
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
                        status={error ? 'error' : undefined}
                        message={error}
                    />
                    <ResendCodeButton onResend={resendCode} initialDelay={timer} isDisabled={isResendDisabled} />
                    <button onClick={onSetDummyError}>set error</button>
                    <button onClick={onClearError}>clear error</button>
                </PasskeysStatusLayout>
            </div>
        );
    }
);
