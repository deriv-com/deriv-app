import React from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '@deriv/stores';
import { Real } from 'Components/cashier-container';

const Withdraw = () => {
    const {
        client,
        modules: {
            cashier: { iframe, general_store, withdraw },
        },
    } = useStore();

    const {
        verification_code: { payment_withdraw: verification_code },
    } = client;

    const { is_loading, setActiveTab } = general_store;

    const { iframe_height, iframe_url, clearIframe } = iframe;

    const { container, onMountWithdraw: onMount } = withdraw;

    React.useEffect(() => {
        setActiveTab(container);
        onMount(verification_code);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Real iframe_height={iframe_height} iframe_url={iframe_url} clearIframe={clearIframe} is_loading={is_loading} />
    );
};

export default observer(Withdraw);
