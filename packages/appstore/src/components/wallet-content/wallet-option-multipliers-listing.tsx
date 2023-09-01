import React from 'react';
import { Text, StaticUrl } from '@deriv/components';
import { Localize, localize } from '@deriv/translations';
import ListingContainer from 'Components/containers/listing-container';
import TradingAppCard from 'Components/containers/trading-app-card';
import PlatformLoader from 'Components/pre-loader/platform-loader';
import { getHasDivider } from 'Constants/utils';
import { useStore, observer } from '@deriv/stores';
import { useActiveWallet } from '@deriv/hooks';
import './wallet-content.scss';

type TProps = {
    landing_company_name: string | undefined;
};

const OptionsTitle = observer(({ landing_company_name }: TProps) => {
    const {
        ui: { is_mobile },
    } = useStore();

    const is_svg_wallet = landing_company_name === 'svg';

    if (is_svg_wallet && !is_mobile) {
        return (
            <Text size='sm' weight='bold' color='prominent'>
                {localize('Options & multipliers')}
            </Text>
        );
    } else if (!is_svg_wallet && !is_mobile) {
        return (
            <Text size='sm' weight='bold' color='prominent'>
                {localize('Multipliers')}
            </Text>
        );
    }
    return null;
});

const ListingContainerDescription = ({ landing_company_name }: TProps) =>
    landing_company_name === 'svg' ? (
        <Text size='xs' line_height='s'>
            <Localize
                i18n_default_text='Earn a range of payouts by correctly predicting market price movements with <0>options</0>, or get the upside of CFDs without risking more than your initial stake with <1>multipliers</1>.'
                components={[
                    <StaticUrl key={0} className='options' href='trade-types/options/' />,
                    <StaticUrl key={1} className='options' href='trade-types/multiplier/' />,
                ]}
            />
        </Text>
    ) : (
        <Text size='xs' line_height='s'>
            <Localize
                i18n_default_text='Get the upside of CFDs without risking more than your initial stake with <0>multipliers</0>.'
                components={[<StaticUrl key={0} className='options' href='trade-types/multiplier/' />]}
            />
        </Text>
    );

const WalletOptionsAndMultipliersListing = observer(() => {
    const { traders_hub, client, ui } = useStore();
    const { is_mobile, setShouldShowCooldownModal, openRealAccountSignup } = ui;
    const { is_landing_company_loaded, real_account_creation_unlock_date, is_logging_in, is_switching } = client;
    const { available_platforms, no_MF_account } = traders_hub;

    const wallet_account = useActiveWallet();

    if (!wallet_account || is_switching || is_logging_in || !is_landing_company_loaded)
        return (
            <div className='wallet-content__loader'>
                <PlatformLoader />
            </div>
        );

    const is_trading_account_exists = wallet_account.linked_to?.some(acc => acc.platform === 'dtrade');
    const is_svg_jurisdiction_text = wallet_account.landing_company_name === 'svg' || wallet_account.is_demo;

    const get_account_card_name = wallet_account.is_malta_wallet
        ? localize('Deriv Apps account')
        : localize('Deriv Apps');
    const get_account_card_description = wallet_account.is_malta_wallet
        ? localize('Get a Deriv Apps trading account regulated by MFSA to trade multipliers on Deriv Trader.')
        : localize('Get a Deriv Apps trading account to trade options and multipliers on these apps.');

    return (
        <ListingContainer
            wallet_account={is_trading_account_exists ? wallet_account : undefined}
            className='wallet-content__border-reset'
            title={<OptionsTitle landing_company_name={wallet_account.landing_company_name} />}
            description={<ListingContainerDescription landing_company_name={wallet_account.landing_company_name} />}
            is_deriv_platform
        >
            {!is_trading_account_exists && (
                <div className='full-row'>
                    <TradingAppCard
                        action_type='get'
                        availability='All'
                        clickable_icon
                        name={get_account_card_name}
                        description={get_account_card_description}
                        icon='Options'
                        onAction={() => {
                            if (no_MF_account) {
                                if (real_account_creation_unlock_date) {
                                    setShouldShowCooldownModal(true);
                                } else {
                                    openRealAccountSignup('maltainvest');
                                }
                            } else {
                                openRealAccountSignup('svg');
                            }
                        }}
                    />
                </div>
            )}
            {available_platforms.map((available_platform, index) => (
                <TradingAppCard
                    key={`trading_app_card_${available_platform.name}`}
                    {...available_platform}
                    action_type={is_trading_account_exists ? 'trade' : 'none'}
                    is_deriv_platform
                    has_divider={getHasDivider(index, available_platforms.length, 3)}
                />
            ))}
        </ListingContainer>
    );
});

export default WalletOptionsAndMultipliersListing;
