import { useEffect, useRef } from 'react';
import { useHistory } from 'react-router';
import { Button } from '@deriv/components';
import { useIsPhoneNumberVerified, useSettings, useVerifyEmail } from '@deriv/hooks';
import { routes } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { useTranslations, Localize } from '@deriv-com/translations';
import { useDevice } from '@deriv-com/ui';
import './verify-button.scss';

type TVerifyButton = {
    is_verify_button_disabled: boolean;
    next_email_otp_request_timer?: number;
    is_phone_number_edited: boolean;
    phone_number: string | undefined | null;
    setStatus: (status: any) => void;
};

export const VerifyButton = observer(
    ({
        is_verify_button_disabled,
        next_email_otp_request_timer,
        setStatus,
        is_phone_number_edited,
        phone_number,
    }: TVerifyButton) => {
        const { client, ui } = useStore();
        const { setShouldShowPhoneNumberOTP, is_scroll_to_verify_button, setIsScrollToVerifyButton } = ui;
        const { setVerificationCode, is_authorize } = client;
        const { is_phone_number_verified } = useIsPhoneNumberVerified();
        const history = useHistory();
        const { localize } = useTranslations();
        const {
            refetch,
            mutation: { mutateAsync: updateSettings, isLoading: isSetSettingsLoading },
        } = useSettings();
        //@ts-expect-error remove this when phone_number_verification is added to api calls
        const { sendPhoneNumberVerifyEmail, WS, is_loading, error } = useVerifyEmail('phone_number_verification');
        const { isDesktop } = useDevice();
        const ref = useRef<HTMLDivElement | null>(null);

        useEffect(() => {
            if (is_authorize) refetch();
        }, [refetch, is_authorize]);

        useEffect(() => {
            if (is_scroll_to_verify_button) {
                // To make scrolling work on mobile we need to add a delay.
                const timeout = setTimeout(() => {
                    if (ref.current) {
                        ref.current.style.scrollMarginTop = isDesktop ? '120px' : '80px';
                        ref.current.scrollIntoView({ behavior: 'smooth' });
                    }
                }, 0);

                return () => {
                    clearTimeout(timeout);
                    setIsScrollToVerifyButton(false);
                };
            }
        }, [is_scroll_to_verify_button, setIsScrollToVerifyButton, isDesktop]);

        useEffect(() => {
            if (WS.isSuccess) {
                history.push(routes.phone_verification);
            } else if (error) {
                //@ts-expect-error error message has issue with typing
                setStatus({ msg: error.message, code: error.code });
            }
        }, [WS.isSuccess, history, error]);

        const savePhoneNumberAndVerify = async () => {
            updateSettings({ payload: { phone: phone_number } })
                .then(() => {
                    sendPhoneNumberVerifyEmail();
                })
                .catch(err => {
                    setStatus({ msg: err.message, code: err.code });
                });
        };

        const redirectToPhoneVerification = (e: React.MouseEvent<HTMLElement>) => {
            e.preventDefault();
            setVerificationCode('', 'phone_number_verification');
            setShouldShowPhoneNumberOTP(false);
            is_phone_number_edited ? savePhoneNumberAndVerify() : sendPhoneNumberVerifyEmail();
        };

        const verifyTimer = () => {
            let resendCodeTimer = '';
            if (next_email_otp_request_timer) {
                next_email_otp_request_timer < 60
                    ? (resendCodeTimer = `${localize(' in ')}${next_email_otp_request_timer}s`)
                    : (resendCodeTimer = `${localize(' in ')}${Math.round(next_email_otp_request_timer / 60)}m`);
            } else {
                resendCodeTimer = '';
            }

            return resendCodeTimer;
        };

        const getButtonText = () => {
            if (is_phone_number_verified) {
                return <Localize i18n_default_text='Verified' />;
            } else if (is_phone_number_edited) {
                return <Localize i18n_default_text='Save and Verify' />;
            }
            return (
                <Localize
                    i18n_default_text='Verify{{resendCode}}'
                    values={{
                        resendCode: verifyTimer(),
                    }}
                />
            );
        };

        return (
            <div ref={ref}>
                <Button
                    className='phone-verification-button'
                    is_disabled={
                        is_phone_number_verified ||
                        is_verify_button_disabled ||
                        is_loading ||
                        isSetSettingsLoading ||
                        !!next_email_otp_request_timer
                    }
                    onClick={redirectToPhoneVerification}
                    has_effect
                    green={is_phone_number_verified}
                    primary
                    large
                >
                    {getButtonText()}
                </Button>
            </div>
        );
    }
);
