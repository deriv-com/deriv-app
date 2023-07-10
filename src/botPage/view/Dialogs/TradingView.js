import React from 'react';
import config from '@config';
import { translate } from '@i18n';
import { iframe as iframeStyle } from '../style';
import Dialog from './Dialog';

const chartWidth = 700;
const chartHeight = 700;

function TradingViewComponent() {
    return <iframe style={iframeStyle} src={config.trading_view_chart.url} />;
}

export default class TradingView extends Dialog {
    constructor() {
        super('trading-view-dialog', translate(config.trading_view_chart.label), <TradingViewComponent />, {
            width: chartWidth,
            height: chartHeight,
        });
    }
}
