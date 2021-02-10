/* eslint-disable react/display-name */
import * as React from 'react';
import { useHistory } from 'react-router-dom';
import { DesktopWrapper, Div100vhContainer, MobileWrapper, FadeWrapper, Text, VerticalTab } from '@deriv/components';
import { getSelectedRoute } from '@deriv/shared';
import { localize } from '@deriv/translations';
import { TRoute, TRouteGroup } from 'Types';
import { useStores } from 'Stores';

import TempButtons from 'Components/temp-buttons';
import DMT5Synthetic from 'Components/pages/platforms/dmt5_synthetic';

const Home: React.FC = () => {
    const history = useHistory();
    const { config_store } = useStores();

    const list = [
        {
            default: false,
            icon: 'IcUserOutline',
            label: localize('My Deriv'),
            is_routed: true,
            path: config_store.routes.home,
            value: () => <Text>My Apps</Text>,
        },
        {
            label: '',
            value: () => '',
            subroutes: [],
        },
        {
            default: true,
            icon: 'IcWalletExplore',
            label: localize('Discover'),
            path: config_store.routes.explore,
            is_routed: true,
            value: () => <TempButtons />,
        },
        {
            default: false,
            icon: 'IcWalletWallets',
            label: localize('Wallets'),
            subroutes: [
                {
                    label: localize('Credit/Debit Cards'),
                    value: () => <Text>Credit/Debit Cards</Text>,
                    // path: config_store.routes.wallets_cards,
                    path: config_store.routes.explore,
                },
                {
                    label: localize('E-wallet'),
                    value: () => <Text>E-wallet</Text>,
                    // path: config_store.routes.wallets_ewallet,
                    path: config_store.routes.explore,
                },
                {
                    label: localize('Cryptocurrency'),
                    value: () => <Text>Cryptocurrency</Text>,
                    // path: config_store.routes.wallets_crypto,
                    path: config_store.routes.explore,
                },
                {
                    label: localize('Bank Wire'),
                    value: () => <Text>Bank Wire</Text>,
                    // path: config_store.routes.wallets_bank,
                    path: config_store.routes.explore,
                },
            ],
        },
        {
            default: false,
            icon: 'IcWalletPlatforms',
            label: localize('Platforms'),
            subroutes: [
                {
                    label: localize('DMT5'),
                    value: () => <Text>DMT5</Text>,
                    // path: config_store.routes.platform_dmt5,
                    path: config_store.routes.platform_dmt5_synthetic,
                },
                {
                    label: localize('DMT5 Financial'),
                    value: () => <Text>DMT5 Financial</Text>,
                    // path: config_store.routes.platform_dmt5_financial,
                    path: config_store.routes.platform_dmt5_synthetic,
                },
                {
                    label: localize('DMT5 Financial Stp'),
                    value: () => <Text>DMT5 Financial Stp</Text>,
                    // path: config_store.routes.platform_dmt5_financial_stp,
                    path: config_store.routes.platform_dmt5_synthetic,
                },
                {
                    label: localize('DMT5 Synthetic'),
                    value: () => <DMT5Synthetic />,
                    path: config_store.routes.platform_dmt5_synthetic,
                },
                {
                    label: localize('DTrader'),
                    value: () => <Text>DTrader</Text>,
                    // path: config_store.routes.platform_dtrader,
                    path: config_store.routes.explore,
                },
                {
                    label: localize('DBot'),
                    value: () => <Text>DBot</Text>,
                    // path: config_store.routes.platform_dbot,
                    path: config_store.routes.explore,
                },
                {
                    label: localize('SmartTrader'),
                    value: () => <Text>SmartTrader</Text>,
                    // path: config_store.routes.platform_smarttrader,
                    path: config_store.routes.explore,
                },
                {
                    label: localize('Binary Bot'),
                    value: () => <Text>Binary Bot</Text>,
                    // path: config_store.routes.platform_binarybot,
                    path: config_store.routes.explore,
                },
            ],
        },
        {
            default: false,
            icon: 'IcWalletTradeTypes',
            label: localize('Trade Types'),
            subroutes: [
                {
                    label: localize('CFDs'),
                    value: () => <Text>CFDs</Text>,
                    // path: config_store.routes.trade_types_cfds,
                    path: config_store.routes.explore,
                },
                {
                    label: localize('Multipliers'),
                    value: () => <Text>Multipliers</Text>,
                    // path: config_store.routes.trade_types_multipliers,
                    path: config_store.routes.explore,
                },
                {
                    label: localize('Options'),
                    value: () => <Text>Options</Text>,
                    // path: config_store.routes.trade_types_options,
                    path: config_store.routes.explore,
                },
            ],
        },
        {
            default: false,
            icon: 'IcWalletMarkets',
            label: localize('Markets'),
            subroutes: [
                {
                    label: localize('Forex'),
                    value: () => <Text>Forex</Text>,
                    // path: config_store.routes.markets_forex,
                    path: config_store.routes.explore,
                },
                {
                    label: localize('Synthetic Indices'),
                    value: () => <Text>Synthetic Indices</Text>,
                    // path: config_store.routes.markets_synthetic,
                    path: config_store.routes.explore,
                },
                {
                    label: localize('Stock Indices'),
                    value: () => <Text>Stock Indices</Text>,
                    // path: config_store.routes.markets_stock,
                    path: config_store.routes.explore,
                },
                {
                    label: localize('Commodities'),
                    value: () => <Text>Commodities</Text>,
                    // path: config_store.routes.markets_commodities,
                    path: config_store.routes.explore,
                },
            ],
        },
    ];

    const list_groups: TRouteGroup[] = [];
    const subroutes: TRoute[] = [];

    list.forEach(list_item => {
        if (!list_item.subroutes) {
            subroutes.push(list_item);
            list_groups.push(list_item);
        } else {
            list_item.subroutes.forEach(item => subroutes.push(item));
            list_groups.push({
                icon: list_item.icon,
                label: list_item.label,
                subitems: (list_item.subroutes as number[]).map((subroute: number) => {
                    return subroutes.findIndex(sub => subroute === sub);
                }),
            });
        }
    });

    const selected_route = getSelectedRoute({ routes: subroutes, pathname: location.pathname });
    return (
        <FadeWrapper is_visible={true} className='dw-page-wrapper' keyname='dw-page-wrapper'>
            <DesktopWrapper>
                <VerticalTab
                    alignment='left'
                    classNameHeader='modal__tab-header'
                    current_path={location.pathname}
                    extra_offset={12}
                    has_mixed_dimensions
                    id='modal'
                    is_collapsible={false}
                    // is_routed
                    is_floating
                    is_full_width
                    list={subroutes}
                    list_groups={list_groups}
                />
            </DesktopWrapper>
            <MobileWrapper>
                <Div100vhContainer className='dw__wrapper--is-mobile' height_offset='80px'>
                    {selected_route && (
                        <selected_route.value
                            component_icon={selected_route.icon_component}
                            history={history}
                            menu_options={subroutes}
                        />
                    )}
                </Div100vhContainer>
            </MobileWrapper>
        </FadeWrapper>
    );
};

export default Home;
