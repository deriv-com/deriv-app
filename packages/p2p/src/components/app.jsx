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
import MyAds      from './my-ads/my-ads.jsx';
import MyProfile  from './my-profile/my-profile.jsx';
import                 './app.scss';

const allowed_currency        = 'USD';
const allowed_landing_company = 'svg';
const path = {
    buy_sell: 0,
    orders: 1,
    my_ads: 2,
    my_profile: 3,
}

class App extends Component {
    constructor(props) {
        super(props);

        setLanguage(this.props.lang);
        init(this.props.websocket_api, this.props.client.currency);

        this.state = {
            activeIndex: 0,
            parameters: null,
        };
    }

    componentDidMount() {
        // TODO: [p2p-fix-index-set] Fix issues with unresolved index to set in tabs
        if (typeof window !== 'undefined') {
            const index_to_set = /orders/.test(window.location.pathname) ? 1 : 0;

            if (this.state.active_index !== index_to_set) {
                this.setState({ active_index: index_to_set });
            }
        }
    }

    redirectTo = (path_name, params) => {
        this.setState({ active_index: path[path_name], parameters: params });
    }

    render() {
        const { active_index, parameters } = this.state;
        const {
            currency,
            is_virtual,
            landing_company_shortcode,
        } = this.props.client;

        // TODO: remove landing_company and allowed_currency checks once we publish this to everyone
        if (is_virtual || landing_company_shortcode !== allowed_landing_company || currency !== allowed_currency) {
            return <h1 className='p2p-not-allowed'>{localize('This feature is only available for real-money USD accounts right now.')}</h1>;
        }

        return (
            <Fragment>
                {/*
                    App can overwrite the styles by passing css variables to className deriv-api
                    you can refer to deriv-shared/themes for the css variables that are used in deriv-app as well as p2p
                */}
                <main className='deriv-p2p'>
                    <Tabs active_index={active_index}>
                        <div label={localize('Buy / sell')}>
                            <BuySell navigate={this.redirectTo} params={parameters} />
                        </div>
                        {/* TODO: [p2p-replace-with-api] Add 'count' prop to this div for notification counter */}
                        <div label={localize('Orders')}>
                            <Orders navigate={this.redirectTo} params={parameters} />
                        </div>
                        <div label={localize('My ads')}>
                            <MyAds navigate={this.redirectTo} params={parameters} />
                        </div>
                        <div label={localize('My profile')}>
                            <MyProfile navigate={this.redirectTo} params={parameters} />
                        </div>
                    </Tabs>
                </main>
            </Fragment>
        );
    }
}

App.propTypes = {
    lang         : PropTypes.string,
    websocket_api: PropTypes.object,
};

export default App;
