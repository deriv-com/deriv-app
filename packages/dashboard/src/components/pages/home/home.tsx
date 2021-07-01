/* eslint-disable react/display-name */
import * as React from 'react';
import { useHistory } from 'react-router-dom';
import { DesktopWrapper, Div100vhContainer, MobileWrapper, FadeWrapper, VerticalTab } from '@deriv/components';
import { getSelectedRoute } from '@deriv/shared';
import { TRoute, TRouteGroup } from 'Types';
import { useStores } from 'Stores';
import getRoutesConfig from 'Constants/routes-config';

const Home: React.FC = () => {
    const history = useHistory();
    const { config_store, ui_store } = useStores();

    const sidebarItems = [
        config_store.routes.my_apps,
        config_store.routes.explore,
        '-',
        config_store.routes.wallets,
        config_store.routes.platforms,
        config_store.routes.trade_types,
        config_store.routes.markets,
    ];
    const routes = getRoutesConfig({
        consumer_routes: config_store.routes,
        Page404: ui_store.components.Page404,
    })[0].routes?.filter(route => {
        return sidebarItems.includes(route.path!);
    });

    const list_groups: TRouteGroup[] = [];
    const subroutes: TRoute[] = [];

    routes?.forEach(list_item => {
        if (!list_item.subroutes) {
            subroutes.push(list_item);
            list_groups.push(list_item);
        } else {
            list_item.subroutes.forEach(item => subroutes.push(item));
            list_groups.push({
                icon: list_item.icon,
                getTitle: list_item.getTitle,
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
                    is_routed
                    is_floating
                    is_full_width
                    list={subroutes}
                    list_groups={list_groups}
                />
            </DesktopWrapper>
            <MobileWrapper>
                <Div100vhContainer className='dw__wrapper--is-mobile' height_offset='80px'>
                    {selected_route && (
                        <selected_route.component
                            component_icon={selected_route.icon}
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
