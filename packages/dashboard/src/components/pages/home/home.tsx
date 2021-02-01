/* eslint-disable react/display-name */
import * as React from 'react';
import { useHistory } from 'react-router-dom';
import { DesktopWrapper, Div100vhContainer, MobileWrapper, FadeWrapper, Text, VerticalTab } from '@deriv/components';
import { isMobile, getSelectedRoute } from '@deriv/shared';
import { localize } from '@deriv/translations';
import { TRoute, TRouteGroup } from 'Types';
import { useStores } from 'Stores';

import TempButtons from 'Components/temp-buttons';

const Home: React.FC = () => {
    const history = useHistory();
    const { config_store } = useStores();

    const list = [
        {
            default: true,
            icon: 'IcUserOutline',
            label: localize('My Deriv'),
            is_routed: true,
            // path: 'myDeriv',
            value: () => <Text>My Deriv</Text>,
        },
        {
            label: '',
            value: () => '',
            subroutes: [],
        },
        {
            default: false,
            icon: 'IcWalletExplore',
            label: localize('Discover'),
            // path: history.push(config_store.routes.explore),
            path: '/dashboard/explore/',
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
                    is_routed: true,
                    path: '/dashboard/explore/',
                },
                {
                    label: localize('E-wallet'),
                    value: () => <Text>E-wallet</Text>,
                },
                {
                    label: localize('Cryptocurrency'),
                    value: () => <Text>Cryptocurrency</Text>,
                },
                {
                    label: localize('Bank Wire'),
                    value: () => <Text>Bank Wire</Text>,
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
                },
                {
                    label: localize('DTrader'),
                    value: () => <Text>DTrader</Text>,
                },
                {
                    label: localize('DBot'),
                    value: () => <Text>DBot</Text>,
                },
                {
                    label: localize('SmartTrader'),
                    value: () => <Text>SmartTrader</Text>,
                },
                {
                    label: localize('Binary Bot'),
                    value: () => <Text>Binary Bot</Text>,
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
                },
                {
                    label: localize('Multipliers'),
                    value: () => <Text>Multipliers</Text>,
                },
                {
                    label: localize('Options'),
                    value: () => <Text>Options</Text>,
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
                },
                {
                    label: localize('Synthetic Indices'),
                    value: () => <Text>Synthetic Indices</Text>,
                },
                {
                    label: localize('Stock Indices'),
                    value: () => <Text>Stock Indices</Text>,
                },
                {
                    label: localize('Commodities'),
                    value: () => <Text>Commodities</Text>,
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
    console.log('selected_route');
    console.log(selected_route);
    return (
        <FadeWrapper is_visible={true} className='dw-page-wrapper' keyname='dw-page-wrapper'>
            <DesktopWrapper>
                <VerticalTab
                    alignment='left'
                    classNameHeader='modal__tab-header'
                    extra_offset={12}
                    has_mixed_dimensions
                    id='modal'
                    is_collapsible={false}
                    is_floating
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
                    {/* <TempButtons /> */}
                </Div100vhContainer>
            </MobileWrapper>
        </FadeWrapper>
    );
};

export default Home;
