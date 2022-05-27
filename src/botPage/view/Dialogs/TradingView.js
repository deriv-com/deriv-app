import React from 'react';
import appConfig from '../../../app.config';
import { iframe as iframeStyle } from '../style';
import Dialog from './Dialog';

const chartWidth = 700;
const chartHeight = 700;

function TradingViewComponent() {
    return <iframe style={iframeStyle} src={appConfig.trading_view_chart.url} />;
}

export default class TradingView extends Dialog {
    constructor() {
        super('trading-view-dialog', appConfig.trading_view_chart.label, <TradingViewComponent />, {
            width: chartWidth,
            height: chartHeight,
        });
    }
}
