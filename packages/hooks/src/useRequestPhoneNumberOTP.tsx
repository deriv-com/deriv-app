import React from 'react';
import { useMutation } from '@deriv/api';
import { VERIFICATION_SERVICES } from '@deriv/shared';
import { Localize } from '@deriv/translations';

type THandleError = {
    code: string;
    message: string;
};

/** A hook for requesting OTP which is sent on whatsapp or sms platforms */
const useRequestPhoneNumberOTP = () => {
    const { data, mutate, ...rest } = useMutation('phone_number_challenge');
    const [error_message, setErrorMessage] = React.useState<React.ReactNode>('');

    const requestOnSMS = () => {
        mutate({ payload: { carrier: VERIFICATION_SERVICES.SMS } });
    };

    const requestOnWhatsApp = () => {
        mutate({ payload: { carrier: VERIFICATION_SERVICES.WHATSAPP } });
    };

    const handleError = ({ code, message }: THandleError) => {
        switch (code) {
            case 'PhoneNumberTaken':
                setErrorMessage(
                    <Localize
                        i18n_default_text="This number is in use. Enter a new one or contact <0>live chat</0> if you think there's a mistake."
                        components={[
                            <span
                                key={0}
                                className='phone-verification__card--inputfield__livechat'
                                onClick={() => window.LC_API.open_chat_window()}
                            />,
                        ]}
                    />
                );
                break;
            default:
                setErrorMessage(message);
                break;
        }
    };

    return {
        data: data?.phone_number_challenge,
        error_message,
        requestOnWhatsApp,
        requestOnSMS,
        handleError,
        setErrorMessage,
        mutate,
        ...rest,
    };
};

export default useRequestPhoneNumberOTP;
