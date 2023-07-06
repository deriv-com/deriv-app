import React from 'react';
import { TCoreStores } from '@deriv/stores/types';
import { TMenuOption } from 'Pages/on-ramp/on-ramp';

export type TComponentRouteProps = {
    onClickDeposit?: VoidFunction;
    onClickNotes?: VoidFunction;
    onClose?: VoidFunction;
    onMount?: (should_remount?: boolean) => void;
    menu_options?: TMenuOption[];
    resetLastLocation?: VoidFunction;
    routeBackInApp?: TCoreStores['common']['routeBackInApp'];
    routes?: TRoute[];
    setAccountSwitchListener?: VoidFunction;
    setSideNotes?: (notes: object | null) => void;
    setTabIndex?: (index: number) => void;
    tab_index?: number;
    toggleCashier?: TCoreStores['ui']['toggleCashier'];
};

export type TRoute = {
    default?: boolean;
    exact?: boolean;
    id?: string;
    icon_component?: string;
    is_invisible?: boolean;
    path?: string;
    to?: string;
    component?: React.FC<TComponentRouteProps>;
    getTitle: () => string;
    routes?: TRoute[];
};

export type TRouteConfig = TRoute & {
    is_modal?: boolean;
    is_authenticated?: boolean;
    routes?: TRoute[];
};
