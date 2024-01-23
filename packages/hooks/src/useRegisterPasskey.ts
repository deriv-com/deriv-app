import React from 'react';
import { useQuery, useMutation, useInvalidateQuery } from '@deriv/api';
import { startRegistration } from '@simplewebauthn/browser';

//TODO check error handling after deployment
//TODO check the flow, refactor and add test cases when BE is ready
const useRegisterPasskey = () => {
    const invalidate = useInvalidateQuery();

    const [registration_error, setRegistrationError] = React.useState('');
    const [is_passkey_registered, setIsPasskeyRegistered] = React.useState(false);

    const {
        data,
        refetch,
        error: request_for_registration_error,
        isFetching,
    } = useQuery('passkeys_register_options', {
        options: {
            enabled: false,
        },
    });
    const public_key = data?.passkeys_register_options?.publicKey;

    const {
        mutate,
        error: passkey_register_error,
        isLoading: isMutationLoading,
    } = useMutation('passkeys_register', {
        onSuccess: () => {
            invalidate('passkeys_list');
            setIsPasskeyRegistered(true);
        },
    });

    React.useEffect(
        () => {
            const startPasskeyRegistration = async () => {
                try {
                    if (public_key) {
                        const attResp = await startRegistration(public_key);
                        mutate({
                            payload: {
                                publicKeyCredential: attResp,
                            },
                        });
                    }
                } catch (e) {
                    //TODO check error handling after deployment
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    setRegistrationError(e);
                }
            };

            startPasskeyRegistration();
        },
        // adding refetch to trigger startPasskeyRegistration for the case when user clicks on the button to register passkey again
        [public_key, refetch, mutate]
    );

    return {
        createPasskey: () => {
            setIsPasskeyRegistered(false);
            refetch();
        },
        is_passkey_registered,
        is_registration_in_progress: isFetching || isMutationLoading,
        registration_error: request_for_registration_error || registration_error || passkey_register_error,
    };
};

export default useRegisterPasskey;
