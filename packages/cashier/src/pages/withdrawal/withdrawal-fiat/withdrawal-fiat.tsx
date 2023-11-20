import React from 'react';
import { useStore, observer } from '@deriv/stores';
import { Real } from '../../../components/cashier-container';
import { useCashierStore } from '../../../stores/useCashierStores';

const WithdrawalFiat = observer(() => {
    const { client } = useStore();
    const {
        verification_code: { payment_withdraw: verification_code },
    } = client;
    const { withdraw } = useCashierStore();
    const { onMountWithdraw: onMount } = withdraw;

    React.useEffect(() => {
        onMount(verification_code);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return <Real />;
});

export default WithdrawalFiat;
