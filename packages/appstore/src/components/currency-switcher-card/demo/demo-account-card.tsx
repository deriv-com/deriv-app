import React from 'react';
import { Text } from '@deriv/components';
import CurrencySwitcherContainer from 'Components/containers/currency-switcher-container';
import BalanceText from 'Components/elements/text/balance-text';
import { useStores } from 'Stores/index';

const DemoAccountCard = () => {
    const { traders_hub } = useStores();

    return (
        <CurrencySwitcherContainer
            title={
                <Text size='xs' line_height='s'>
                    Demo
                </Text>
            }
            icon='VIRTUAL'
        >
            <BalanceText currency='USD' balance={100000} size='xs' />
        </CurrencySwitcherContainer>
    );
};

export default DemoAccountCard;
