import { setClientAccounts, setActiveLoginId } from '@storage';
import { logoutAllTokens } from '../appId';

const useLogout = () => {
    const logout = () => {
        logoutAllTokens().then(() => {
            setActiveLoginId('');
            setClientAccounts({});
        });
    };
    return logout;
};

export default useLogout;
