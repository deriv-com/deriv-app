import React from 'react';
import { connect } from 'Stores/connect';
import RootStore from 'Stores/types';
import CashierContainer from './cashier-container.jsx';

type TWithdrawProps = {
    container: string;
    iframe_height: number | string;
    iframe_url: string;
    is_loading: boolean;
    verification_code: string;
    clearIframe: () => void;
    onMount: (verification_code: string) => void;
    setActiveTab: (container: string) => void;
};

const Withdraw = ({
    container,
    iframe_height,
    iframe_url,
    clearIframe,
    is_loading,
    onMount,
    setActiveTab,
    verification_code,
}: TWithdrawProps) => {
    React.useEffect(() => {
        setActiveTab(container);
        onMount(verification_code);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <CashierContainer
            iframe_height={iframe_height}
            iframe_url={iframe_url}
            clearIframe={clearIframe}
            is_loading={is_loading}
        />
    );
};

export default connect(({ client, modules }: RootStore) => ({
    container: modules.cashier.withdraw.container,
    iframe_height: modules.cashier.iframe.iframe_height,
    iframe_url: modules.cashier.iframe.iframe_url,
    clearIframe: modules.cashier.iframe.clearIframe,
    is_loading: modules.cashier.general_store.is_loading,
    onMount: modules.cashier.withdraw.onMountWithdraw,
    setActiveTab: modules.cashier.general_store.setActiveTab,
    verification_code: client.verification_code.payment_withdraw,
}))(Withdraw);
