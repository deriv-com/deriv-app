/* eslint-disable react/display-name */
import * as React from 'react';
import { DesktopWrapper, Text, VerticalTab, MobileWrapper } from '@deriv/components';
import { localize } from '@deriv/translations';
import { getSelectedRoute } from '@deriv/shared';
import { TRoute, TRouteGroup } from 'Types';

import TempButtons from 'Components/temp-buttons';
import TempGetDMT5Wallet from 'Components/pages/temp-get-dmt5-wallet';
import TempGetDerivWallet from 'Components/pages/temp-get-deriv-wallet';

const Home: React.FC = () => {
    const list = [
        {
            default: true,
            icon: 'IcUserOutline',
            label: localize('My Deriv'),
            is_routed: true,
            value: () => (
                <React.Fragment>
                    {/* <TempGetDMT5Wallet /> */}
                    <TempGetDerivWallet />
                </React.Fragment>
            ),
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
                    value: () => <TempGetDMT5Wallet />,
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

    const selected_route = getSelectedRoute({ routes: list, pathname: location.pathname });

    return (
        <React.Fragment>
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
                {selected_route && <selected_route.value component_icon={selected_route.icon} />}
            </MobileWrapper>
        </React.Fragment>
    );
};

export default Home;
