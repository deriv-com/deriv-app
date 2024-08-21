import React from 'react';
import { Button, CaptionText } from '@deriv-com/quill-ui';
import { Localize } from '@deriv/translations';
import { usePhoneNumberVerificationSetTimer, useVerifyEmail } from '@deriv/hooks';
import { localize } from '@deriv-com/translations';

type TResendCodeTimer = {
    is_button_disabled: boolean;
    should_show_resend_code_button: boolean;
    setIsButtonDisabled: (value: boolean) => void;
    setShouldShowDidntGetTheCodeModal: (value: boolean) => void;
    clearOtpValue: () => void;
    reInitializeGetSettings: () => void;
};
const ResendCodeTimer = ({
    is_button_disabled,
    should_show_resend_code_button,
    clearOtpValue,
    setIsButtonDisabled,
    setShouldShowDidntGetTheCodeModal,
    reInitializeGetSettings,
}: TResendCodeTimer) => {
    // @ts-expect-error this for now
    const { sendPhoneNumberVerifyEmail, WS, error } = useVerifyEmail('phone_number_verification');
    const { is_request_button_disabled, next_request_time } = usePhoneNumberVerificationSetTimer();

    React.useEffect(() => {
        if (WS.isSuccess || error) reInitializeGetSettings();
    }, [WS.isSuccess, reInitializeGetSettings, error]);

    const resendCode = () => {
        if (should_show_resend_code_button) {
            clearOtpValue();
            setIsButtonDisabled(true);
            sendPhoneNumberVerifyEmail();
        } else {
            setShouldShowDidntGetTheCodeModal(true);
        }
    };

    const resendCodeTimer = () => {
        let resendCodeTimer = '';
        if (next_request_time) {
            next_request_time < 60
                ? (resendCodeTimer = `${localize(' in ')}${next_request_time}s`)
                : (resendCodeTimer = `${localize(' in ')}${Math.round(next_request_time / 60)}m`);
        } else {
            resendCodeTimer = '';
        }

        return resendCodeTimer;
    };

    const didntGetACodeTimer = () => {
        let didntGetACodeTimer = '';
        if (next_request_time) {
            next_request_time < 60
                ? (didntGetACodeTimer = ` (${next_request_time}s)`)
                : (didntGetACodeTimer = ` (${next_request_time && Math.round(next_request_time / 60)}m)`);
        } else {
            didntGetACodeTimer = '';
        }

        return didntGetACodeTimer;
    };

    return (
        <Button
            variant='tertiary'
            onClick={resendCode}
            disabled={!!next_request_time || is_button_disabled || is_request_button_disabled}
            color='black'
        >
            <CaptionText bold underlined>
                {should_show_resend_code_button ? (
                    <Localize
                        i18n_default_text='Resend code{{resendCode}}'
                        values={{
                            resendCode: resendCodeTimer(),
                        }}
                    />
                ) : (
                    <Localize
                        i18n_default_text="Didn't get the code?{{resendCode}}"
                        values={{
                            resendCode: didntGetACodeTimer(),
                        }}
                    />
                )}
            </CaptionText>
        </Button>
    );
};

export default ResendCodeTimer;
