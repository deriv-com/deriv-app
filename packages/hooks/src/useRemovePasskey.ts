import { useState } from 'react';
import { startAuthentication } from '@simplewebauthn/browser';
import { useInvalidateQuery } from '@deriv/api';
import { WS } from '@deriv/shared';

type TError = { code?: string; name?: string; message: string };

const useRemovePasskey = ({ onSuccess }: { onSuccess: () => void }) => {
    const invalidate = useInvalidateQuery();

    const [passkey_removing_error, setPasskeyRemovingError] = useState<TError | null>(null);

    // TODO: remove ID if not needed
    const removePasskey = async (id?: number) => {
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
