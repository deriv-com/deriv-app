import useQuery from '../useQuery';

/** A custom hook that gets the list of all transferable accounts of the user. */
const useTransferAccounts = () => {
    const { data, ...rest } = useQuery('transfer_between_accounts', {
        payload: { accounts: 'all' },
    });

    return {
        /** The list of transferable accounts */
        data,
        ...rest,
    };
};

export default useTransferAccounts;
