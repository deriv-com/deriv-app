import * as React from 'react';
import { observer } from 'mobx-react-lite';
import { localize } from '@deriv/translations';
import { Button } from '@deriv/components';
import { useStores } from 'Stores';
import AccountWizard from 'Components/elements/account-wizard';
import GetWalletModal from 'Components/modals/get-wallet-modal';

// Temp component. Should be removed after integrating with MT5 signup
const TempGetDMT5Wallet: React.FC = observer(() => {
    const { client_store, ui_store } = useStores();
    const { is_real_acc_signup_on, openRealAccountSignup } = ui_store;
    if (!client_store.is_logged_in) return null;
    return (
        <div className='dw-temp-get-dmt5-wallet'>
            <React.Fragment>
                {is_real_acc_signup_on && <AccountWizard />}
                {!is_real_acc_signup_on && (
                    <Button primary large onClick={openRealAccountSignup}>
                        Get Deriv Wallet
                    </Button>
                )}
            </React.Fragment>
            <GetWalletModal app_title={localize('Deriv Wallet')} app_icon={'IcBrandDmt5Synthetics'} />
        </div>
    );
});

export default TempGetDMT5Wallet;
