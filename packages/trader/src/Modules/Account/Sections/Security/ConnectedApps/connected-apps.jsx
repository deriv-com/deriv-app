import React from 'react';
import { localize } from '@deriv/translations';
import { connect } from 'Stores/connect';

class ConnectedApps extends React.Component {
    state = {
        is_loading: true,
    };
    componentDidMount() {
        let apps_list = this.props.fetchConnectedApps();
        apps_list.then(
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
                    <div>{this.state.is_loading ? 'waiting...' : this.props.connected_apps.map(v => v.name)}</div>
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
