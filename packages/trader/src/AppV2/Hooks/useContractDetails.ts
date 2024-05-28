import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router';
import { useStore } from '@deriv/stores';

const useContractDetails = () => {
    const store = useStore();
    const { contract_replay } = store;
    const { contract_store, onMount, onUnmount } = contract_replay;
    const location = useLocation();
    const { contract_info } = contract_store;

    useEffect(() => {
        if (!contract_info.contract_id) {
            const url_array = /[^/]*$/.exec(location.pathname);
            const url_contract_id = url_array ? +url_array[0] : undefined;
            onMount(url_contract_id);
        }

        // TODO: need to unmount whenever pathname changes
    }, [location.pathname, onMount, contract_info.contract_id]);

    return {
        contract_info,
        is_loading: !contract_info.contract_id,
    };
};

export default useContractDetails;
