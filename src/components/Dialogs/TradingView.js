import React from 'react';
import config from '@config';
import { translate } from '@i18n';
import { observer as globalObserver } from '@utilities/observer';
import Dialog from './Dialog';

const chartWidth = 800;
const chartHeight = 700;

function TradingViewComponent() {
    React.useEffect(() => {
        // eslint-disable-next-line no-console
        const onLoad = () => console.info('TradingView chart loaded successfully!');
        const onError = error => globalObserver.emit('Error', error);
        const iframe = document.querySelector('iframe');
        iframe.addEventListener('load', onLoad);
        iframe.addEventListener('error', onError);

        return () => {
            iframe.removeEventListener('load', onLoad);
            iframe.removeEventListener('error', onError);
        };
    }, []);
    return <iframe id='iframe' style={{ width: '100%', height: '100%' }} src={config.trading_view_chart.url} />;
}

export default class TradingView extends Dialog {
    constructor() {
        super('trading-view-dialog', translate(config.trading_view_chart.label), <TradingViewComponent />, {
            width: chartWidth,
            height: chartHeight,
        });
    }
}
