/* eslint-disable react/display-name */
import React from 'react';
import { toMoment } from '@deriv/shared';
import { Button, Text } from '@deriv/components';
import { Localize, localize } from '@deriv/translations';
import { getConnectedAppsScopes } from './template-helper';

type Column = {
    title: string;
    col_index: 'name' | 'scopes' | 'last_used' | 'app_id';
    renderCellContent: React.FC<{ cell_value: string & number & string[] }>;
};

type TDataTableTemplateProps = {
    handleToggleModal: (app_id: number | null) => void;
};

const DataTableTemplate = ({ handleToggleModal }: TDataTableTemplateProps): Column[] => [
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
            return getConnectedAppsScopes(cell_value);
        },
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

const getConnectedAppsAction = (app_id: number, handleToggleModal: TDataTableTemplateProps['handleToggleModal']) => (
    <Button className='revoke_access' small secondary onClick={() => handleToggleModal(app_id)}>
        <Localize i18n_default_text='Revoke access' />
    </Button>
);

const getConnectedAppsLastLogin = (last_used: number) => (
    <Text as='p' size='xs' className='last_used_content'>
        {toMoment(last_used).format('YYYY-MM-DD HH:mm:ss')}
    </Text>
);

export default DataTableTemplate;
