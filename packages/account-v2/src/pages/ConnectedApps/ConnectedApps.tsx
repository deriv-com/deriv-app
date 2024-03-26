import React from 'react';
import { useFetchConnectedApps } from '@deriv/api-v2';
import { Loader } from '@deriv-com/ui';
import { ConnectedAppsTable } from './ConnectedAppsTable';
import { ErrorMessage } from '../../components/ErrorMessage';
import { ConnectedAppsSidebar } from './ConnectedAppsSidebar';
import { ConnectedAppsInfo } from './ConnectedAppsInfo';

export const ConnectedApps = () => {
    const { data: connectedApps, isError, isLoading } = useFetchConnectedApps();

    return isLoading ? (
        <div className='flex items-center justify-center h-full'>
            <Loader isFullScreen={false} />
        </div>
    ) : (
        <div className='grid grid-cols-[auto,256px] gap-24'>
            <section>
                {isError && <ErrorMessage />}
                {connectedApps?.length && (
                    <div className='flex flex-col gap-24'>
                        <ConnectedAppsInfo />
                        <ConnectedAppsTable connectedApps={connectedApps} />
                    </div>
                )}
            </section>
            <section>
                <ConnectedAppsSidebar />
            </section>
        </div>
    );
};
