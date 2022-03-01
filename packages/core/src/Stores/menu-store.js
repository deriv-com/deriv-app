import React from 'react';
import { action, observable, computed } from 'mobx';
import { Icon } from '@deriv/components';
import { localize } from '@deriv/translations';
import { routes } from '@deriv/shared';
import BaseStore from './base-store';

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

    @observable bold_text_menu_items = [];

    @action.bound
    clean_bold_text_menu_items() {
        console.log(this.bold_text_menu_items = [
            {id: 0, label: localize('Reports'), isShowBold: false}, 
            {id: 1, label: localize('Account Settings'), isShowBold: false}, 
            {id: 2, label: localize('Cashier'), isShowBold: false}, 
        ]);
        return this.bold_text_menu_items = [
            {id: 0, label: localize('Reports'), isShowBold: false}, 
            {id: 1, label: localize('Account Settings'), isShowBold: false}, 
            {id: 2, label: localize('Cashier'), isShowBold: false}, 
        ];
    }

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
