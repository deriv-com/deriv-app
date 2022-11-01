import React from 'react';
import { action, observable, makeObservable } from 'mobx';
import { Icon } from '@deriv/components';
import { localize } from '@deriv/translations';
import { routes } from '@deriv/shared';
import BaseStore from './base-store';

export default class MenuStore extends BaseStore {
    extensions = [
        {
            id: 'dt_reports_tab',
            icon: <Icon icon='IcReports' className='header__icon' />,
            text: () => localize('Reports'),
            link_to: routes.reports,
            login_only: true,
        },
    ];

    constructor() {
        // TODO: [mobx-undecorate] verify the constructor arguments and the arguments of this automatically generated super call
        super();

        makeObservable(this, {
            extensions: observable,
            attach: action.bound,
            detach: action.bound,
        });
    }

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

    detach(menu) {
        this.extensions = this.extensions.filter(extension => extension.id !== menu);
    }
}
