import React from 'react';
import { Text, StaticUrl } from '@deriv/components';
import { Localize, localize } from '@deriv/translations';
import ListingContainer from 'Components/containers/listing-container';
import { BrandConfig } from 'Constants/platform-config';
import TradingAppCard from 'Components/containers/trading-app-card';
import PlatformLoader from 'Components/pre-loader/platform-loader';
import { getHasDivider } from 'Constants/utils';
import { TCoreStores } from '@deriv/stores/types';
import { useStore, observer } from '@deriv/stores';

type TProps = {
    account: TCoreStores['client']['accounts'][0];
};

const WalletOptionsAndMultipliersListing = observer(({ account }: TProps) => {
    const { traders_hub, client, ui } = useStore();
    const { is_mobile } = ui;
    const { is_landing_company_loaded } = client;
    const { available_platforms } = traders_hub;

    const { is_virtual, landing_company_shortcode } = account;
    const is_eu = landing_company_shortcode === 'maltainvest' || landing_company_shortcode === 'malta';

    const OptionsTitle = () => {
        if (!is_virtual && is_eu && !is_mobile) {
            return (
                <Text size='sm' line_height='m' weight='bold' color='prominent'>
                    {localize('Multipliers')}
                </Text>
            );
        } else if (!is_mobile) {
            return (
                <Text size='sm' line_height='m' weight='bold'>
                    {localize('Options & Multipliers')}
                </Text>
            );
        }
        return null;
    };

    return (
        <ListingContainer
            wallet_account={account}
            className='wallet-content__border-reset'
            title={<OptionsTitle />}
            description={
                is_virtual || !is_eu ? (
                    <Text size='xs' line_height='s'>
                        <Localize
                            i18n_default_text='Earn a range of payouts by correctly predicting market price movements with <0>options</0>, or get the
                    upside of CFDs without risking more than your initial stake with <1>multipliers</1>.'
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
            {is_landing_company_loaded ? (
                available_platforms.map((available_platform: BrandConfig, index: number) => (
                    <TradingAppCard
                        key={`trading_app_card_${available_platform.name}`}
                        {...available_platform}
                        action_type='trade'
                        is_deriv_platform
                        has_divider={(!is_eu || !!is_virtual) && getHasDivider(index, available_platforms.length, 3)}
                    />
                ))
            ) : (
                <PlatformLoader />
            )}
        </ListingContainer>
    );
});

export default WalletOptionsAndMultipliersListing;
