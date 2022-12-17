import React from 'react';
import { Text } from '@deriv/components';
import CurrencySwitcherContainer from 'Components/containers/currency-switcher-container';

const DemoAccountCard = () => {
    return (
        <CurrencySwitcherContainer
            title={
                <Text size='xs' line_height='s'>
                    Demo
                </Text>
            }
            icon='VIRTUAL'
        >
            Demo Account Card
        </CurrencySwitcherContainer>
    );
};

export default DemoAccountCard;
