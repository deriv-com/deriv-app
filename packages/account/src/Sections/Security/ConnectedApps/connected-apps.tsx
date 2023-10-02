import React from 'react';
import { Button, Modal, Icon, DataTable, DataList, Loading, Text } from '@deriv/components';
import { WS } from '@deriv/shared';
import { observer, useStore } from '@deriv/stores';
import { Localize } from '@deriv/translations';
import ErrorComponent from 'Components/error-component';
import GetConnectedAppsColumnsTemplate from './data-table-template';
import ConnectedAppsKnowMore from './connected-apps-know-more';
import ConnectedAppsEarnMore from './connected-apps-earn-more';
import ConnectedAppsEmpty from './connected-apps-empty';
import './connected-apps.scss';

const ConnectedApps = observer(() => {
    const { ui } = useStore();
    const { is_mobile } = ui;

    const [is_loading, setLoading] = React.useState(true);
    const [is_modal_open, setModalVisibility] = React.useState(false);
    const [selected_app_id, setAppId] = React.useState<number | null>(null);
    const [is_error, setError] = React.useState(false);
    const [connected_apps, setConnectedApps] = React.useState([]);

    React.useEffect(() => {
        /* eslint-disable no-console */
        fetchConnectedApps().catch(error => console.error('error: ', error));
    }, []);

    const fetchConnectedApps = async () => {
        const response_connected_apps = await WS.authorized.send({ oauth_apps: 1 });

        if (!response_connected_apps.error) {
            setLoading(false);
            setConnectedApps(response_connected_apps.oauth_apps);
        }
    };

    const handleToggleModal = React.useCallback(
        (app_id: number | null = null) => {
            setModalVisibility(!is_modal_open);
            setAppId(app_id);
        },
        [is_modal_open]
    );

    type TColumn = ReturnType<typeof GetConnectedAppsColumnsTemplate>[number];
    const columns_map = React.useMemo(
        () =>
            GetConnectedAppsColumnsTemplate(app_id => handleToggleModal(app_id)).reduce((map, item) => {
                map[item.col_index] = item;
                return map;
            }, {} as { [k in TColumn['col_index']]: TColumn }),
        [handleToggleModal]
    );
    type TMobileRowRenderer = Parameters<React.ComponentProps<typeof DataList>['rowRenderer']>[0];
    const mobileRowRenderer = React.useCallback(
        (row: Partial<TMobileRowRenderer>) => (
            <React.Fragment>
                <div className='data-list__row'>
                    <DataList.Cell row={row} column={columns_map.name} />
                    <DataList.Cell row={row} column={columns_map.last_used} />
                </div>
                <div className='data-list__row'>
                    <DataList.Cell row={row} column={columns_map.scopes} />
                    <DataList.Cell row={row} column={columns_map.app_id} is_footer={true} />
                </div>
            </React.Fragment>
        ),
        [columns_map]
    );

    const revokeConnectedApp = React.useCallback(async (app_id: number | null) => {
        setLoading(true);
        const response = await WS.authorized.send({ revoke_oauth_app: app_id });
        if (!response.error) {
            /* eslint-disable no-console */
            fetchConnectedApps().catch(error => console.error('error: ', error));
        } else {
            setError(true);
        }
    }, []);

    const handleRevokeAccess = React.useCallback(() => {
        setModalVisibility(false);
        revokeConnectedApp(selected_app_id);
    }, [revokeConnectedApp, selected_app_id]);

    return is_loading ? (
        <Loading is_fullscreen={false} />
    ) : (
        <div className='connected-apps__wrapper'>
            <section>
                {is_error && <ErrorComponent />}
                {connected_apps.length ? (
                    <div className='connected-apps__content--wrapper'>
                        <div>TODO: Replace this div with message component</div>
                        <div className='connected-apps__list--wrapper'>
                            {is_mobile ? (
                                <DataList
                                    className='connected-apps'
                                    data_source={connected_apps}
                                    row_gap={10}
                                    rowRenderer={mobileRowRenderer}
                                />
                            ) : (
                                <DataTable
                                    className='connected-apps'
                                    data_source={connected_apps}
                                    columns={GetConnectedAppsColumnsTemplate(handleToggleModal)}
                                    content_loader='span'
                                />
                            )}
                        </div>
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
