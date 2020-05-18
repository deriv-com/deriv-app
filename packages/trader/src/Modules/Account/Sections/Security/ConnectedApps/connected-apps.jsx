import React from 'react';
import PropTypes from 'prop-types';
import { DesktopWrapper, MobileWrapper, Button, Modal, Icon } from '@deriv/components';
import { localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import ErrorComponent from 'App/Components/Elements/Errors';
import DataTable from 'App/Components/Elements/DataTable';
import DataList from 'App/Components/Elements/DataList';
import getConnectedAppsColumnsTemplate from './data-table-template';
import Loading from '../../../../../templates/_common/components/loading.jsx';

class ConnectedApps extends React.Component {
    state = {
        is_loading: true,
        is_modal_open: false,
        selected_app_id: null,
        is_error: false,
        connected_apps: [],
    };

    componentDidMount() {
        this.updateApp();
    }

    handleRevokeAccess = () => {
        this.setState({ is_modal_open: false, is_loading: true });
        this.props.revokeAccess(this.state.selected_app_id).then(this.updateApp);
    };

    handleToggleModal = (app_id = null) => {
        if (this.state.is_modal_open) {
            this.setState({ is_modal_open: false, selected_app_id: null });
        } else {
            this.setState({ is_modal_open: true, selected_app_id: app_id });
        }
    };

    updateApp = () => {
        this.props
            .fetchConnectedApps()
            .then(response => {
                this.setState({
                    is_loading: false,
                    connected_apps: response,
                });
            })
            .catch(() => {
                this.setState({ is_error: true });
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
                {this.state.is_error ? (
                    <ErrorComponent />
                ) : (
                    <React.Fragment>
                        <DesktopWrapper>
                            <DataTable
                                className='connected-apps'
                                data_source={this.state.connected_apps}
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
                                data_source={this.state.connected_apps}
                                custom_width={'100%'}
                                getRowSize={() => 128}
                                is_empty={false}
                                rowRenderer={this.mobileRowRenderer}
                            >
                                {this.state.is_loading && <Loading />}
                            </DataList>
                        </MobileWrapper>
                        )
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

ConnectedApps.propTypes = {
    fetchConnectedApps: PropTypes.func,
    revokeAccess: PropTypes.func,
};
export default connect(({ client }) => ({
    fetchConnectedApps: client.fetchConnectedApps,
    revokeAccess: client.revokeConnectedApp,
}))(ConnectedApps);
