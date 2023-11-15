import React from 'react';
import { api_base } from '@api-base';
import { setSmartChartsPublicPath, SmartChart } from '@deriv/deriv-charts';
import { getLanguage } from '@storage';
import { translate } from '@i18n';
import { observer as globalObserver } from '@utilities/observer';
import Dialog from './Dialog';
import ChartTicksService from '../../botPage/common/ChartTicksService';
import ToolbarWidgets from './ToolbarWidgets';

setSmartChartsPublicPath('./js/');

const BarrierTypes = {
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
        chart_type: 'mountain',
        granularity: 0,
        high: undefined,
        low: undefined,
        symbol: globalObserver.getState('symbol'),
        should_barrier_display: false,
    });
    const ticksService = new ChartTicksService(api_base.api_chart);
    const listeners = [];

    React.useEffect(() => {
        globalObserver.register('bot.init', initializeBot);
        globalObserver.register('bot.contract', updateContract);
        return () => {
            globalObserver.unregister('bot.init', initializeBot);
            globalObserver.unregister('bot.contract', updateContract);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state.symbol]);

    const initializeBot = symbol => {
        if (symbol && state.symbol !== symbol) {
            setVisibility(false);
            setState({
                ...state,
                symbol,
            });
            setTimeout(() => {
                setVisibility(true);
            }, 500);
        }
    };

    const updateContract = contract => {
        if (!contract) return;
        if (contract?.is_sold) {
            setState({
                ...state,
                should_barrier_display: false,
            });
        } else {
            const updated_state = {
                ...state,
                barriers: BarrierTypes[contract.contract_type],
            };

            if (contract?.barrier) updated_state.high = contract.barrier;
            if (contract?.high_barrier) {
                updated_state.high = contract.high_barrier;
                updated_state.low = contract.low;
            }
            setState(updated_state);
        }
    };

    const getKey = request => `${request.ticks_history}-${request.granularity}`;
    const requestAPI = data =>
        api_base.api.send(data).catch(e => {
            globalObserver.emit('Error', e);
        });

    const requestSubscribe = (request, callback) => {
        const { ticks_history: symbol, style: dataType, granularity } = request;

        if (dataType === 'candles') {
            listeners[getKey(request)] = ticksService.monitor({
                symbol,
                granularity,
                callback,
                is_chart_candles: true,
            });
        } else {
            listeners[getKey(request)] = ticksService.monitor({
                symbol,
                callback,
                is_chart_ticks: true,
            });
        }
    };

    const requestForget = request => {
        const { ticks_history: symbol, style: dataType, granularity } = request;

        const requested_key = getKey(request);
        if (dataType === 'candles') {
            ticksService.stopMonitor({
                symbol,
                granularity,
                key: listeners[requested_key],
                is_chart: true,
            });
        } else {
            ticksService.stopMonitor({
                symbol,
                key: listeners[requested_key],
                is_chart: true,
            });
        }
        delete listeners[requested_key];
    };

    const renderTopWidgets = () => <span />;

    if (!show) return null;

    const handleStateChange = state_property => setState(state_property);

    return (
        <SmartChart
            barriers={[]}
            chartControlsWidgets={null}
            chartType={state.chart_type}
            enabledChartFooter={false}
            granularity={state.granularity}
            id='binary-bot-chart'
            isMobile={false}
            requestAPI={requestAPI}
            requestForget={requestForget}
            requestSubscribe={requestSubscribe}
            settings={{ language: getLanguage() }}
            symbol={state.symbol}
            toolbarWidget={() => <ToolbarWidgets handleStateChange={handleStateChange} />}
            topWidgets={renderTopWidgets}
        />
    );
};

export default class Chart extends Dialog {
    constructor() {
        super('chart-dialog', translate('Chart'), <ChartContent />, {
            width: 600,
            height: 600,
            resizable: false,
        });
    }
}
