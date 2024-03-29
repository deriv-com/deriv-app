import React from 'react';
import { OauthApps } from '@deriv/api-types';
import { Button, Table } from '@deriv-com/ui';
import { CONNECTED_APPS_HEADER } from '../../constants/connectedAppsConstants';
import { formatDate, getFormattedAppScopes } from '../../utils/connectedAppsUtils';

type TConnectedAppsTable = {
    connectedApps: OauthApps | undefined;
    handleToggleModal: (app_id: number) => void;
};

export const ConnectedAppsTable = ({ connectedApps, handleToggleModal }: TConnectedAppsTable) => {
    const connectedAppsRows = connectedApps?.map(connectedApp => ({
        app_id: connectedApp?.app_id,
        lastLogin: formatDate(connectedApp?.last_used),
        name: connectedApp?.name,
        permission: getFormattedAppScopes(connectedApp?.scopes),
    }));

    return (
        <Table
            columns={CONNECTED_APPS_HEADER}
            data={connectedAppsRows ?? []}
            isFetching={false}
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            loadMoreFunction={() => {}}
            renderHeader={header => <span>{header}</span>}
            rowRender={data => (
                <div className='grid grid-flow-col text-default'>
                    <span>{data.name}</span>
                    <span>{data.permission}</span>
                    <span>{data.lastLogin}</span>
                    <Button
                        color='black'
                        onClick={() => handleToggleModal(data.app_id)}
                        rounded='sm'
                        size='sm'
                        textSize='sm'
                        type='button'
                        variant='outlined'
                    >
                        Revoke access
                    </Button>
                </div>
            )}
        />
    );
};
