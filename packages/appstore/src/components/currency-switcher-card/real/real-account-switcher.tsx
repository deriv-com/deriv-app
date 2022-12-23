import React from 'react';
import { observer } from 'mobx-react-lite';
import { useStores } from 'Stores/index';
import StatusBadge from './switcher-status-badge';
import { Button, Text } from '@deriv/components';
import CurrencySwitcherContainer from 'Components/containers/currency-switcher-container';
import BalanceText from 'Components/elements/text/balance-text';
import './real-account-switcher.scss';

const AccountNeedsVerification = () => {
    return (
        <CurrencySwitcherContainer
            className='demo-account-card'
            title={
                <Text size='xs' line_height='s'>
                    Needs Verification
                </Text>
            }
            icon='VIRTUAL'
        >
            <StatusBadge />
        </CurrencySwitcherContainer>
    );
};

const RealAccountCard = observer(() => {
    return (
        <CurrencySwitcherContainer
            className='demo-account-card'
            title={
                <Text size='xs' line_height='s'>
                    US Dollar
                </Text>
            }
            icon='USD'
            actions={<Button secondary>Deposit</Button>}
        >
            <BalanceText currency='USD' balance={0.0} size='xs' />
        </CurrencySwitcherContainer>
    );
});

const RealAccountSwitcher = () => {
    const { client } = useStores();

    if (client.is_authentication_needed) {
        return <AccountNeedsVerification />;
    }

    return <RealAccountCard />;
};

export default observer(RealAccountSwitcher);
