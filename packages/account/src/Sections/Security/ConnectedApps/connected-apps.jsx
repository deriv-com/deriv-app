import React from 'react';
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
import { localize } from '@deriv/translations';
import ErrorComponent from 'Components/error-component';
import { WS } from 'Services/ws-methods';
import GetConnectedAppsColumnsTemplate from './data-table-template.jsx';

class ConnectedApps extends React.Component {
    state = {
        is_loading: true,
        is_modal_open: false,
        selected_app_id: null,
        is_error: false,
        connected_apps: [],
    };
    columns_map = GetConnectedAppsColumnsTemplate(app_id => this.handleToggleModal(app_id)).reduce((map, item) => {
        map[item.col_index] = item;
        return map;
    }, {});

    componentDidMount() {
        this.fetchConnectedApps();
    }

    handleRevokeAccess = () => {
        this.setState({ is_modal_open: false, is_loading: true });
        this.revokeConnectedApp(this.state.selected_app_id);
    };

    handleToggleModal = (app_id = null) => {
        if (this.state.is_modal_open) {
            this.setState({ is_modal_open: false, selected_app_id: null });
        } else {
            this.setState({ is_modal_open: true, selected_app_id: app_id });
        }
    };

    fetchConnectedApps = async () => {
        const response_connected_apps = await WS.authorized.send({ oauth_apps: 1 });

        if (!response_connected_apps.error) {
            this.setState({
                is_loading: false,
                connected_apps: response_connected_apps.oauth_apps,
            });
        }
    };

    revokeConnectedApp = async app_id => {
        this.setState({ is_loading: true });
        const response = await WS.authorized.send({ revoke_oauth_app: app_id });
        if (!response.error) {
            this.fetchConnectedApps();
        } else {
            this.setState({ is_error: true });
        }
    };

    mobileRowRenderer = ({ row }) => {
        return (
            <div className='data-list__row'>
                <div className='data-list__col'>
                    <DataList.Cell row={row} column={this.columns_map.name} />
                    <DataList.Cell row={row} column={this.columns_map.scopes} />
                </div>
                <div className='data-list__col--small'>
                    <DataList.Cell row={row} column={this.columns_map.last_used} />
                    <DataList.Cell row={row} column={this.columns_map.app_id} is_footer={true} />
                </div>
            </div>
        );
    };
    render() {
        return (
            <section className='connected-apps__wrapper'>
                <Text color='prominent' weight='bold' as='p' className='connected-apps__title'>
                    {localize('Authorised applications')}
                </Text>
                {this.state.is_error && <ErrorComponent />}
                {this.state.is_loading ? (
                    <Loading is_fullscreen={false} />
                ) : (
                    <React.Fragment>
                        <DesktopWrapper>
                            <DataTable
                                className='connected-apps'
                                data_source={this.state.connected_apps}
                                columns={GetConnectedAppsColumnsTemplate(this.handleToggleModal)}
                                getRowSize={() => 56}
                            />
                        </DesktopWrapper>
                        <MobileWrapper>
                            <DataList
                                className='connected-apps'
                                data_source={this.state.connected_apps}
                                row_gap={10}
                                rowRenderer={this.mobileRowRenderer}
                            />
                        </MobileWrapper>
                    </React.Fragment>
                )}
                <Modal
                    is_open={this.state.is_modal_open}
                    className='connected-apps'
                    toggleModal={this.handleToggleModal}
                >
                    <Modal.Body>
                        <div className='connected-app-modal'>
                            <Icon icon='IcAccountTrashCan' size={128} className='connected-app-modal__icon' />
                            <Text as='p' color='prominent' weight='bold'>
                                {localize('Confirm revoke access?')}
                            </Text>
                            <div className='connected-app-modal__confirmation'>
                                <Button secondary onClick={this.handleToggleModal}>
                                    {localize('Back')}
                                </Button>
                                <Button primary onClick={this.handleRevokeAccess}>
                                    {localize('Confirm')}
                                </Button>
                            </div>
                        </div>
                    </Modal.Body>
                </Modal>
            </section>
        );
    }
}

export default ConnectedApps;
