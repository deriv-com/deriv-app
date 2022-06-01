import React from 'react';
import {
    ChartMode,
    DrawTools,
    setSmartChartsPublicPath,
    Share,
    SmartChart,
    StudyLegend,
    ToolbarWidget,
    Views,
} from '@deriv/deriv-charts';
import { translate } from '../../../common/i18n';
import Dialog from './Dialog';
import ChartTicksService from '../../common/ChartTicksService';
import { observer as globalObserver } from '../../../common/utils/observer';
import { getLanguage } from '../../../common/lang';
import api from '../deriv/api';

setSmartChartsPublicPath('./js/');

export const BarrierTypes = {
    CALL: 'ABOVE',
    PUT: 'BELOW',
    EXPIRYRANGE: 'BETWEEN',
    EXPIRYMISS: 'OUTSIDE',
    RANGE: 'BETWEEN',
    UPORDOWN: 'OUTSIDE',
    ONETOUCH: 'NONE_SINGLE',
    NOTOUCH: 'NONE_SINGLE',
};

const ChartContent = () => {
    const [show, setVisibility] = React.useState(true);
    const [state, setState] = React.useState({
        chartType: 'mountain',
        granularity: 0,
        barrierType: undefined,
        high: undefined,
        low: undefined,
        symbol: globalObserver.getState('symbol'),
        should_barrier_display: false,
    });
    const ticksService = new ChartTicksService(api);
    const listeners = [];


    React.useEffect(() => {
        globalObserver.register('bot.init', initializeBot);
        globalObserver.register('bot.contract', updateContract)
        return () => {
            globalObserver.unregister('bot.init', initializeBot);
            globalObserver.unregister('bot.contract', updateContract);
        }
    }, [state.symbol])

    const initializeBot = symbol => {
        if (symbol && state.symbol !== symbol) {
            setVisibility(false);
            setState({
                ...state,
                symbol,
            })
            setTimeout(() => {
                setVisibility(true);
            }, 500)
        }
    }

    const updateContract = contract => {
        if (contract) {
            if (contract.is_sold) {
                setState({
                    ...state,
                    should_barrier_display: false,
                })
            } else {
                const updatedState = {
                    ...state,
                    barriers: BarrierTypes[contract.contract_type],
                };

                if (contract.barrier) updatedState.high = contract.barrier;
                if (contract.high_barrier) {
                    updatedState.high = contract.high_barrier;
                    updatedState.low = contract.low;
                }
                setState(updatedState);
            }
        }
    }

    const getKey = request => `${request.ticks_history}-${request.granularity}`;
    const requestAPI = (data) => ticksService.api.send(data);

    const requestSubscribe = (request, callback) => {
        const {
            ticks_history: symbol,
            style: dataType,
            granularity,
        } = request;

        if (dataType === 'candles') {
            listeners[getKey(request)] = ticksService.monitor({
                symbol,
                granularity,
                callback,
            });
        } else {
            listeners[getKey(request)] = ticksService.monitor({
                symbol,
                callback,
            });
        }
    }

    const requestForget = (request) => {
        const {
            ticks_history: symbol,
            style: dataType,
            granularity,
        } = request;

        const requsestKey = getKey(request);
        if (dataType === 'candles') {
            ticksService.stopMonitor({
                symbol,
                granularity,
                key: listeners[requsestKey],
            });
        } else {
            ticksService.stopMonitor({
                symbol,
                key: listeners[requsestKey],
            });
        }
        delete listeners[requsestKey];
    }

    const renderTopWidgets = () => <span />;

    const renderToolbarWidgets = () => (
        <ToolbarWidget>
            <ChartMode
                onChartType={chartType => setState({
                    ...state,
                    chartType,
                })}
                onGranularity={granularity => setState({
                    ...state,
                    granularity,
                })}
            />
            <StudyLegend searchInputClassName="data-hj-whitelist" />
            <DrawTools />
            <Views searchInputClassName="data-hj-whitelist" />
            <Share />
        </ToolbarWidget>
    );

    const barriers = [];
    if (!show) return null;

    return (
        <SmartChart
            barriers={barriers}
            chartControlsWidgets={null}
            chartType={state.chartType}
            enabledChartFooter={false}
            granularity={state.granularity}
            id="binary-bot-chart"
            isMobile={false}
            requestAPI={requestAPI}
            requestForget={requestForget}
            requestSubscribe={requestSubscribe}
            settings={{ language: getLanguage() }}
            symbol={state.symbol}
            toolbarWidget={renderToolbarWidgets}
            topWidgets={renderTopWidgets}
        />
    )
}

export default class Chart extends Dialog {
    constructor() {
        super('chart-dialog', translate('Chart'), <ChartContent />, {
            width: 600,
            height: 600,
            resizable: false,
        });
    }
}
