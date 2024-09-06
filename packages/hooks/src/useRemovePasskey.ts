import { useState } from 'react';
import { useInvalidateQuery } from '@deriv/api';
import { WS } from '@deriv/shared';

type TError = { code?: string; name?: string; message: string };

const useRemovePasskey = ({ onSuccess }: { onSuccess: () => void }) => {
    const invalidate = useInvalidateQuery();

    const [passkey_removing_error, setPasskeyRemovingError] = useState<TError | null>(null);

    const removePasskey = async (id: number) => {
        try {
            const passkeys_revoke_response = await WS.send({
                passkeys_revoke: 1,
                id,
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
