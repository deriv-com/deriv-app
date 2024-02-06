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
            if (public_key) {
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
    }, [public_key, registerPasskey]);

    React.useEffect(
        () => {
            if (public_key) {
                startPasskeyRegistration();
            }
        },
        // adding registerPasskey to trigger startPasskeyRegistration for the case when user clicks on the button to register passkey again
        [public_key, fetchRegisterOptions, registerPasskey, startPasskeyRegistration]
    );

    // eslint-disable-next-line no-console
    console.log('optionsError', optionsError);
    // eslint-disable-next-line no-console
    console.log('deviceRegistrationError', deviceRegistrationError);
    // eslint-disable-next-line no-console
    console.log('passkeyRegisterError', passkeyRegisterError);

    const createPasskey = () => {
        setIsPasskeyRegistered(false);
        setRegistrationError('');
        fetchRegisterOptions();
    };

    return {
        createPasskey,
        is_passkey_registered,
        is_registration_in_progress: isFetching || isMutationLoading,
        registration_error: optionsError || deviceRegistrationError || passkeyRegisterError,
    };
};

export default useRegisterPasskey;
