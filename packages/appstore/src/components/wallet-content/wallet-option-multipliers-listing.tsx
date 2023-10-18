import React from 'react';
import { Text, StaticUrl } from '@deriv/components';
import { Localize, localize } from '@deriv/translations';
import ListingContainer from 'Components/containers/listing-container';
import TradingAppCard from 'Components/containers/trading-app-card';
import PlatformLoader from 'Components/pre-loader/platform-loader';
import { getHasDivider } from 'Constants/utils';
import { Jurisdiction } from '@deriv/shared';
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
                <Localize i18n_default_text='Options & multipliers' />
            </Text>
        );
    } else if (!is_svg_wallet && !is_mobile) {
        return (
            <Text size='sm' weight='bold' color='prominent'>
                <Localize i18n_default_text='Multipliers' />
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
                    <StaticUrl key={0} className='options' href='trade-types/options/digital-options/up-and-down/' />,
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
    const { setShouldShowCooldownModal, openRealAccountSignup } = ui;
    const {
        is_landing_company_loaded,
        has_maltainvest_account,
        real_account_creation_unlock_date,
        is_logging_in,
        is_switching,
    } = client;
    const { available_platforms, is_eu_user, is_real, no_MF_account, no_CR_account, is_demo } = traders_hub;

    const wallet_account = useActiveWallet();

    if (!wallet_account || is_switching || is_logging_in || !is_landing_company_loaded) {
        return (
            <div className='wallet-content__loader'>
                <PlatformLoader />
            </div>
        );
    }

    const platforms_action_type =
        is_demo || (!no_CR_account && !is_eu_user) || (has_maltainvest_account && is_eu_user) ? 'trade' : 'none';

    const derivAccountAction = () => {
        if (no_MF_account) {
            if (real_account_creation_unlock_date) {
                setShouldShowCooldownModal(true);
            } else {
                openRealAccountSignup(Jurisdiction.MALTA_INVEST);
            }
        } else {
            openRealAccountSignup(Jurisdiction.SVG);
        }
    };

    return (
        <ListingContainer
            wallet_account={wallet_account}
            className='wallet-content__border-reset'
            title={<OptionsTitle landing_company_name={wallet_account.landing_company_name} />}
            description={<ListingContainerDescription landing_company_name={wallet_account.landing_company_name} />}
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
                        onAction={derivAccountAction}
                    />
                </div>
            )}
            {available_platforms.map((available_platform, index) => (
                <TradingAppCard
                    key={`trading_app_card_${available_platform.name}`}
                    {...available_platform}
                    action_type={platforms_action_type}
                    is_deriv_platform
                    has_divider={getHasDivider(index, available_platforms.length, 3)}
                />
            ))}
        </ListingContainer>
    );
});

export default WalletOptionsAndMultipliersListing;
