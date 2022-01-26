import { useIsMounted } from '@deriv/shared';
import * as React from 'react';
import { requestWS } from '../../utils/websocket';

export const useUpdatingAvailableBalance = (initial_balance = null) => {
    const [available_balance, setAvailableBalance] = React.useState(initial_balance);
    const isMounted = useIsMounted();

    const updateAvailableBalance = () => {
        requestWS({ p2p_advertiser_info: 1 }).then(response => {
            if (!isMounted()) return;
            if (response.p2p_advertiser_info) {
                setAvailableBalance(response.p2p_advertiser_info.balance_available);
            }
        });
    };

    React.useEffect(() => {
        if (!initial_balance) updateAvailableBalance();
        const interval = setInterval(updateAvailableBalance, 10000);
        return () => clearInterval(interval);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return available_balance;
};
