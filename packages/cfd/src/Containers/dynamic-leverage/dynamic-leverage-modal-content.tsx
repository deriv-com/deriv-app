import React from 'react';
import { Text } from '@deriv/components';
import { localize } from '@deriv/translations';
import { dynamicLeverages } from '../../Constants/dynamic-leverage-content/dynamic-leverage-content';
import { DynamicLeverageMarketCard } from './dynamic-leverage-market-card';

const DynamicLeverageModalContent = () => {
    return (
        <div className='dynamic-leverage-modal'>
            <Text data-testid='header-text' size='s'>
                {localize(
                    'Enjoy dynamic leverage of up to 1:1500 when trading selected instruments in the forex, commodities, cryptocurrencies, and stock indices markets. Our dynamic leverage adjusts automatically to your trading position, based on asset type and trading volume.'
                )}
            </Text>
            <div className='dynamic-leverage-modal__content'>
                {dynamicLeverages.map(market => (
                    <DynamicLeverageMarketCard
                        key={market.key}
                        market={market.title}
                        leverage={market.leverage}
                        market_example={market.description}
                        dynamicLeverages={market.data}
                    />
                ))}
            </div>
        </div>
    );
};

export default DynamicLeverageModalContent;
