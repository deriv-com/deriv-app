import React from 'react';
import { Text, StaticUrl } from '@deriv/components';
import { Localize } from '@deriv/translations';
import ListingContainer from 'Components/containers/listing-container';
import { platform_config } from 'Constants/platform-config';
import TradingAppCard from 'Components/containers/trading-app-card';

const OptionsAndMultipliersListing = () => {
    return (
        <ListingContainer
            title={
                <Text size='sm' line_height='m' weight='bold'>
                    <Localize i18n_default_text='Options & Multiplier' />
                </Text>
            }
            description={
                <Text size='xs' line_height='s'>
                    <Localize
                        i18n_default_text='Earn a range of payouts by correctly predicting market price movements with <0>Options</0>, or get the
                    upside of CFDs without risking more than your initial stake with <1>Multipliers</1>.'
                        components={[
                            <StaticUrl key={0} className='link' href='trade-types/options/' />,
                            <StaticUrl key={1} className='link' href='trade-types/multiplier/' />,
                        ]}
                    />
                </Text>
            }
        >
            {platform_config.map(p => (
                <TradingAppCard key={p.app_desc} {...p} />
            ))}
        </ListingContainer>
    );
};

export default OptionsAndMultipliersListing;
