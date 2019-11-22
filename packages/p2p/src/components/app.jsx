import React from 'react';
import { BrowserRouter, Switch, Route, Link } from 'react-router-dom';
import Ads from './ads/ads.jsx';
import Orders from './orders/orders.jsx';
import '../styles/app.scss';

const App = () => (
    <BrowserRouter>
        <main>
            <nav>
                <ul className="navbar-nav mr-auto">
                    <li><Link to={'/buy-sell'}>Buy/Sell</Link></li>
                    <li><Link to={'/orders'}>Orders</Link></li>
                </ul>
            </nav>
            <hr />
            <Switch>
                <Route exact path='/buy-sell' component={Ads} />
                <Route path='/orders' component={Orders} />
            </Switch>
        </main>
    </BrowserRouter>
);

export default App;
