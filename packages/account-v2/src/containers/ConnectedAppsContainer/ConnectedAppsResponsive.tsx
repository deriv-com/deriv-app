import React from 'react';
import { OauthApps } from '@deriv/api-types';
import { Button } from '@deriv-com/ui';
import { formatDate, getFormattedAppScopes } from '../../utils/connectedAppsUtils';
import { ConnectedAppsResponsiveColumn } from './ConnectedAppsResponsiveColumn';

type TConnectedAppsResponsive = {
    connectedApps: OauthApps;
    handleToggleModal: (appId: number) => void;
};

export const ConnectedAppsResponsive = ({ connectedApps, handleToggleModal }: TConnectedAppsResponsive) => (
    <div className='flex flex-col gap-8'>
        {connectedApps.map(connectedApp => (
            <div className='bg-solid-grey-2 rounded-default p-16' key={connectedApp.app_id}>
                <div className='flex justify-between gap-16'>
                    <ConnectedAppsResponsiveColumn description={connectedApp.name} title='Name' />
                    <ConnectedAppsResponsiveColumn
                        description={connectedApp.last_used && formatDate(connectedApp.last_used)}
                        style='w-80'
                        title='Last Login'
                    />
                </div>
                <div className='flex justify-between gap-16'>
                    <ConnectedAppsResponsiveColumn
                        description={getFormattedAppScopes(connectedApp.scopes)}
                        title='Permission'
                    />
                    <div className='flex items-end'>
                        <Button
                            className='whitespace-nowrap'
                            color='black'
                            onClick={() => handleToggleModal(connectedApp.app_id)}
                            rounded='sm'
                            size='sm'
                            textSize='sm'
                            type='button'
                            variant='outlined'
                        >
                            Revoke access
                        </Button>
                    </div>
                </div>
            </div>
        ))}
    </div>
);
