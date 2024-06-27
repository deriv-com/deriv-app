import React, { useEffect } from 'react';
import { useLocation } from 'react-router';
import { useStore } from '@deriv/stores';

const useContractDetails = () => {
    const store = useStore();
    const { contract_replay, contract_trade } = store;
    const { getContractById } = contract_trade;
    const { contract_store, onMount, onUnmount } = contract_replay;

    const { contract_info } = contract_store;
    const contract = getContractById(contract_info.contract_id);
    const location = useLocation();

    useEffect(() => {
        const urlContractId = location.pathname.split('/').pop();
        if (urlContractId != contract_info.contract_id) {
            onMount(parseInt(urlContractId));
        }
    }, [location.pathname, onMount, onUnmount, contract_info.contract_id]);

    return {
        contract_info,
        contract,
        is_loading: !contract_info.contract_id,
    };
};

export default useContractDetails;
