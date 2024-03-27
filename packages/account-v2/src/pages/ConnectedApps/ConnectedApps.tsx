import React from 'react';
import { useFetchConnectedApps } from '@deriv/api-v2';
import { Loader } from '@deriv-com/ui';
import { ErrorMessage } from '../../components/ErrorMessage';
import { ConnectedAppsEmpty } from './ConnectedAppsEmpty';
import { ConnectedAppsInfo } from './ConnectedAppsInfo';
import { ConnectedAppsSidebar } from './ConnectedAppsSidebar';
import { ConnectedAppsTable } from './ConnectedAppsTable';

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
                {connectedApps?.length ? (
                    <div className='flex flex-col gap-24'>
                        <ConnectedAppsInfo />
                        <ConnectedAppsTable connectedApps={connectedApps} />
                    </div>
                ) : (
                    <ConnectedAppsEmpty />
                )}
            </section>
            <section>
                <ConnectedAppsSidebar />
            </section>
        </div>
    );
};
