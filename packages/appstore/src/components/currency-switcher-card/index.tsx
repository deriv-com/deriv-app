import React from 'react';
import { observer } from 'mobx-react-lite';
import DemoAccountCard from './demo/demo-account-card';
import RealAccountSwitcher from './real/real-account-switcher';
import { useStores } from 'Stores/index';

const CurrencySwitcherCard = () => {
    const { traders_hub, client } = useStores();
    const { has_any_real_account, has_maltainvest_account } = client;
    const { selected_region } = traders_hub;

    if (
        (traders_hub.selected_account_type === 'real' && selected_region === 'Non-EU' && has_any_real_account) ||
        (selected_region === 'EU' && has_maltainvest_account)
    ) {
        return <RealAccountSwitcher />;
    } else if (traders_hub.selected_account_type === 'demo') {
        return <DemoAccountCard />;
    }
    return null;
};

export default observer(CurrencySwitcherCard);
