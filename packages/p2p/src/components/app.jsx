import React, { Fragment, Component } from 'react';
import PropTypes from 'prop-types';
import { Tabs } from 'deriv-components';
import { localize } from 'deriv-translations/lib/i18n';
import Ads from './ads/ads.jsx';
import Orders from './orders/orders.jsx';
import MyAds from './my-ads/my-ads.jsx';
import MyProfile from './my-profile/my-profile.jsx';
import { init } from '../utils/websocket';
import './app.scss';

class App extends Component {

    constructor(props) {
        super(props);

        init(this.props.websocket_api);

        this.state = {
            activeIndex: 0,
        }
    }

    componentDidMount() {
        // TODO: [fix-index-set] Fix issues with unresolved index to set in tabs
        const index_to_set = /orders/.test(window.location.pathname) ? 1 : 0;

        if (this.state.active_index !== index_to_set) {
            this.setState({ active_index: index_to_set});
        }
    }

    render() {
        const { active_index } = this.state;

        return (
            <Fragment>
                {/*
                    App can overwrite the styles by passing css variables to className deriv-api
                    you can refer to deriv-shared/themes for the css variables that are used in deriv-app as well as p2p
                */}
                <main className='deriv-api'>
                    <nav>
                        <Tabs active_index={active_index}>
                            <div label={localize('Buy/sell')}>
                                <Ads />
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
                    </nav>
                </main>
            </Fragment>
        );
    }
}

App.propTypes = {
    websocket_api: PropTypes.object,
};

export default App;
