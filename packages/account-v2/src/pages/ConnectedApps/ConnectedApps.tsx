import React from 'react';
import { useFetchConnectedApps } from '@deriv/api-v2';
import { Loader } from '@deriv-com/ui';
import { ConnectedAppsTable } from './ConnectedAppsTable';

export const ConnectedApps = () => {
    const { data: connectedApps, isLoading } = useFetchConnectedApps();

    return isLoading ? (
        <div className='flex items-center justify-center h-full'>
            <Loader isFullScreen={false} />
        </div>
    ) : (
        <div>
            <ConnectedAppsTable connectedApps={connectedApps} />
        </div>
    );
};
