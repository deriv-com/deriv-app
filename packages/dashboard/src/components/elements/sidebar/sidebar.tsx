
import * as React from 'react';
import { useHistory } from 'react-router-dom';
import { DesktopWrapper, Text, VerticalTab } from '@deriv/components';
import { Localize } from '@deriv/translations';
import { useStores } from 'Stores';
import { flatten } from '../../../../../account/src/Helpers/flatten';

const SideBar: React.FC = () => {
    // const history = useHistory();
    const { config_store } = useStores();
    const routes = config_store.routes;

    // let list_groups = [...routes];
    // list_groups = list_groups.map(route_group => ({
    //     icon: route_group.icon,
    //     label: route_group.getTitle(),
    //     subitems: route_group.subroutes.map(sub => subroutes.indexOf(sub)),
    // }));

    // const menu_options = () => {
    //     const options = [];

    //     routes.forEach(route => {
    //         options.push({
    //             default: route.default,
    //             icon: route.icon_component,
    //             label: route.getTitle(),
    //             value: route.component,
    //             path: route.path,
    //         });
    //     });

    //     return options;
    // };
    console.log('our routes');
    console.log(routes);

    const list = [
        {
            default: true,
            icon: 'IcBrandDtrader',
            label: 'My Deriv',
            value: () => (
                <Text>
                    My Deriv
                </Text>
            ),
            subroutes: [
                {
                    label: 'My Deriv',
                    value: () => (
                        <Text>
                            My Deriv
                        </Text>
                    ),
                },
            ],
        },
        {
            default: false,
            icon: 'IcBrandDbot',
            label: 'Discover',
            value: () => (
                <Text>
                    Discover
                </Text>
            ),
            subroutes: [
                {
                    label: 'Discover',
                    value: () => (
                        <Text>
                            Discover
                        </Text>
                    ),
                },
            ],
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
                    // value: () => (
                    //     <Text>
                    //         CFDs
                    //     </Text>
                    // ),
                    value: routes.cfds,
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

    const subroutes = flatten(list.map(i => i.subroutes));
    let list_groups = [...list];
    console.log('extracted routes');
    console.log(subroutes);
    console.log(list_groups);
    list_groups = list_groups.map(route_group => ({
        icon: route_group.icon,
        label: route_group.label,
        subitems: route_group.subroutes ? route_group.subroutes.map(sub => subroutes.indexOf(sub)) : [],
    }));

    return (
        // <DesktopWrapper>
        //     <VerticalTab
        //         alignment='center'
        //         id='cashier'
        //         classNameHeader='cashier__tab-header'
        //         current_path={this.props.location.pathname}
        //         is_floating
        //         setVerticalTabIndex={this.props.setTabIndex}
        //         vertical_tab_index={is_default_route ? 0 : this.props.tab_index}
        //         is_full_width
        //         is_routed
        //         // list={menu_options()}
        //         list={list}
        //         tab_headers_note={
        //             should_show_tab_headers_note ? (
        //                 <Text as='p' size='xxs' className='cashier__tab-header-note'>
        //                     <Localize
        //                         i18n_default_text='Want to exchange between e-wallet currencies? Try <0>bestchange.com</0>'
        //                         components={[
        //                             <a
        //                                 key={0}
        //                                 href='https://www.bestchange.com/?p=1095016'
        //                                 rel='noopener noreferrer'
        //                                 target='_blank'
        //                                 className='link'
        //                             />,
        //                         ]}
        //                     />
        //                 </Text>
        //             ) : undefined
        //         }
        //     />
        // </DesktopWrapper>
        <DesktopWrapper>
            <VerticalTab
                alignment='left'
                classNameHeader='modal__tab-header'
                id='modal'
                is_collapsible={false}
                is_floating
                // is_full_width
                // list={list}
                list={subroutes}
                list_groups={list_groups} 
            />
        </DesktopWrapper>
        // <div>Hello, sidebar</div>
    );
};

export default SideBar;