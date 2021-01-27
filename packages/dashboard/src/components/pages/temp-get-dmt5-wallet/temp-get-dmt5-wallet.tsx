import * as React from 'react';
import { Button } from '@deriv/components';
import { observer } from 'mobx-react-lite';
import { useStores } from 'Stores';
import AccountWizard from 'Components/elements/account-wizard';
import MT5PasswordModal from 'Components/modals/mt5-password-modal';
import GetWalletModal from 'Components/modals/get-wallet-modal';

// TODO: Temp component. This should be removed after integrating with MT5 signup
const TempGetDMT5Wallet: React.FC = observer(() => {
    const { mt5_store, ui_store } = useStores();
    const { is_real_acc_signup_on } = ui_store;

    return (
        <div className='dw-temp-get-dmt5-wallet'>
            <React.Fragment>
                {is_real_acc_signup_on && <AccountWizard />}
                {!is_real_acc_signup_on && (
                    <Button primary large onClick={mt5_store.enableMt5PasswordModal}>
                        Get Mt5
                    </Button>
                )}
            </React.Fragment>
            <MT5PasswordModal />
            <GetWalletModal />
        </div>
    );
});

export default TempGetDMT5Wallet;
