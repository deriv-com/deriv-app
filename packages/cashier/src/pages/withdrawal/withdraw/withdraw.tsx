import React from 'react';
import { useStore, observer } from '@deriv/stores';
import { Real } from '../../../components/cashier-container';
import { useCashierStore } from '../../../stores/useCashierStores';

const Withdraw = observer(() => {
    const { client } = useStore();
    const {
        verification_code: { payment_withdraw: verification_code },
    } = client;
    const { general_store, withdraw } = useCashierStore();
    const { setActiveTab } = general_store;
    const { onMountWithdraw: onMount } = withdraw;

    React.useEffect(() => {
        setActiveTab('withdraw');
        onMount(verification_code);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return <Real />;
});

export default Withdraw;
