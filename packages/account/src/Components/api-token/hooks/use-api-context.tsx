import { useContext } from 'react';
import ApiTokenContext from '../api-token-context';

const useApiTokenContext = () => {
    return useContext(ApiTokenContext);
};

export default useApiTokenContext;
