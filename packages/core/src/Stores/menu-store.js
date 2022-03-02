import React from 'react';
import { action, observable, computed } from 'mobx';
import { Icon } from '@deriv/components';
import { localize } from '@deriv/translations';
import { routes } from '@deriv/shared';
import BaseStore from './base-store';

const primary_array_menu_items = [
    { id: 0, route_path: '/reports', isShowBold: false },
    { id: 1, route_path: '/account', isShowBold: false },
    { id: 2, route_path: '/cashier', isShowBold: false },
];
export default class MenuStore extends BaseStore {
    @observable extensions = [
        {
            id: 'dt_reports_tab',
            icon: <Icon icon='IcReports' className='header__icon' />,
            text: () => localize('Reports'),
            link_to: routes.reports,
            login_only: true,
        },
    ];

    @observable bold_text_menu_items = primary_array_menu_items;

    @action.bound
    clean_bold_text_menu_items() {
        return (this.bold_text_menu_items = primary_array_menu_items);
    }

    @action.bound
    toggle_property_menu_items = (id, propName, arr = primary_array_menu_items) => {
        if (id === undefined) return;
        const idx = arr.findIndex(el => el.id === id);
        const oldItem = arr[idx];
        const newItem = { ...oldItem, [propName]: !oldItem[propName] };
        return (this.bold_text_menu_items = [...arr.slice(0, idx), newItem, ...arr.slice(idx + 1)]);
    };

    @action.bound
    attach(menu) {
        if (!(menu instanceof Object)) {
            throw new TypeError('Menu is not an instance of object.');
        }
        this.extensions.push(menu);
    }

    update(menu, index) {
        if (this.extensions[index]) {
            this.extensions[index] = menu;
        }
    }

    @action.bound
    detach(menu) {
        this.extensions = this.extensions.filter(extension => extension.id !== menu);
    }
}
