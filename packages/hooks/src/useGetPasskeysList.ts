import { useState } from 'react';
import { useStore } from '@deriv/stores';

type TError = { code?: string; name?: string; message: string };

const useGetPasskeysList = () => {
    const { client } = useStore();
    const { passkeys_list, fetchPasskeysList } = client;

    const [is_passkeys_list_loading, setIsPasskeysListLoading] = useState(false);
    const [passkeys_list_error, setPasskeysListError] = useState<TError | null>(null);

    const refetchPasskeysList = async () => {
        try {
            setIsPasskeysListLoading(true);
            await fetchPasskeysList();
        } catch (e) {
            setPasskeysListError(e as TError);
        } finally {
            setIsPasskeysListLoading(false);
        }
    };

    return {
        passkeys_list,
        passkeys_list_error,
        is_passkeys_list_loading,
        refetchPasskeysList,
    };
};

export default useGetPasskeysList;
