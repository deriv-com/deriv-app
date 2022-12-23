import React from 'react';
import { Text } from '@deriv/components';
import CurrencySwitcherContainer from 'Components/containers/currency-switcher-container';
import BalanceText from 'Components/elements/text/balance-text';
import { useStores } from 'Stores/index';
import './demo-account-card.scss';

const DemoAccountCard = () => {
    const { traders_hub } = useStores();
    const {
        total_platform_demo_balance: { currency, balance },
        selected_account_type,
    } = traders_hub;

    return (
        <CurrencySwitcherContainer
            className='demo-account-card'
            title={
                <Text className='demo-account-card__title' size='xs' line_height='s'>
                    {selected_account_type}
                </Text>
            }
            icon='VIRTUAL'
        >
            <BalanceText currency={currency} balance={balance} size='xs' />
        </CurrencySwitcherContainer>
    );
};

export default DemoAccountCard;
