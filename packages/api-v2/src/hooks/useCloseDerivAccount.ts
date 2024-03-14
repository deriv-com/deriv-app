import useMutation from '../useMutation';

/**
 * A custom hook that calls the `account_closure` api. This call allows clients to close all their accounts (including virtual-money account)
 */
const useCloseDerivAccount = () => {
    const response = useMutation('account_closure');
    return response;
};

export default useCloseDerivAccount;
