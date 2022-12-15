import React from 'react';
import { observer } from 'mobx-react-lite';
import { Text, StaticUrl } from '@deriv/components';
import { Localize, localize } from '@deriv/translations';
import ListingContainer from 'Components/containers/listing-container';
import { BrandConfig } from 'Constants/platform-config';
import TradingAppCard from 'Components/containers/trading-app-card';
import { useStores } from 'Stores/index';
import { isMobile } from '@deriv/shared';

const OptionsAndMultipliersListing = () => {
    const { tradinghub } = useStores();
    const is_demo = tradinghub.selected_account_type === 'demo';
    const has_real_account = tradinghub.has_any_real_account;

    return (
        <ListingContainer
            title={
                !isMobile() && (
                    <Text size='sm' line_height='m' weight='bold'>
                        <Localize i18n_default_text='Options & Multipliers' />
                    </Text>
                )
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
            is_deriv_platform
        >
            {!is_demo && !has_real_account && (
                <div className='full-row'>
                    <TradingAppCard name={localize('Deriv account')} icon='Options' availability='All' type='get' />
                </div>
            )}
            {tradinghub.available_platforms.map((available_platform: BrandConfig) => (
                <TradingAppCard
                    key={`trading_app_card_${available_platform.name}`}
                    {...available_platform}
                    type={is_demo || has_real_account ? 'trade' : 'none'}
                />
            ))}
        </ListingContainer>
    );
};

export default observer(OptionsAndMultipliersListing);
