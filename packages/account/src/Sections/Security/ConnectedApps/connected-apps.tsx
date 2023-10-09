import React from 'react';
import { Button, Modal, Icon, DataTable, Loading, Text } from '@deriv/components';
import { useOAuthConnectedApps, useOAuthRevokeConnectedApps } from '@deriv/hooks';
import { observer, useStore } from '@deriv/stores';
import { Localize } from '@deriv/translations';
import ErrorComponent from 'Components/error-component';
import ConnectedAppsKnowMore from './connected-apps-know-more';
import ConnectedAppsEarnMore from './connected-apps-earn-more';
import ConnectedAppsEmpty from './connected-apps-empty';
import DataListTemplate from './data-list-template';
import DataTableTemplate from './data-table-template';
import './connected-apps.scss';
import { TSource } from '../../../../../components/src/components/data-table/data-table';

const ConnectedApps = observer(() => {
    const { ui } = useStore();
    const { is_mobile } = ui;

    const [selected_app_id, setSelectedAppId] = React.useState<number | null>(null);
    const [is_modal_open, setIsModalOpen] = React.useState(false);

    const { data: connected_apps = [], isLoading: is_loading, isError: is_error } = useOAuthConnectedApps();
    const { revokeOAuthApp } = useOAuthRevokeConnectedApps();

    const handleToggleModal = React.useCallback(
        (app_id: number | null = null) => {
            setSelectedAppId(app_id);
            setIsModalOpen(!is_modal_open);
        },
        [is_modal_open]
    );

    const handleRevokeAccess = React.useCallback(() => {
        if (selected_app_id) revokeOAuthApp(selected_app_id);
        setIsModalOpen(false);
    }, [revokeOAuthApp, selected_app_id]);

    return is_loading ? (
        <Loading is_fullscreen={false} />
    ) : (
        <div className='connected-apps__wrapper'>
            <section>
                {is_error && <ErrorComponent />}
                {connected_apps.length ? (
                    <div className='connected-apps__content--wrapper'>
                        <div>TODO: Replace this div with message component</div>
                        {is_mobile ? (
                            <div className='connected-apps__list--wrapper'>
                                {connected_apps.map(connected_app => (
                                    <DataListTemplate
                                        key={connected_app.app_id}
                                        data_source={connected_app}
                                        handleToggleModal={handleToggleModal}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className='connected-apps__tabular--wrapper'>
                                <DataTable
                                    className='connected-apps'
                                    data_source={connected_apps as unknown as TSource[]}
                                    columns={DataTableTemplate(handleToggleModal)}
                                    content_loader='span'
                                />
                            </div>
                        )}
                    </div>
                ) : (
                    <ConnectedAppsEmpty />
                )}
            </section>
            <section className='connected-apps__articles--wrapper'>
                <ConnectedAppsKnowMore />
                <ConnectedAppsEarnMore />
            </section>
            <Modal is_open={is_modal_open} className='connected-apps' width='44rem'>
                <Modal.Body>
                    <div className='connected-apps-modal--wrapper'>
                        <div className='connected-apps-modal--icon'>
                            <Icon icon='IcAccountTrashCan' size={128} />
                            <Text as='p' color='prominent' weight='bold'>
                                <Localize i18n_default_text='Confirm revoke access?' />
                            </Text>
                        </div>
                        <div className='connected-apps-modal--buttons'>
                            <Button large secondary onClick={() => handleToggleModal()}>
                                <Localize i18n_default_text='Back' />
                            </Button>
                            <Button large primary onClick={handleRevokeAccess}>
                                <Localize i18n_default_text='Confirm' />
                            </Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    );
});

export default ConnectedApps;
