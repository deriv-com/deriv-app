import React from 'react';
import { observer, useStore } from '@deriv/stores';
import RealAccountSignup from 'App/Containers/RealAccountSignup';
import SetAccountCurrencyModal from 'App/Containers/SetAccountCurrencyModal';
import HeaderAccountActionsDTraderV2 from 'App/Components/Layout/Header/dtrader-v2/header-account-actions-dtrader-v2';

const DTraderV2Header = observer(() => {
    const { ui } = useStore();
    const { is_real_acc_signup_on } = ui;

    return (
        <header className='header header-v2'>
            <React.Suspense fallback={<div />}>
                <HeaderAccountActionsDTraderV2 />
                {is_real_acc_signup_on && <RealAccountSignup />}
                <SetAccountCurrencyModal />
            </React.Suspense>
        </header>
    );
});

export default DTraderV2Header;
