/* eslint-disable react/display-name */
import React from 'react';
import { toMoment } from '@deriv/shared';
import { Button, Text } from '@deriv/components';
import { localize } from '@deriv/translations';
import { PrepareConnectedAppsScopes } from './template-helper';

type Column = {
    title: string;
    col_index: 'name' | 'scopes' | 'last_used' | 'app_id';
    renderCellContent: React.FC<{ cell_value: string & number & string[] }>;
};

type TDataTableTemplate = {
    handleToggleModal: (app_id: number | null) => void;
};

const DataTableTemplate = (handleToggleModal: TDataTableTemplate['handleToggleModal']): Column[] => [
    {
        title: localize('Name'),
        col_index: 'name',
        renderCellContent: ({ cell_value }) => {
            return (
                <Text size='xs' className='name__content'>
                    {cell_value}
                </Text>
            );
        },
    },
    {
        title: localize('Permission'),
        col_index: 'scopes',
        renderCellContent: ({ cell_value }) => {
            return PrepareConnectedAppsScopes(cell_value);
        },
    },
    {
        title: localize('Last login'),
        col_index: 'last_used',
        renderCellContent: ({ cell_value }) => PrepareConnectedAppsLastLogin(cell_value),
    },
    {
        title: localize('Action'),
        col_index: 'app_id',
        renderCellContent: ({ cell_value }) => PrepareConnectedAppsAction(cell_value, handleToggleModal),
    },
];

const PrepareConnectedAppsAction = (app_id: number, handleToggleModal: TDataTableTemplate['handleToggleModal']) => {
    return (
        <Button className='revoke_access' small secondary onClick={() => handleToggleModal(app_id)}>
            {localize('Revoke access')}
        </Button>
    );
};

const PrepareConnectedAppsLastLogin = (last_used: number) => (
    <Text as='p' size='xs' className='last_used_content'>
        {toMoment(last_used).format('YYYY-MM-DD HH:mm:ss')}
    </Text>
);

export default DataTableTemplate;
