import React, {
    Fragment,
    Component }   from 'react';
import PropTypes  from 'prop-types';
import { Tabs }   from 'deriv-components';
import { init }   from 'Utils/websocket';
import {
    localize,
    setLanguage } from './i18next';
import BuySell    from './buy-sell/buy-sell.jsx';
import Orders     from './orders/orders.jsx';
// import MyAds      from './my-ads/my-ads.jsx';
// import MyProfile  from './my-profile/my-profile.jsx';
import                 './app.scss';

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

        this.state = {
            active_index: 0,
            parameters  : null,
        };
    }

    redirectTo = (path_name, params) => {
        const parameter = params || null
        this.setState({ active_index: path[path_name], parameters: parameter });
    };

    handleTabClick = () => {
        this.setState({ parameters: null });
    }

    render() {
        const { active_index, parameters } = this.state;
        const { currency, is_virtual } = this.props.client;

        // TODO: remove allowed_currency check once we publish this to everyone
        if (is_virtual || currency !== allowed_currency) {
            return <h1 className='p2p-not-allowed'>{localize('This feature is only available for real-money USD accounts right now.')}</h1>;
        }

        return (
            <Fragment>
                {/*
                    App can overwrite the styles by passing css variables to className deriv-api
                    you can refer to deriv-shared/themes for the css variables that are used in deriv-app as well as p2p
                */}
                <main className='deriv-p2p'>
                    <Tabs onTabItemClick={this.handleTabClick} active_index={active_index} top>
                        {/* TODO [p2p-uncomment] uncomment this when sell is ready */}
                        {/* <div label={localize('Buy / Sell')}> */}
                        <div label={localize('Buy')}>
                            <BuySell navigate={this.redirectTo} params={parameters} />
                        </div>
                        {/* TODO: [p2p-replace-with-api] Add 'count' prop to this div for notification counter */}
                        <div label={localize('Orders')}>
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
            </Fragment>
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
