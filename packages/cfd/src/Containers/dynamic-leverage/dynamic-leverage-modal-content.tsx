import React from 'react';
import { Text } from '@deriv/components';
import { localize } from '@deriv/translations';
import { dynamic_leverages } from '../../Constants/dynamic-leverage-content/dynamic-leverage-content';
import { DynamicLeverageMarketCard } from './dynamic-leverage-market-card';

const DynamicLeverageModalContent = () => (
    <div className='dynamic-leverage-modal'>
        <Text as='h4' size='s'>
            {localize(
                'Enjoy dynamic leverage of up to 1:1500 when trading selected instruments in the forex, commodities, cryptocurrencies, and stock indices markets. Our dynamic leverage adjusts automatically to your trading position, based on asset type and trading volume.'
            )}
        </Text>
        <div className='dynamic-leverage-modal__content'>
            {dynamic_leverages.map(market => (
                <DynamicLeverageMarketCard
                    key={`dynamic-leverage-modal__${market.key}`}
                    title={market.title}
                    leverage={market.leverage}
                    description={market.description}
                    data={market.data}
                />
            ))}
        </div>
    </div>
);

export default DynamicLeverageModalContent;
