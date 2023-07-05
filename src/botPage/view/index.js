import React from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import 'notifyjs-browser';
import 'jquery-ui/ui/widgets/dialog';
import 'jquery-ui-css/jquery-ui.min.css';
import '@deriv/deriv-charts/dist/smartcharts.css';
import 'react-virtualized/styles.css';
import 'binary-style/binary.css';
import store from './deriv/store';
import App from './deriv/app';
import '../../assets/css/index.scss';

const container = document.getElementById('main');
const root = createRoot(container);

root.render(
    <Provider store={store}>
        <App />
    </Provider>
);
