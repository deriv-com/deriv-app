import { useInvalidateQuery, useRequest } from '@deriv/api';
import { useStore } from '@deriv/stores';
import { useMemo } from 'react';

/** A custom hook that creates a new wallet account.
 * @description This hook is to create a new wallet account and switch to it.
 */
const useCreateWallet = () => {
    const { client, ui } = useStore();
    const { accountRealReaction, switchAccount } = client;
    const { toggleIsWalletCreationSuccessModalOpen } = ui;
    const invalidate = useInvalidateQuery();
    const { data, ...rest } = useRequest('new_account_wallet', {
        onSuccess: async response => {
            // Update the local storage account list with the new created wallet account.
            await accountRealReaction(response);

            // Switch to the new created wallet account.
            await switchAccount(response.new_account_wallet?.client_id);

            // Invalidate the queries that are affected by the new created wallet account.
            invalidate('authorize');
            invalidate('balance');

            //This is here because we need to wait for the account to be switched before we can open the modal.
            toggleIsWalletCreationSuccessModalOpen(true);
        },
    });

    // Add extra information to the response.
    const modified_data = useMemo(() => {
        if (!data?.new_account_wallet) return undefined;

        return { ...data?.new_account_wallet };
    }, [data]);

    return {
        data: modified_data,
        ...rest,
    };
};

export default useCreateWallet;
