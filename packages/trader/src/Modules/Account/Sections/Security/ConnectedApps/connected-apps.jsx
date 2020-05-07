import React from 'react';
import { localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import { DesktopWrapper, MobileWrapper } from '@deriv/components';
import Loading from '../../../../../templates/_common/components/loading.jsx';
import DataTable from 'App/Components/Elements/DataTable';
import DataList from 'App/Components/Elements/DataList';
import { Button } from '@deriv/components';

const ColTemplate = revokeAccess => [
    { title: 'Name', col_index: 'name' },
    {
        title: 'Permission',
        col_index: 'scopes',
        renderCellContent: ({ cell_value }) => {
            return PreparePermissions(cell_value);
        },
    },
    { title: 'Last login', col_index: 'last_used' },
    {
        title: 'Action',
        col_index: 'app_id',
        renderCellContent: ({ cell_value }) => {
            return (
                <Button small secondary onClick={() => revokeAccess(cell_value)}>
                    {localize('Revoke access')}
                </Button>
            );
        },
    },
];

const PreparePermissions = permissions_list => {
    let list = [];
    permissions_list.forEach((value, index) => {
        permissions_list.length - 1 !== index
            ? list.push(value.charAt(0).toUpperCase() + value.slice(1) + ', ')
            : list.push(value.charAt(0).toUpperCase() + value.slice(1));
    });
    return <div>{list}</div>;
};

class ConnectedApps extends React.Component {
    state = {
        is_loading: true,
    };
    componentDidMount() {
        this.updateApp();
    }
    handleRevokeAccess = app_id => {
        this.setState({ is_loading: true });
        this.props.revokeAccess(app_id).then(() => this.updateApp());
    };

    updateApp = () => {
        this.props.fetchConnectedApps().then(
            result => {
                this.props.setConnectedApps(result);
                this.setState({ is_loading: false });
            },
            error => {
                this.setState({ is_loading: true });
            }
        );
    };
    columns_map = handleRevokeAccess =>
        ColTemplate(handleRevokeAccess).reduce((map, item) => {
            map[item.col_index] = item;
            return map;
        }, {});

    mobileRowRenderer = ({ row }) => {
        return (
            <div>
                <DataList.Cell row={row} column={this.columns_map(this.handleRevokeAccess).scopes} />
            </div>
        );
    };

    render() {
        return (
            <section className='connected-apps'>
                <div className='connected-apps__title'>
                    <p>{localize('Authorised applications')}</p>
                    <div>
                        {this.state.is_loading ? (
                            <Loading />
                        ) : (
                            <>
                                <DesktopWrapper>
                                    <DataTable
                                        className='connected-apps'
                                        data_source={this.props.connected_apps}
                                        columns={ColTemplate(this.handleRevokeAccess)}
                                        custom_width={'100%'}
                                        getRowSize={() => 63}
                                        is_empty={false}
                                    >
                                        {this.state.is_loading && <Loading />}
                                    </DataTable>
                                </DesktopWrapper>
                                <MobileWrapper>
                                    <DataList
                                        className='connected-apps__mobile'
                                        data_source={this.props.connected_apps}
                                        custom_width={'100%'}
                                        getRowSize={() => 204}
                                        is_empty={false}
                                        rowRenderer={this.mobileRowRenderer}
                                    >
                                        {this.state.is_loading && <Loading />}
                                    </DataList>
                                </MobileWrapper>
                            </>
                        )}
                    </div>
                </div>
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
