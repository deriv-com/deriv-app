import { useEffect } from 'react';
import { useLocation } from 'react-router';
import { useStore } from '@deriv/stores';

const useContractDetails = () => {
    const store = useStore();
    const { contract_replay } = store;
    const { contract_store, onMount, onUnmount } = contract_replay;
    const location = useLocation();
    const { contract_info } = contract_store;

    useEffect(() => {
        const url_array = /[^/]*$/.exec(location.pathname);
        const url_contract_id = url_array ? +url_array[0] : undefined;
        onMount(url_contract_id);

        return () => {
            onUnmount();
        };
    }, [location, onMount, onUnmount]);

    return {
        contract_info,
    };
};

export default useContractDetails;
