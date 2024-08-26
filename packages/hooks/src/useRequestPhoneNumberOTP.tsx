import React from 'react';
import { useMutation } from '@deriv/api';
import { VERIFICATION_SERVICES } from '@deriv/shared';
import { Localize } from '@deriv/translations';
import useSettings from './useSettings';
import { useStore } from '@deriv/stores';

type TFormatError = {
    code: string;
    message: string;
};

/** A hook for requesting OTP which is sent on whatsapp or sms platforms */
const useRequestPhoneNumberOTP = () => {
    const {
        data,
        mutate,
        error: email_otp_error,
        isSuccess: is_email_verified,
        ...rest
    } = useMutation('phone_number_challenge');
    const [error_message, setErrorMessage] = React.useState<React.ReactNode>('');
    const { client } = useStore();
    const { verification_code } = client;
    const { phone_number_verification: phone_number_verification_code } = verification_code;
    const {
        mutation: { mutateAsync: updateSettings },
    } = useSettings();

    React.useEffect(() => {
        //@ts-expect-error will fix this later
        if (email_otp_error) formatError(email_otp_error);
    }, [email_otp_error]);

    const requestOnSMS = () => {
        mutate({
            payload: {
                carrier: VERIFICATION_SERVICES.SMS,
                email_code: phone_number_verification_code || '',
            },
        });
    };

    const requestOnWhatsApp = () => {
        mutate({
            payload: {
                carrier: VERIFICATION_SERVICES.WHATSAPP,
                email_code: phone_number_verification_code || '',
            },
        });
    };

    const sendEmailOTPVerification = (value: string) => {
        mutate({ payload: { email_code: value } });
    };

    const setUsersPhoneNumber = async (value: { [key: string]: unknown }) => {
        let error;
        try {
            await updateSettings({
                payload: value,
            });
        } catch (err) {
            formatError(err as TFormatError);
            error = err;
        }

        return {
            error,
        };
    };

    const formatError = ({ code, message }: TFormatError) => {
        switch (code) {
            case 'PhoneNumberTaken':
                setErrorMessage(
                    <Localize
                        i18n_default_text='Number already exists in our system. Enter a new one or contact us via <0>live chat</0> for help.'
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
        email_otp_error,
        is_email_verified,
        requestOnWhatsApp,
        requestOnSMS,
        formatError,
        setErrorMessage,
        setUsersPhoneNumber,
        sendEmailOTPVerification,
        mutate,
        ...rest,
    };
};

export default useRequestPhoneNumberOTP;
