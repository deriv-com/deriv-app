import { useEffect } from 'react';
import { useLocation } from 'react-router';
import { useStore } from '@deriv/stores';

const useContractDetails = () => {
    const store = useStore();
    const { contract_replay, contract_trade } = store;
    const { getContractById } = contract_trade;
    const { contract_store, onMount } = contract_replay;
    const { contract_info } = contract_store;
    const contract = getContractById(contract_info.contract_id);

    const location = useLocation();

    useEffect(() => {
        if (!contract_info.contract_id) {
            const urlArray = /[^/]*$/.exec(location.pathname);
            onMount(urlArray ? +urlArray[0] : undefined);
        }
    }, [location.pathname, onMount, contract_info.contract_id]);

    return {
        contract_info,
        contract,
        is_loading: !contract_info.contract_id,
    };
};

export default useContractDetails;
