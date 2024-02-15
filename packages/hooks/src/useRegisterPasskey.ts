import React from 'react';
import { startRegistration } from '@simplewebauthn/browser';
import { useInvalidateQuery } from '@deriv/api';
import { WS } from '@deriv/shared';

type TError = { code?: string; name?: string; message: string };

const useRegisterPasskey = () => {
    const invalidate = useInvalidateQuery();

    const [passkey_registration_error, setPasskeyRegistrationError] = React.useState<TError | null>(null);
    const [is_passkey_registered, setIsPasskeyRegistered] = React.useState(false);

    const createPasskey = async () => {
        try {
            const passkeys_register_options_response = await WS.send({ passkeys_register_options: 1 });
            const public_key = passkeys_register_options_response.passkeys_register_options.publicKey;
            if (public_key) {
                const authenticator_response = await startRegistration(public_key);
                const passkeys_register_response = await WS.send({
                    passkeys_register: 1,
                    publicKeyCredential: authenticator_response,
                });

                if (passkeys_register_response?.passkeys_register?.properties?.name) {
                    setIsPasskeyRegistered(true);
                    invalidate('passkeys_list');
                }
            }
        } catch (e) {
            // eslint-disable-next-line no-console
            console.log('Registration error:', e);
            setPasskeyRegistrationError(e as TError);
        }
    };

    return {
        createPasskey,
        is_passkey_registered,
        passkey_registration_error,
        clearPasskeyRegistrationError: () => setPasskeyRegistrationError(null),
    };
};

export default useRegisterPasskey;
