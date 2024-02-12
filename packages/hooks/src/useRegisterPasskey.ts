import React from 'react';
import { useQuery, useMutation, useInvalidateQuery } from '@deriv/api';
import { startRegistration } from '@simplewebauthn/browser';

const useRegisterPasskey = () => {
    const invalidate = useInvalidateQuery();

    const [deviceRegistrationError, setRegistrationError] = React.useState('');
    const [is_passkey_registered, setIsPasskeyRegistered] = React.useState(false);

    const {
        data,
        refetch: fetchRegisterOptions,
        error: optionsError,
        isFetching,
    } = useQuery('passkeys_register_options', {
        options: {
            enabled: false,
        },
    });
    const public_key = data?.passkeys_register_options?.publicKey;
    const challenge = public_key?.challenge;

    const {
        mutate: registerPasskey,
        error: passkeyRegisterError,
        isLoading: isMutationLoading,
    } = useMutation('passkeys_register', {
        onSuccess: () => {
            invalidate('passkeys_list');
            setIsPasskeyRegistered(true);
        },
    });

    const startPasskeyRegistration = React.useCallback(async () => {
        try {
            if (challenge) {
                const attResp = await startRegistration(public_key);
                registerPasskey({
                    payload: {
                        publicKeyCredential: attResp,
                    },
                });
            }
        } catch (e) {
            setRegistrationError(String(e));
        }
    }, [challenge, registerPasskey, public_key]);

    React.useEffect(() => {
        if (challenge) {
            startPasskeyRegistration();
        }
    }, [challenge, startPasskeyRegistration]);

    // eslint-disable-next-line no-console
    console.log('optionsError', optionsError?.error);
    // eslint-disable-next-line no-console
    console.log('deviceRegistrationError', deviceRegistrationError);
    // eslint-disable-next-line no-console
    console.log('passkeyRegisterError', passkeyRegisterError?.error);

    const createPasskey = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        // eslint-disable-next-line no-console
        console.log('event begin', e);
        setIsPasskeyRegistered(false);
        setRegistrationError('');
        fetchRegisterOptions();
        // eslint-disable-next-line no-console
        console.log('event end', e);
    };

    return {
        createPasskey,
        is_passkey_registered,
        is_registration_in_progress: isFetching || isMutationLoading,
        registration_error: (optionsError?.error || deviceRegistrationError || passkeyRegisterError?.error) ?? null,
    };
};

export default useRegisterPasskey;
