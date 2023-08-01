import { useDispatch } from 'react-redux';
import { AppConstants } from '@constants';
import { set, syncWithDerivApp, updateTokenList } from '@storage';
import { resetClient } from '../../botPage/view/deriv/store/client-slice';
import { logoutAllTokens } from '../appId';

const useLogout = () => {
    const dispatch = useDispatch();

    const logout = () => {
        logoutAllTokens().then(() => {
            updateTokenList();
            set(AppConstants.STORAGE_ACTIVE_TOKEN, '');
            set('active_loginid', null);
            syncWithDerivApp();
            dispatch(resetClient());
        });
    };

    return logout;
};

export default useLogout;
