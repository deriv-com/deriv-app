import React from 'react';
import { observer } from 'mobx-react-lite';
import { Text, StaticUrl } from '@deriv/components';
import { useStore } from '@deriv/stores';
import { Localize } from '@deriv/translations';
import ListingContainer from 'Components/containers/listing-container';
import PlatformLoader from 'Components/pre-loader/platform-loader';
import TradingAppCard from 'Components/containers/trading-app-card';
import { BrandConfig } from 'Constants/platform-config';
import { getHasDivider } from 'Constants/utils';
import './options-miltipliers-listing-logged-out.scss';

const OptionsTitleLoggedOut = observer(() => {
    const { traders_hub, ui } = useStore();
    const { is_eu_user } = traders_hub;
    const { is_mobile } = ui;

    if (is_mobile) return null;
    return is_eu_user ? (
        <Text size='sm' weight='bold' color='prominent'>
            <Localize i18n_default_text='Multipliers' />
        </Text>
    ) : (
        <Text size='sm' weight='bold' color='prominent'>
            <Localize i18n_default_text='Options & Multipliers' />
        </Text>
    );
});

const Description = observer(() => {
    const { traders_hub } = useStore();
    const { is_eu_user } = traders_hub;

    return is_eu_user ? (
        <Text size='xs'>
            <Localize
                i18n_default_text='Get the upside of CFDs without risking more than your initial stake with <0>Multipliers</0>.'
                components={[<StaticUrl key={0} className='options' href='trade-types/multiplier/' />]}
            />
        </Text>
    ) : (
        <div className='options-miltipliers-listing-logged-out__description'>
            <Text size='xs'>
                <Localize
                    i18n_default_text='<0>Options</0> allow you to predict the market direction and earn potential payouts based on the outcome. <1>Multipliers</1> let you trade with leverage and limit your risk to your stake.'
                    components={[
                        <StaticUrl
                            key={0}
                            className='options'
                            href='trade-types/options/digital-options/up-and-down/'
                        />,
                        <StaticUrl key={1} className='options' href='trade-types/multiplier/' />,
                    ]}
                />
            </Text>
        </div>
    );
});

const OptionsAndMultipliersListingLoggedOut = observer(() => {
    const { traders_hub, client } = useStore();
    const { available_platforms, is_eu_user } = traders_hub;
    const { is_landing_company_loaded } = client;

    return (
        <ListingContainer title={<OptionsTitleLoggedOut />} description={<Description />}>
            {is_landing_company_loaded ? (
                available_platforms.map((available_platform: BrandConfig, index: number) => (
                    <TradingAppCard
                        key={`trading_app_card_${available_platform.name}`}
                        {...available_platform}
                        action_type='trade'
                        clickable_icon
                        is_deriv_platform
                        market_type='all'
                        has_divider={!is_eu_user && getHasDivider(index, available_platforms.length, 3)}
                    />
                ))
            ) : (
                <PlatformLoader />
            )}
        </ListingContainer>
    );
});

export default OptionsAndMultipliersListingLoggedOut;
