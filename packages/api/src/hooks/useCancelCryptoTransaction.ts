import useMutation from '../useMutation';

/** A custom hooks for cancelling crypto transaction  */
const useCancelCryptoTransaction = () => {
    const { data, mutate, ...rest } = useMutation('cashier_withdrawal_cancel');

    return {
        /** The cancel crypto transaction response */
        data: data?.cashier_withdrawal_cancel,
        /** Function to cancel crypto transaction */
        mutate,
        ...rest,
    };
};

export default useCancelCryptoTransaction;
