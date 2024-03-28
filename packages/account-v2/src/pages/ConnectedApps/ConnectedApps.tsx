import React, { useCallback, useState } from 'react';
import { useFetchConnectedApps, useRevokeConnectedApps } from '@deriv/api-v2';
import { Loader } from '@deriv-com/ui';
import { ErrorMessage } from '../../components/ErrorMessage';
import { ConnectedAppsEmpty } from './ConnectedAppsEmpty';
import { ConnectedAppsInfo } from './ConnectedAppsInfo';
import { ConnectedAppsSidebar } from './ConnectedAppsSidebar';
import { ConnectedAppsRevokeModal } from './ConnectedAppsRevokeModal';
import { ConnectedAppsTable } from './ConnectedAppsTable';

export const ConnectedApps = () => {
    const { data: connectedApps, isError, isLoading } = useFetchConnectedApps();
    const { mutate: revokeMutate } = useRevokeConnectedApps();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedAppId, setSelectedAppId] = useState<number | null>(null);

    const handleToggleModal = useCallback((appId: number | null = null) => {
        setSelectedAppId(appId);
        setIsModalOpen(isModalOpen => !isModalOpen);
    }, []);

    const handleRevokeAccess = useCallback(() => {
        setIsModalOpen(false);
        selectedAppId && revokeMutate(selectedAppId);
    }, [revokeMutate, selectedAppId]);

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
                        <ConnectedAppsTable connectedApps={connectedApps} handleToggleModal={handleToggleModal} />
                    </div>
                ) : (
                    <ConnectedAppsEmpty />
                )}
            </section>
            <section>
                <ConnectedAppsSidebar />
            </section>
            <ConnectedAppsRevokeModal
                handleRevokeAccess={handleRevokeAccess}
                handleToggleModal={handleToggleModal}
                isModalOpen={isModalOpen}
            />
        </div>
    );
};
