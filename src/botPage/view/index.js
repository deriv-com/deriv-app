/* eslint-disable import/no-extraneous-dependencies */
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import 'notifyjs-browser';
import 'jquery-ui/ui/widgets/dialog';
import 'jquery-ui-css/jquery-ui.min.css';
import '@deriv/deriv-charts/dist/smartcharts.css';
import store from './deriv/store';
import App from './deriv/app';

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('main')
);
