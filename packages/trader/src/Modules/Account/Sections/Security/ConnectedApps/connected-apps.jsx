import React from 'react';
import { localize } from '@deriv/translations';
import { connect } from 'Stores/connect';
import Loading from '../../../../../templates/_common/components/loading.jsx';
import DataTable from 'App/Components/Elements/DataTable';

const ColTemplate = [{ title: 'Name', col_index: 'name' }];
class ConnectedApps extends React.Component {
    state = {
        is_loading: true,
    };
    componentDidMount() {
        this.props.fetchConnectedApps().then(
            result => {
                this.props.setConnectedApps(result);
                this.setState({ is_loading: false });
            },
            error => {
                this.setState({ is_loading: true });
            }
        );
    }
    render() {
        return (
            <section className='connected-apps'>
                <div className='connected-apps__title'>
                    <p>{localize('Authorised applications')}</p>
                    <div>
                        {this.state.is_loading ? (
                            <Loading />
                        ) : (
                            <DataTable
                                className='connected-apps'
                                data_source={this.props.connected_apps}
                                columns={ColTemplate}
                                custom_width={'100%'}
                                getRowSize={() => 63}
                                custom_height={300}
                                is_empty={false}
                            >
                                {this.state.is_loading && <Loading />}
                            </DataTable>
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
    setConnectedApps: client.setConnectedApps,
}))(ConnectedApps);
