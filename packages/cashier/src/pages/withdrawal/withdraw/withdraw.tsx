import React from 'react';
import { observer } from '@deriv/stores';
import { useCashierStore } from '../../../stores/useCashierStores';
import { WithdrawalFiatModule } from '../../../modules/withdrawal-fiat';

const Withdraw = observer(() => {
    const { general_store, withdraw } = useCashierStore();
    const { setActiveTab } = general_store;
    const { container } = withdraw;

    React.useEffect(() => {
        setActiveTab(container);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return <WithdrawalFiatModule />;
});

export default Withdraw;
