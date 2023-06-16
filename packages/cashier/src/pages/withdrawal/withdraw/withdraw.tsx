import React from 'react';
import { useStore, observer } from '@deriv/stores';
import { useCashierStore } from '../../../stores/useCashierStores';
import { WithdrawalFiatModule } from '../../../modules/withdrawal-fiat';

const Withdraw = observer(() => {
    const { client } = useStore();
    const {
        verification_code: { payment_withdraw: verification_code },
    } = client;
    const { general_store, withdraw } = useCashierStore();
    const { setActiveTab } = general_store;
    const { container, onMountWithdraw: onMount } = withdraw;

    React.useEffect(() => {
        setActiveTab(container);
        onMount(verification_code);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return <WithdrawalFiatModule />;
});

export default Withdraw;
