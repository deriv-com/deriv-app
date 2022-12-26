import React from 'react';
import { observer } from 'mobx-react-lite';
import { Text, StaticUrl } from '@deriv/components';
import { Localize, localize } from '@deriv/translations';
import ListingContainer from 'Components/containers/listing-container';
import { BrandConfig } from 'Constants/platform-config';
import TradingAppCard from 'Components/containers/trading-app-card';
import { useStores } from 'Stores/index';
import { isMobile } from '@deriv/shared';
import PlatformLoader from 'Components/pre-loader/platform-loader';

const OptionsAndMultipliersListing = () => {
    const { traders_hub, client } = useStores();
    const { available_platforms, selected_account_type, has_any_real_account, is_eu_selected } = traders_hub;
    const is_demo = selected_account_type === 'demo';
    const { is_eu, is_landing_company_loaded } = client;

    const OptionsTitle = () => {
        if (!is_eu_selected && !is_eu) {
            return (
                <Text size='sm' line_height='m' weight='bold'>
                    <Localize i18n_default_text='Options & Multipliers' />
                </Text>
            );
        } else if (isMobile()) {
            return null;
        }
        return (
            <Text size='sm' line_height='m' weight='bold'>
                <Localize i18n_default_text='Multipliers' />
            </Text>
        );
    };

    return (
        <ListingContainer
            title={<OptionsTitle />}
            description={
                !is_eu_selected && !is_eu ? (
                    <Text size='xs' line_height='s'>
                        <Localize
                            i18n_default_text='Earn a range of payouts by correctly predicting market price movements with <0>Options</0>, or get the
                    upside of CFDs without risking more than your initial stake with <1>Multipliers</1>.'
                            components={[
                                <StaticUrl key={0} className='options' href='trade-types/options/' />,
                                <StaticUrl key={1} className='options' href='trade-types/multiplier/' />,
                            ]}
                        />
                    </Text>
                ) : (
                    <Text size='xs' line_height='s'>
                        <Localize
                            i18n_default_text='Get the upside of CFDs without risking more than your initial stake with <0>Multipliers</0>.'
                            components={[<StaticUrl key={0} className='options' href='trade-types/multiplier/' />]}
                        />
                    </Text>
                )
            }
            is_deriv_platform
        >
            {!is_demo && !has_any_real_account && (
                <div className='full-row'>
                    <TradingAppCard
                        name={localize('Deriv account')}
                        description={localize('Get a real Deriv account, start trading and manage your funds')}
                        icon='Options'
                        availability='All'
                        type='get'
                    />
                </div>
            )}
            {is_landing_company_loaded ? (
                available_platforms.map((available_platform: BrandConfig, index: number) => (
                    <TradingAppCard
                        key={`trading_app_card_${available_platform.name}`}
                        {...available_platform}
                        type={is_demo || has_any_real_account ? 'trade' : 'none'}
                        is_deriv_platform
                        has_divider={index < 3}
                    />
                ))
            ) : (
                <PlatformLoader />
            )}
        </ListingContainer>
    );
};

export default observer(OptionsAndMultipliersListing);
