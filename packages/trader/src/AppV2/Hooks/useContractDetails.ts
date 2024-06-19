import React, { useEffect } from 'react';
import { useLocation } from 'react-router';
import { useStore } from '@deriv/stores';

const usePrevious = value => {
    const ref = React.useRef();
    React.useEffect(() => {
        ref.current = value;
    });

    return ref.current;
};

const useContractDetails = () => {
    const store = useStore();
    const { contract_replay, contract_trade } = store;
    const { getContractById } = contract_trade;
    const { contract_store, onMount, onUnmount } = contract_replay;

    const { contract_info } = contract_store;
    const contract = getContractById(contract_info.contract_id);
    const location = useLocation();

    useEffect(() => {
        if (!contract_info.contract_id) {
            const urlContractId = location.pathname.split('/').pop();
            onMount(parseInt(urlContractId));
        }
        return () => onUnmount();
    }, [location.pathname, onMount, onUnmount, contract_info.contract_id]);

    return {
        contract_info,
        contract,
        is_loading: !contract_info.contract_id,
    };
};

export default useContractDetails;
