import * as React from 'react';
import { Button } from '@deriv/ui';
import WalletModal from 'Components/wallet-modal';
import WalletWizard from 'Components/wallet-wizard';
import { useStores } from 'Stores';

const TradingHub = () => {
    const [is_wallet_wizard_open, setIsWalletWizardOpen] = React.useState(false);
    const [is_complete, setIsComplete] = React.useState<boolean>(false);

    const { wallet_store } = useStores();
    const { onMount } = wallet_store;

    React.useEffect(() => {
        onMount();
    }, [onMount]);

    return (
        <div className='trading-hub'>
            <Button onClick={() => setIsWalletWizardOpen(true)}>Get more wallets</Button>
            {is_wallet_wizard_open && (
                <WalletWizard
                    close={() => {
                        setIsWalletWizardOpen(false);
                        setIsComplete(true);
                    }}
                />
            )}
            <WalletModal is_open={is_complete} setIsOpen={setIsComplete} />
        </div>
    );
};

export default TradingHub;
