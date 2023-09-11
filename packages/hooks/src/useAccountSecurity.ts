import { useRequest } from '@deriv/api';

/**
 * A custom hook that calls the `account_security` api. This call manages two-factor account authentication
 */

const useAccountSecurity = () => {
    const response = useRequest('account_security');
    return response;
};

export default useAccountSecurity;
