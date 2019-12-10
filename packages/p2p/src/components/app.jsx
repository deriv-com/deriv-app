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

const allowed_currency = 'USD';
class App extends Component {

    constructor(props) {
        super(props);

        setLanguage(this.props.lang);
        init(this.props.websocket_api);

        this.state = {
            activeIndex: 0,
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

    render() {
        const { active_index } = this.state;
        const { currency, is_virtual } = this.props.client;

        // TODO:
        if (currency !== allowed_currency || is_virtual) {
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
                        <div label={localize('Buy/sell')}>
                            <BuySell />
                        </div>
                        <div label={localize('Orders')}>
                            <Orders />
                        </div>
                        <div label={localize('My ads')}>
                            <MyAds />
                        </div>
                        <div label={localize('My profile')}>
                            <MyProfile />
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
