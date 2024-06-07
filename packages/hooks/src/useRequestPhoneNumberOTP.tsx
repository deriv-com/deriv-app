import React from 'react';
import { useMutation } from '@deriv/api';
import { VERIFICATION_SERVICES } from '@deriv/shared';
import { Localize } from '@deriv/translations';
import useSetSettings from './useSetSettings';

type TFormatError = {
    code: string;
    message: string;
};

/** A hook for requesting OTP which is sent on whatsapp or sms platforms */
const useRequestPhoneNumberOTP = () => {
    const { data, mutate, ...rest } = useMutation('phone_number_challenge');
    const [error_message, setErrorMessage] = React.useState<React.ReactNode>('');
    const { setSettings } = useSetSettings();

    const requestOnSMS = () => {
        mutate({ payload: { carrier: VERIFICATION_SERVICES.SMS } });
    };

    const requestOnWhatsApp = () => {
        mutate({ payload: { carrier: VERIFICATION_SERVICES.WHATSAPP } });
    };

    const setUsersPhoneNumber = async (value: { [key: string]: unknown }) => {
        const data = await setSettings(value);

        const { error } = data;

        if (error) {
            formatError(error);
        }

        return { error, data };
    };

    const formatError = ({ code, message }: TFormatError) => {
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
        formatError,
        setErrorMessage,
        setUsersPhoneNumber,
        mutate,
        ...rest,
    };
};

export default useRequestPhoneNumberOTP;
