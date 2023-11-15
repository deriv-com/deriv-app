/* eslint-disable react/display-name */
import React from 'react';
import { Text } from '@deriv/components';
import { localize } from '@deriv/translations';
import {
    TDataTableTemplateProps,
    getConnectedAppsAction,
    getConnectedAppsLastLogin,
    getConnectedAppsScopes,
} from './template-helper';

type Column = {
    title: string;
    col_index: 'name' | 'scopes' | 'last_used' | 'app_id';
    renderCellContent: React.FC<{ cell_value: string & number & string[] }>;
};

const DataTableTemplate = ({ handleToggleModal }: TDataTableTemplateProps): Column[] => [
    {
        title: localize('Name'),
        col_index: 'name',
        renderCellContent: ({ cell_value }) => (
            <Text size='xs' className='name__content'>
                {cell_value}
            </Text>
        ),
    },
    {
        title: localize('Permission'),
        col_index: 'scopes',
        renderCellContent: ({ cell_value }) => getConnectedAppsScopes(cell_value),
    },
    {
        title: localize('Last login'),
        col_index: 'last_used',
        renderCellContent: ({ cell_value }) => getConnectedAppsLastLogin(cell_value),
    },
    {
        title: localize('Action'),
        col_index: 'app_id',
        renderCellContent: ({ cell_value }) => getConnectedAppsAction(cell_value, handleToggleModal),
    },
];

export default DataTableTemplate;
