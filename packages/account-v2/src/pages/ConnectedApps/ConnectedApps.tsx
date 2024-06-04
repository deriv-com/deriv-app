import React, { useState } from 'react';
import { useFetchConnectedApps, useRevokeConnectedApps } from '@deriv/api-v2';
import { Loader, useDevice } from '@deriv-com/ui';
import { ErrorMessage } from '../../components/ErrorMessage';
import { ConnectedAppsEmpty } from '../../containers/ConnectedAppsContainer/ConnectedAppsEmpty';
import { ConnectedAppsInfo } from '../../containers/ConnectedAppsContainer/ConnectedAppsInfo';
import { ConnectedAppsResponsive } from '../../containers/ConnectedAppsContainer/ConnectedAppsResponsive';
import { ConnectedAppsRevokeModal } from '../../containers/ConnectedAppsContainer/ConnectedAppsRevokeModal';
import { ConnectedAppsSidebar } from '../../containers/ConnectedAppsContainer/ConnectedAppsSidebar';
import { ConnectedAppsTable } from '../../containers/ConnectedAppsContainer/ConnectedAppsTable';

export const ConnectedApps = () => {
    const { data: connectedApps, isError: isFetchError, isLoading: isFetchLoading } = useFetchConnectedApps();
    const { isError: isRevokeError, isLoading: isRevokeLoading, mutate: revokeMutate } = useRevokeConnectedApps();

    const { isMobile } = useDevice();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedAppId, setSelectedAppId] = useState<number | null>(null);

    const isLoading = isFetchLoading || isRevokeLoading;
    const isError = isFetchError || isRevokeError;

    const handleToggleModal = (appId: number | null = null) => {
        setSelectedAppId(appId);
        setIsModalOpen(isModalOpen => !isModalOpen);
    };

    const handleRevokeAccess = () => {
        setIsModalOpen(false);
        selectedAppId && revokeMutate(selectedAppId);
    };

    if (isLoading) {
        return (
            <div className='flex items-center justify-center h-full'>
                <Loader isFullScreen={false} />
            </div>
        );
    }

    if (isError) {
        return <ErrorMessage />;
    }

    return (
        <div className='grid md:grid-cols-[auto,256px] gap-24'>
            <section>
                {connectedApps?.length ? (
                    <div className='flex flex-col gap-24'>
                        <ConnectedAppsInfo />
                        {isMobile ? (
                            <ConnectedAppsResponsive
                                connectedApps={connectedApps}
                                handleToggleModal={handleToggleModal}
                            />
                        ) : (
                            <ConnectedAppsTable connectedApps={connectedApps} handleToggleModal={handleToggleModal} />
                        )}
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
