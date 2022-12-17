import React from 'react';
import { observer } from 'mobx-react-lite';
import DemoAccountCard from './demo/demo-account-card';
import RealAccountSwitcher from './real/real-account-switcher';
import { useStores } from 'Stores/index';

const CurrencySwitcherCard = () => {
    const { tradinghub } = useStores();

    if (tradinghub.selected_account_type === 'real') {
        return <RealAccountSwitcher />;
    }
    return <DemoAccountCard />;
};

export default observer(CurrencySwitcherCard);
