import React from 'react';
import moment from 'moment';
import { Button } from '@deriv/components';
import { localize } from '@deriv/translations';

const getConnectedAppsColumnsTemplate = handleToggleModal => [
    { title: 'Name', col_index: 'name' },
    {
        title: 'Permission',
        col_index: 'scopes',
        renderCellContent: ({ cell_value }) => {
            return prepareConnectedAppsScopes(cell_value);
        },
    },
    {
        title: 'Last login',
        col_index: 'last_used',
        renderCellContent: ({ cell_value }) => prepareConnectedAppsLastLogin(cell_value),
    },
    {
        title: 'Action',
        col_index: 'app_id',
        renderCellContent: ({ cell_value }) => prepareConnectedAppsAction(cell_value, handleToggleModal),
    },
];

const prepareConnectedAppsAction = (app_id, handleToggleModal) => (
    <Button className='revoke_access' small secondary onClick={() => handleToggleModal(app_id)}>
        {localize('Revoke access')}
    </Button>
);

const prepareConnectedAppsLastLogin = las_used => (
    <p className='last_used_content'>{moment(las_used).format('YYYY-MM-DD HH:mm:ss')}</p>
);

const prepareConnectedAppsScopes = permissions_list => {
    const list = permissions_list.map((value, index) => {
        return permissions_list.length - 1 !== index
            ? `${value.charAt(0).toUpperCase() + value.slice(1)}, `
            : value.charAt(0).toUpperCase() + value.slice(1);
    });
    return <div>{list}</div>;
};

export default getConnectedAppsColumnsTemplate;
