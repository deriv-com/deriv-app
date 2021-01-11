import * as React from 'react';
import { DesktopWrapper, Text, VerticalTab } from '@deriv/components';

import TempButtons from 'Components/temp-buttons';

const Home: React.FC = () => {
    const list = [
        {
            default: true,
            icon: 'IcBrandDtrader',
            label: 'My Deriv',
            is_routed: true,
            value: () => (
                <Text>
                    My Deriv
                </Text>
            ),
        },
        {
            label: '',
            value: () => (''),
            subroutes: [],
        },
        {
            default: false,
            icon: 'IcBrandDbot',
            label: 'Discover',
            is_routed: true,
            value: () => (
                <TempButtons />
            ),
        },
        {
            default: false,
            icon: 'IcBrandDbot',
            label: 'Platforms',
            subroutes: [
                {
                    label: 'DMT5',
                    value: () => (
                        <Text>
                            DMT5
                        </Text>
                    ),
                },
                {
                    label: 'DTrader',
                    value: () => (
                        <Text>
                            DTrader
                        </Text>
                    ),
                },
                {
                    label: 'DBot',
                    value: () => (
                        <Text>
                            DBot
                        </Text>
                    ),
                },
                {
                    label: 'SmartTrader',
                    value: () => (
                        <Text>
                            SmartTrader
                        </Text>
                    ),
                },
                {
                    label: 'Binary Bot',
                    value: () => (
                        <Text>
                            Binary Bot
                        </Text>
                    ),
                },
            ],
        },
        {
            default: false,
            icon: 'IcBrandDbot',
            label: 'Trade Types',
            subroutes: [
                {
                    label: 'CFDs',
                    value: () => (
                        <Text>
                            CFDs
                        </Text>
                    ),
                },
                {
                    label: 'Multipliers',
                    value: () => (
                        <Text>
                            Multipliers
                        </Text>
                    ),
                },
                {
                    label: 'Options',
                    value: () => (
                        <Text>
                            Options
                        </Text>
                    ),
                },
            ],
        },
        {
            default: false,
            icon: 'IcBrandDbot',
            label: 'Markets',
            subroutes: [
                {
                    label: 'Forex',
                    value: () => (
                        <Text>
                            Forex
                        </Text>
                    ),
                },
                {
                    label: 'Synthetic Indices',
                    value: () => (
                        <Text>
                            Synthetic Indices
                        </Text>
                    ),
                },
                {
                    label: 'Stock Indices',
                    value: () => (
                        <Text>
                            Stock Indices
                        </Text>
                    ),
                },
                {
                    label: 'Commodities',
                    value: () => (
                        <Text>
                            Commodities
                        </Text>
                    ),
                },
            ],
        }
    ];

    const list_groups:object[] = [];
    const subroutes:object[] = [];
    list.forEach(list_item => {
        if (!list_item.subroutes){
            subroutes.push(list_item);
        } else {
            list_item.subroutes.forEach(item => subroutes.push(item));
        }
    })

    list.forEach(list_item => {
        if (!list_item.subroutes){
            list_groups.push(list_item);
        } else {
            list_groups.push({
                icon: list_item.icon,
                label: list_item.label,
                subitems: (list_item.subroutes as object[]).map((subroute:object) => {
                    return subroutes.findIndex((sub) => subroute === sub);
                })
            });
        }
    })

    return (
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
    );
};

export default Home;
