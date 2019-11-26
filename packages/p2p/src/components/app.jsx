import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Tabs } from 'deriv-components';
import { localize } from 'deriv-translations/lib/i18n';
import Ads from './ads/ads.jsx';
import Orders from './orders/orders.jsx';
import MyAds from './my-ads/my-ads.jsx';
import MyProfile from './my-profile/my-profile.jsx';
import { init } from '../utils/websocket';
import './app.scss';

const App = ({
    websocket_api,
}) => {
    const [active_index, setActiveIndex] = useState(0);
    useEffect(() => {
        // initialize websocket
        const index_to_set = /orders/.test(window.location.pathname) ? 1 : 0;
        if (this.state.active_index !== index_to_set) {
            setActiveIndex(index_to_set);
        }

        init(websocket_api);
    }, []);
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
                <hr />
            </main>
        </Fragment>
    );
};

App.propTypes = {
    websocket_api: PropTypes.object,
};

export default App;
