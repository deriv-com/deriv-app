import React from 'react';
import { startAuthentication } from '@simplewebauthn/browser';
import { useInvalidateQuery } from '@deriv/api';
import { WS } from '@deriv/shared';

type TError = { code?: string; name?: string; message: string };

const useRemovePasskey = ({ onSuccess }: { onSuccess: () => void }) => {
    const invalidate = useInvalidateQuery();

    const [passkey_removing_error, setPasskeyRemovingError] = React.useState<TError | null>(null);
    // const [public_key, setPublicKey] = React.useState<null | PublicKeyCredentialCreationOptionsJSON>(null);

    // const startPasskeyRegistration = async () => {
    //     try {
    //         const passkeys_register_options_response = await WS.send({ passkeys_register_options: 1 });
    //         const public_key = passkeys_register_options_response?.passkeys_register_options?.publicKey;
    //         setPublicKey(public_key);
    //     } catch (e) {
    //         setPasskeyRegistrationError(e as TError);
    //         passkeyErrorEventTrack(e as TError);
    //     }
    // TODO: remove ID if not needed
    const removePasskey = async (id: number) => {
        try {
            const passkey_options_response = await WS.send({
                passkeys_options: 1,
            });
            const public_key = passkey_options_response.passkeys_options.publicKey;
            const authenticator_response = await startAuthentication(public_key);

            const passkeys_revoke_response = await WS.send({
                passkeys_revoke: 1,
                // TODO: check if we need to pass id
                // id,
                publicKeyCredential: authenticator_response,
            });

            if (passkeys_revoke_response.passkeys_revoke) {
                invalidate('passkeys_list');
                onSuccess();
            } else if (passkeys_revoke_response.error) {
                setPasskeyRemovingError(passkeys_revoke_response.error);
            }
        } catch (e) {
            setPasskeyRemovingError(e as TError);
        }
    };

    return {
        removePasskey,
        passkey_removing_error,
    };
};

export default useRemovePasskey;
