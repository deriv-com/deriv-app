import React, { useEffect, useRef } from 'react';
import { observer, useStore } from '@deriv/stores';
import { useHistory } from 'react-router';
import { routes } from '@deriv/shared';
import { Button } from '@deriv/components';
import { Localize } from '@deriv/translations';
import { useVerifyEmail } from '@deriv/hooks';
import { useDevice } from '@deriv-com/ui';
import './verify-button.scss';

type TVerifyButton = {
    is_verify_button_disabled: boolean;
};

export const VerifyButton = observer(({ is_verify_button_disabled }: TVerifyButton) => {
    const { client, ui } = useStore();
    const { setShouldShowPhoneNumberOTP, is_scroll_to_verify_button, setIsScrollToVerifyButton } = ui;
    const { account_settings, setVerificationCode } = client;
    const { phone_number_verification } = account_settings;
    const phone_number_verified = !!phone_number_verification?.verified;
    const history = useHistory();
    //@ts-expect-error remove this when phone_number_verification is added to api calls
    const { sendPhoneNumberVerifyEmail, WS, is_loading } = useVerifyEmail('phone_number_verification');
    const { isDesktop } = useDevice();
    const ref = useRef<HTMLDivElement | null>(null);

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
        }
    }, [WS.isSuccess, history]);

    const redirectToPhoneVerification = (e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault();
        setVerificationCode('', 'phone_number_verification');
        setShouldShowPhoneNumberOTP(false);
        sendPhoneNumberVerifyEmail();
    };

    return (
        <div ref={ref}>
            <Button
                className='phone-verification-button'
                is_disabled={phone_number_verified || is_verify_button_disabled || is_loading}
                onClick={redirectToPhoneVerification}
                has_effect
                green={phone_number_verified}
                primary
                large
            >
                {phone_number_verified ? (
                    <Localize i18n_default_text='Verified' />
                ) : (
                    <Localize i18n_default_text='Verify' />
                )}
            </Button>
        </div>
    );
});
