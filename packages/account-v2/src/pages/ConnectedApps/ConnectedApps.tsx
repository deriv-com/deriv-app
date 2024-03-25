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
                {connectedApps?.length ? (
                    <div>
                        <ConnectedAppsInfo />
                        <ConnectedAppsTable connectedApps={connectedApps} />
                    </div>
                ) : (
                    <span>helo</span>
                )}
            </section>
            <section>
                <ConnectedAppsSidebar />
            </section>
        </div>
    );
};
