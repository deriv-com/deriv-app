import classNames           from 'classnames';
import React, { Component } from 'react';
import PropTypes            from 'prop-types';
import { Tabs }             from 'deriv-components';
import ServerTime           from 'Utils/server-time';
import { init, requestWS }  from 'Utils/websocket';
import { AgentProvider }    from 'Components/context/agent-context';
import {
    localize,
    setLanguage }           from './i18next';
import BuySell              from './buy-sell/buy-sell.jsx';
import Orders               from './orders/orders.jsx';
// import MyAds      from './my-ads/my-ads.jsx';
// import MyProfile  from './my-profile/my-profile.jsx';
import './app.scss';

const allowed_currency = 'USD';

const path = {
    buy_sell: 0,
    orders  : 1,
    // my_ads  : 2,
    // my_profile: 3,
};

class App extends Component {
    constructor(props) {
        super(props);

        setLanguage(this.props.lang);
        init(this.props.websocket_api);
        ServerTime.init(this.props.server_time);

        this.state = {
            active_index: 0,
            parameters  : null,
            is_agent    : false,
        };
    }

    redirectTo = (path_name, params = null) => {
        this.setState({ active_index: path[path_name], parameters: params });
    };

    handleTabClick = () => {
        this.setState({ parameters: null });
    }

    setIsAgent = async () => {
        const agent_info = await requestWS({ p2p_agent_info: 1 });

        /* if there is no error means its an agent else its a client */
        if (!agent_info.error) {
            this.setState({ is_agent: true });
        }
    }

    componentDidMount() {
        this.setIsAgent();
    }

    render() {
        const { active_index, parameters } = this.state;
        const { className, client: { currency, is_virtual } } = this.props;

        // TODO: remove allowed_currency check once we publish this to everyone
        if (is_virtual || currency !== allowed_currency) {
            return <h1 className='p2p-not-allowed'>{localize('This feature is only available for real-money USD accounts right now.')}</h1>;
        }

        return (
            <AgentProvider value={this.state.is_agent}>
                <main className={classNames('deriv-p2p', className)}>
                    <Tabs onTabItemClick={this.handleTabClick} active_index={active_index} top>
                        {/* TODO [p2p-uncomment] uncomment this when sell is ready */}
                        {/* <div label={localize('Buy / Sell')}> */}
                        <div label={localize('Buy')}>
                            <BuySell navigate={this.redirectTo} params={parameters} />
                        </div>
                        {/* TODO: [p2p-replace-with-api] Add 'count' prop to this div for notification counter */}
                        <div label={this.state.is_agent ? localize('Incoming orders') : localize('My Orders')}>
                            <Orders navigate={this.redirectTo} params={parameters} />
                        </div>
                        {/* TODO [p2p-uncomment] uncomment this when my ads is ready */}
                        {/* <div label={localize('My ads')}> */}
                        {/*    <MyAds navigate={this.redirectTo} params={parameters} /> */}
                        {/* </div> */}
                        {/* TODO [p2p-uncomment] uncomment this when profile is ready */}
                        {/* <div label={localize('My profile')}>
                            <MyProfile navigate={this.redirectTo} params={parameters} />
                        </div> */}
                    </Tabs>
                </main>
            </AgentProvider>
        );
    }
}

App.propTypes = {
    client: PropTypes.shape({
        currency  : PropTypes.string.isRequired,
        is_virtual: PropTypes.bool.isRequired,
    }),
    lang         : PropTypes.string,
    websocket_api: PropTypes.object.isRequired,
};

export default App;
