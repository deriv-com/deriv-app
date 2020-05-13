import React from 'react';
import { DesktopWrapper, MobileWrapper, Button, Modal, Icon } from '@deriv/components';
import { localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import DataTable from 'App/Components/Elements/DataTable';
import DataList from 'App/Components/Elements/DataList';
import getConnectedAppsColumnsTemplate from './data-table-template';
import Loading from '../../../../../templates/_common/components/loading.jsx';

class ConnectedApps extends React.Component {
    state = {
        is_loading: true,
        is_modal_open: false,
        selected_app_id: null,
    };

    componentDidMount() {
        this.updateApp();
    }

    handleRevokeAccess = () => {
        this.setState({ is_modal_open: false, is_loading: true });
        this.props.revokeAccess(this.state.selected_app_id).then(() => this.updateApp());
    };

    handleToggleModal = (app_id = null) => {
        if (this.state.is_modal_open === true) {
            this.setState({ is_modal_open: false, selected_app_id: null });
        } else {
            this.setState({ is_modal_open: true, selected_app_id: app_id });
        }
    };

    updateApp = () => {
        this.props
            .fetchConnectedApps()
            .then(result => {
                this.props.setConnectedApps(result);
                this.setState({ is_loading: false });
            })
            .catch(() => {
                this.setState({ is_loading: true });
            });
    };

    columns_map = getConnectedAppsColumnsTemplate(this.handleToggleModal).reduce((map, item) => {
        map[item.col_index] = item;
        return map;
    }, {});

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
            <section className='connected-apps'>
                <p className='connected-apps__title'>{localize('Authorised applications')}</p>
                <div>
                    {this.state.is_loading ? (
                        <Loading />
                    ) : (
                        <>
                            <DesktopWrapper>
                                <DataTable
                                    className='connected-apps'
                                    data_source={this.props.connected_apps}
                                    columns={getConnectedAppsColumnsTemplate(this.handleToggleModal)}
                                    custom_width={'100%'}
                                    getRowSize={() => 56}
                                    is_empty={false}
                                >
                                    {this.state.is_loading && <Loading />}
                                </DataTable>
                            </DesktopWrapper>
                            <MobileWrapper>
                                <DataList
                                    className='connected-apps'
                                    data_source={this.props.connected_apps}
                                    custom_width={'100%'}
                                    getRowSize={() => 128}
                                    is_empty={false}
                                    rowRenderer={this.mobileRowRenderer}
                                >
                                    {this.state.is_loading && <Loading />}
                                </DataList>
                            </MobileWrapper>
                        </>
                    )}
                </div>
                <Modal
                    is_open={this.state.is_modal_open}
                    className='connected-apps'
                    toggleModal={this.handleToggleModal}
                >
                    <Modal.Body>
                        <div className='connected-app-modal'>
                            <Icon icon='IcAccountTrashCan' size={128} className='connected-app-modal__icon' />
                            <p className='connected-app-modal__message'>{localize('Confirm revoke access?')}</p>
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

export default connect(({ client }) => ({
    connected_apps: client.connected_apps,
    fetchConnectedApps: client.fetchConnectedApps,
    revokeAccess: client.revokeAccess,
    setConnectedApps: client.setConnectedApps,
}))(ConnectedApps);
