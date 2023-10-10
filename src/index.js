import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import 'notifyjs-browser';
import 'jquery-ui/ui/widgets/dialog';
import 'jquery-ui-css/jquery-ui.min.css';
import '@deriv/deriv-charts/dist/smartcharts.css';
import 'react-virtualized/styles.css';
import 'binary-style/binary.css';
import store from '@redux-store';
import App from './app';
import './assets/css/index.scss';

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('main')
);
