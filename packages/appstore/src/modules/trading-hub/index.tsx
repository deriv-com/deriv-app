import * as React from 'react';
import { Button } from '@deriv/ui';
import WalletWizard from 'Components/wallet-wizard';

const TradingHub = () => {
    const [is_wallet_wizard_open, setIsWalletWizardOpen] = React.useState(false);

    return (
        <div className='trading-hub'>
            Trading Hub
            <Button onClick={() => setIsWalletWizardOpen(true)}>Get more wallets</Button>
            {is_wallet_wizard_open && <WalletWizard close={() => setIsWalletWizardOpen(false)} />}
        </div>
    );
};

export default TradingHub;
