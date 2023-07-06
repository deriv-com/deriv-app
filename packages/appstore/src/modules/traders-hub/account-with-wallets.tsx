import React from 'react';
import Wallet from 'Components/containers/wallet';
import { observer, useStore } from '@deriv/stores';
import { useWalletsList } from '@deriv/hooks';
import WalletTourGuide from 'Modules/tour-guide/wallet-tour-guide';

const AccountWithWallets = observer(() => {
    const { traders_hub, ui } = useStore();
    const { is_wallet_tour_open } = traders_hub;
    const { is_wallet_switching } = ui;
    const { data } = useWalletsList();

    const wallets_ref = React.useRef() as React.MutableRefObject<HTMLDivElement>;

    React.useEffect(() => {
        if (is_wallet_tour_open && is_wallet_switching) {
            setTimeout(() => {
                wallets_ref?.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 200);
        }
    }, [is_wallet_tour_open, is_wallet_switching]);

    return (
        <div ref={wallets_ref}>
            {data?.map(wallet => (
                <Wallet key={wallet.loginid} wallet_account={wallet} />
            ))}
            {data && <WalletTourGuide />}
        </div>
    );
});

export default AccountWithWallets;
