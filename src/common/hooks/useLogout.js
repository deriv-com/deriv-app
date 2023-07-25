import { useDispatch } from 'react-redux';
import { AppConstants } from '@constants';
import { setStorage, syncWithDerivApp, updateTokenList } from '@storage';
import { resetClient } from '../../botPage/view/deriv/store/client-slice';
import { logoutAllTokens } from '../appId';

const useLogout = () => {
    const dispatch = useDispatch();

    const logout = () => {
        logoutAllTokens().then(() => {
            updateTokenList();
            setStorage(AppConstants.STORAGE_ACTIVE_TOKEN, '');
            setStorage('active_loginid', null);
            syncWithDerivApp();
            dispatch(resetClient());
        });
    };

    return logout;
};

export default useLogout;
