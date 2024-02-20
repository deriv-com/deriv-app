import React from 'react';
import { startRegistration } from '@simplewebauthn/browser';
import { PublicKeyCredentialCreationOptionsJSON } from '@simplewebauthn/typescript-types';
import { useInvalidateQuery } from '@deriv/api';
import { WS } from '@deriv/shared';

type TError = { code?: string; name?: string; message: string };

const useRegisterPasskey = () => {
    const invalidate = useInvalidateQuery();

    const [is_passkey_registered, setIsPasskeyRegistered] = React.useState(false);
    const [passkey_registration_error, setPasskeyRegistrationError] = React.useState<TError | null>(null);
    const [public_key, setPublicKey] = React.useState<null | PublicKeyCredentialCreationOptionsJSON>(null);

    const clearPasskeyRegistrationError = () => setPasskeyRegistrationError(null);

    const startPasskeyRegistration = async () => {
        try {
            const passkeys_register_options_response = await WS.send({ passkeys_register_options: 1 });
            const public_key = passkeys_register_options_response?.passkeys_register_options?.publicKey;
            setPublicKey(public_key);
        } catch (e) {
            setPasskeyRegistrationError(e as TError);
        }
    };

    const createPasskey = async () => {
        try {
            if (public_key) {
                setIsPasskeyRegistered(false);

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
            setPasskeyRegistrationError(e as TError);
        } finally {
            setPublicKey(null);
        }
    };

    return {
        clearPasskeyRegistrationError,
        createPasskey,
        is_passkey_registered,
        passkey_registration_error,
        startPasskeyRegistration,
    };
};

export default useRegisterPasskey;
