import React from 'react';
import { Button, CaptionText } from '@deriv-com/quill-ui';
import { Localize } from '@deriv/translations';
import { usePhoneNumberVerificationSetTimer, useVerifyEmail } from '@deriv/hooks';

type TResendCodeTimer = {
    is_button_disabled: boolean;
    should_show_resend_code_button: boolean;
    setIsButtonDisabled: (value: boolean) => void;
    setShouldShowDidntGetTheCodeModal: (value: boolean) => void;
    reInitializeGetSettings: () => void;
};
const ResendCodeTimer = ({
    is_button_disabled,
    should_show_resend_code_button,
    setIsButtonDisabled,
    setShouldShowDidntGetTheCodeModal,
    reInitializeGetSettings,
}: TResendCodeTimer) => {
    // @ts-expect-error this for now
    const { send, is_success } = useVerifyEmail('phone_number_verification');
    const { next_otp_request } = usePhoneNumberVerificationSetTimer();

    React.useEffect(() => {
        if (is_success) reInitializeGetSettings();
    }, [is_success, reInitializeGetSettings]);

    const resendCode = () => {
        if (should_show_resend_code_button) {
            setIsButtonDisabled(true);
            send();
        } else {
            setShouldShowDidntGetTheCodeModal(true);
        }
    };

    return (
        <Button
            variant='tertiary'
            onClick={resendCode}
            disabled={!!next_otp_request || is_button_disabled}
            color='black'
        >
            <CaptionText bold underlined>
                {should_show_resend_code_button ? (
                    <Localize i18n_default_text='Resend code{{resendCode}}' values={{ resendCode: next_otp_request }} />
                ) : (
                    <Localize
                        i18n_default_text="Didn't get the code?{{resendCode}}"
                        values={{ resendCode: next_otp_request }}
                    />
                )}
            </CaptionText>
        </Button>
    );
};

export default ResendCodeTimer;
