import React from 'react';
import classNames from 'classnames';
import {
    DesktopWrapper,
    MobileWrapper,
    Button,
    Modal,
    Icon,
    DataTable,
    DataList,
    Loading,
    Text,
} from '@deriv/components';
import ConnectedAppsArticle from './connected-apps-article';
import { PlatformContext, WS } from '@deriv/shared';
import { localize } from '@deriv/translations';
import ErrorComponent from 'Components/error-component';
import GetConnectedAppsColumnsTemplate from './data-table-template';

const ConnectedApps = () => {
    const { is_appstore } = React.useContext(PlatformContext);
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

    const mobileRowRenderer = React.useCallback(
        ({ row }: { row: TColumn['renderCellContent'] }) => (
            <div className='data-list__row'>
                <div className='data-list__col'>
                    <DataList.Cell row={row} column={columns_map.name} />
                    <DataList.Cell row={row} column={columns_map.scopes} />
                </div>
                <div className={is_appstore ? 'data-list__col--dashboard' : 'data-list__col--small'}>
                    <DataList.Cell row={row} column={columns_map.last_used} />
                    <DataList.Cell row={row} column={columns_map.app_id} is_footer={!is_appstore} />
                </div>
            </div>
        ),
        [columns_map, is_appstore]
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

    return (
        <section
            className={classNames('connected-apps__wrapper', {
                'connected-apps__wrapper--dashboard': is_appstore,
            })}
        >
            <Text color='prominent' weight='bold' as='p' className='connected-apps__title'>
                {localize('Authorised applications')}
            </Text>
            {is_error && <ErrorComponent />}
            <div
                className={classNames('connected-apps__container', 'connected-apps__wrapper', {
                    'connected-apps__wrapper--dashboard': is_appstore,
                })}
            >
                {is_loading ? (
                    <Loading is_fullscreen={false} />
                ) : (
                    <React.Fragment>
                        <DesktopWrapper>
                            <DataTable
                                className='connected-apps'
                                data_source={connected_apps}
                                columns={GetConnectedAppsColumnsTemplate(handleToggleModal)}
                            />
                        </DesktopWrapper>
                        <MobileWrapper>
                            <DataList
                                className='connected-apps'
                                data_source={connected_apps}
                                row_gap={is_appstore ? 16 : 10}
                                rowRenderer={mobileRowRenderer}
                            />
                        </MobileWrapper>
                    </React.Fragment>
                )}

                {!is_loading && !!connected_apps.length && <ConnectedAppsArticle />}
            </div>

            <Modal is_open={is_modal_open} className='connected-apps' toggleModal={handleToggleModal}>
                <Modal.Body>
                    <div className='connected-app-modal'>
                        <Icon
                            icon={is_appstore ? 'IcAccountTrashCanDashboard' : 'IcAccountTrashCan'}
                            size={128}
                            className='connected-app-modal__icon'
                        />
                        <Text as='p' color='prominent' weight='bold'>
                            {localize('Confirm revoke access?')}
                        </Text>
                        <div
                            className={classNames('connected-app-modal__confirmation', {
                                'connected-app-modal__confirmation-dashboard': is_appstore,
                            })}
                        >
                            <Button secondary onClick={handleToggleModal}>
                                {localize('Back')}
                            </Button>
                            <Button primary onClick={handleRevokeAccess}>
                                {localize('Confirm')}
                            </Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </section>
    );
};

export default ConnectedApps;
