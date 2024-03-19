import React from 'react';
import { OauthApps } from '@deriv/api-types';
import { Button, Table } from '@deriv-com/ui';
import { CONNECTED_APPS_HEADER, CONNECTED_APPS_HEADER_ORDER } from '../../constants/connectedAppsConstants';
import { getFormattedAppScopes } from '../../utils/connectedAppsUtils';

type TConnectedAppsTable = {
    connectedApps: OauthApps | undefined;
};

export const ConnectedAppsTable = ({ connectedApps }: TConnectedAppsTable) => {
    const connectedAppsColumns = CONNECTED_APPS_HEADER_ORDER.map(header_name => ({
        header: CONNECTED_APPS_HEADER[header_name],
    }));

    const connectedAppsRows = connectedApps?.map(connectedApp => ({
        lastLogin: connectedApp?.last_used,
        name: connectedApp?.name,
        permission: getFormattedAppScopes(connectedApp?.scopes),
    }));

    return (
        <Table
            columns={connectedAppsColumns}
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
                    <Button color='black' rounded='sm' size='sm' textSize='sm' type='button' variant='outlined'>
                        Revoke access
                    </Button>
                </div>
            )}
        />
    );
};
