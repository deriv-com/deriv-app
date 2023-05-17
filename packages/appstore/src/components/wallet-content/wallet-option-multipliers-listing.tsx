import React from 'react';
import { Text, StaticUrl } from '@deriv/components';
import { Localize, localize } from '@deriv/translations';
import ListingContainer from 'Components/containers/listing-container';
import TradingAppCard from 'Components/containers/trading-app-card';
import PlatformLoader from 'Components/pre-loader/platform-loader';
import { getHasDivider } from 'Constants/utils';
import { TCoreStores } from '@deriv/stores/types';
import { useStore, observer } from '@deriv/stores';
import { useContentFlag } from '@deriv/hooks';

type TProps = {
    wallet_account: TCoreStores['client']['accounts'][0];
};

const WalletOptionsAndMultipliersListing = observer(({ wallet_account }: TProps) => {
    const { low_risk_cr_non_eu, low_risk_cr_eu, high_risk_cr, cr_demo } = useContentFlag();
    const { traders_hub, client, ui } = useStore();
    const { is_mobile, setShouldShowCooldownModal, openRealAccountSignup } = ui;
    const { is_landing_company_loaded, is_eu, has_maltainvest_account, real_account_creation_unlock_date } = client;
    const { available_platforms, is_eu_user, is_real, no_MF_account, no_CR_account, is_demo } = traders_hub;

    const OptionsTitle = () => {
        if ((low_risk_cr_non_eu || high_risk_cr || cr_demo) && !is_mobile) {
            return (
                <Text size='sm' line_height='m' weight='bold'>
                    {localize('Options & Multipliers')}
                </Text>
            );
        } else if ((low_risk_cr_eu || is_eu) && !is_mobile) {
            return (
                <Text size='sm' line_height='m' weight='bold' color='prominent'>
                    {localize('Multipliers')}
                </Text>
            );
        }
        return null;
    };

    const listing_container_description =
        low_risk_cr_non_eu || high_risk_cr || cr_demo ? (
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
        );

    return (
        <ListingContainer
            wallet_account={wallet_account}
            className='wallet-content__border-reset'
            title={<OptionsTitle />}
            description={listing_container_description}
            is_deriv_platform
        >
            {is_real && (no_CR_account || no_MF_account) && (
                <div className='full-row'>
                    <TradingAppCard
                        action_type='get'
                        availability='All'
                        clickable_icon
                        name={localize('Deriv account')}
                        description={localize('Get a real Deriv account, start trading and manage your funds.')}
                        icon='Options'
                        onAction={() => {
                            if (no_MF_account) {
                                if (real_account_creation_unlock_date) {
                                    setShouldShowCooldownModal(true);
                                } else {
                                    openRealAccountSignup('maltainvest');
                                }
                            } else {
                                openRealAccountSignup();
                            }
                        }}
                    />
                </div>
            )}

            {is_landing_company_loaded ? (
                available_platforms.map((available_platform, index) => (
                    <TradingAppCard
                        key={`trading_app_card_${available_platform.name}`}
                        {...available_platform}
                        action_type={
                            is_demo || (!no_CR_account && !is_eu_user) || (has_maltainvest_account && is_eu_user)
                                ? 'trade'
                                : 'none'
                        }
                        is_deriv_platform
                        has_divider={(!is_eu_user || is_demo) && getHasDivider(index, available_platforms.length, 3)}
                    />
                ))
            ) : (
                <PlatformLoader />
            )}
        </ListingContainer>
    );
});

export default WalletOptionsAndMultipliersListing;
