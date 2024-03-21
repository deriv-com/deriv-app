import React, { useCallback, useState } from 'react';
import { useFetchConnectedApps, useRevokeConnectedApps } from '@deriv/api-v2';
import { Loader } from '@deriv-com/ui';
import { ConnectedAppsRevokeModal } from './ConnectedAppsRevokeModal';
import { ConnectedAppsTable } from './ConnectedAppsTable';

export const ConnectedApps = () => {
    const { data: connectedApps, isLoading } = useFetchConnectedApps();
    const { mutate: revokeMutate } = useRevokeConnectedApps();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedAppId, setSelectedAppId] = useState<number | null>(null);

    const handleToggleModal = useCallback((appId: number | null = null) => {
        setIsModalOpen(isModalOpen => !isModalOpen);
        setSelectedAppId(appId);
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
        <div>
            <ConnectedAppsTable connectedApps={connectedApps} handleToggleModal={handleToggleModal} />
            <ConnectedAppsRevokeModal
                handleRevokeAccess={handleRevokeAccess}
                handleToggleModal={handleToggleModal}
                isModalOpen={isModalOpen}
            />
        </div>
    );
};
