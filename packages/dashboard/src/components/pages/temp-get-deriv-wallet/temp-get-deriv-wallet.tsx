import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { useStores } from 'Stores';
import AccountWizard from 'Components/elements/account-wizard';
import GetWalletModal from 'Components/modals/get-wallet-modal';

// Temp component. Should be removed after integrating with MT5 signup
const TempGetDMT5Wallet: React.FC = observer(() => {
    const { client_store } = useStores();
    // const { is_real_acc_signup_on } = ui_store;
    if (!client_store.is_logged_in) return null;
    return (
        <div className='dw-temp-get-dmt5-wallet'>
            <React.Fragment>
                <AccountWizard />
            </React.Fragment>
            <GetWalletModal />
        </div>
    );
});

export default TempGetDMT5Wallet;
