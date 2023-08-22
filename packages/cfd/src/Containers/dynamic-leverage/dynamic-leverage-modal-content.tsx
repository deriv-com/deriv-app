import React from 'react';
import { Text } from '@deriv/components';
import { Localize } from '@deriv/translations';
import { dynamic_leverages } from '../../Constants/dynamic-leverage-content/dynamic-leverage-content';
import { DynamicLeverageMarketCard } from './dynamic-leverage-market-card';

const DynamicLeverageModalContent = () => (
    <div className='dynamic-leverage-modal'>
        <Text as='h4' size='s'>
            <Localize
                i18n_default_text='Enjoy dynamic leverage of  <0>up to 1:1500</0> when trading selected instruments in the forex, commodities, cryptocurrencies, and stock indices markets. Our dynamic leverage adjusts automatically to your trading position, based on asset type and trading volume.'
                components={[<strong key={0} />]}
            />
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
