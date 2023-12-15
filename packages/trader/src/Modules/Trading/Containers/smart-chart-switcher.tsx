import React from 'react';
import { SmartChart } from 'Modules/SmartChart';
import { SmartChartBeta } from 'Modules/SmartChartBeta';
import {
    ActiveSymbols,
    ActiveSymbolsRequest,
    AuditDetailsForExpiredContract,
    ProposalOpenContract,
    ServerTimeRequest,
    TickSpotData,
    TicksHistoryRequest,
    TicksHistoryResponse,
    TicksStreamResponse,
    TradingTimes,
    TradingTimesRequest,
} from '@deriv/api-types';
import { useStore } from '@deriv/stores';
import type { TBottomWidgetsParams } from './trade';
import type { TChartLayout, TChartStateChangeOption } from 'Stores/Modules/Trading/trade-store';

type TMarkersArray = ReturnType<typeof useStore>['contract_trade']['markers_array'];
type TGetContractsArray = ReturnType<typeof useStore>['contract_replay']['contract_store']['getContractsArray'];
type TBarriers = ReturnType<typeof useStore>['portfolio']['barriers'];

type TContractsArray = TMarkersArray | ReturnType<TGetContractsArray>;

type TGetIndicatorHeightRatio = (chart_height: number, indicator_count: number) => TRatio;

type TInitialChartData = {
    activeSymbols?: ActiveSymbols;
    masterData?: TQuote[];
    tradingTimes?: TradingTimes;
};

type TLanguage = {
    icon: JSX.Element;
    key: string;
    name: string;
};

type TNotification = {
    category: string;
    text: string;
    type?: 'info' | 'warning' | 'success' | 'error';
};

type TOHLCData = {
    close: string;
    epoch: number;
    granularity: TicksHistoryRequest['granularity'];
    high: string;
    id: string;
    low: string;
    open: string;
    open_time: number;
    symbol: string;
};

type TSettings = {
    activeLanguages?: Array<string | TLanguage> | null;
    countdown?: boolean;
    enabledNavigationWidget?: boolean;
    historical?: boolean;
    isAutoScale?: boolean;
    isHighestLowestMarkerEnabled?: boolean;
    lang?: string;
    language?: string;
    minimumLeftBars?: number;
    position?: string;
    theme?: string;
    whitespace?: number;
};

type TQuote = {
    Close: number;
    Date: string;
    DT?: Date;
    High?: number;
    ohlc?: TOHLCData;
    Open?: number;
    Low?: number;
    tick?: TickSpotData;
    prevClose?: number;
    Volume?: number;
};

type TRatio = {
    height: number;
    percent: number;
};

type TSmartChartProps = React.PropsWithChildren<{
    allowTickChartTypeOnly?: boolean;
    allTicks?: NonNullable<AuditDetailsForExpiredContract>['all_ticks'];
    anchorChartToLeft?: boolean;
    barriers?: TBarriers;
    bottomWidgets?: (props: TBottomWidgetsParams) => React.ReactElement;
    chartControlsWidgets?: ((props: { isMobile?: boolean }) => React.ReactElement) | null;
    chartData?: TInitialChartData;
    chartStatusListener?: (isChartReady: boolean) => void;
    chartType?: string;
    clearChart?: boolean;
    contractInfo?: ProposalOpenContract;
    contracts_array: TContractsArray;
    crosshair?: number;
    crosshairState?: number | null;
    crosshairTooltipLeftAllow?: number | null;
    enabledChartFooter?: boolean;
    enabledNavigationWidget?: boolean;
    enableRouting?: boolean;
    enableScroll?: boolean | null;
    enableZoom?: boolean | null;
    endEpoch?: number;
    feedCall?: { activeSymbols?: boolean; tradingTimes?: boolean };
    getIndicatorHeightRatio?: TGetIndicatorHeightRatio;
    getMarketsOrder?: (active_symbols: ActiveSymbols) => string[];
    granularity?: number;
    hasAlternativeSource?: boolean;
    historical?: boolean;
    id?: string;
    importedLayout?: TChartLayout | null;
    initialData?: TInitialChartData;
    isAnimationEnabled?: boolean;
    isConnectionOpened?: boolean;
    isLive?: boolean;
    isMobile?: boolean;
    isStaticChart?: boolean;
    leftMargin?: number;
    margin?: number;
    maxTick?: number | null;
    networkStatus?: {
        class: string;
        tooltip: string;
    };
    onCrosshairChange?: (state?: number | null) => void | null;
    onExportLayout?: (currentLayout: TChartLayout) => void;
    onMessage?: (message: TNotification) => void;
    onSettingsChange?: (newSettings: Omit<TSettings, 'activeLanguages'>) => void;
    refreshActiveSymbols?: boolean;
    requestAPI: (req: TradingTimesRequest | ActiveSymbolsRequest | ServerTimeRequest) => void;
    requestForget: (req: TicksHistoryRequest) => void;
    requestForgetStream?: (stream_id: string) => void;
    requestSubscribe: (
        req: TicksHistoryRequest,
        callback: (response: TicksHistoryResponse | TicksStreamResponse) => void
    ) => void;
    scrollToEpoch?: number | null;
    settings?: TSettings;
    shouldDrawTicksFromContractInfo?: boolean;
    shouldFetchTickHistory?: boolean;
    shouldFetchTradingTimes?: boolean;
    should_show_eu_content?: boolean;
    should_zoom_out_on_yaxis?: boolean;
    showLastDigitStats?: boolean;
    startEpoch?: number;
    startWithDataFitMode?: boolean;
    stateChangeListener?: (state: string, option?: TChartStateChangeOption) => void;
    symbol?: string;
    toolbarWidget?: () => React.ReactElement;
    topWidgets?: () => React.ReactElement;
    yAxisMargin?: { bottom?: number; top: number };
    zoom?: number;
}>;

type TSmartChartSwitcherProps = TSmartChartProps & {
    is_beta: boolean;
};

const SmartChartSwitcher = ({ is_beta, ...props }: TSmartChartSwitcherProps) => {
    const Chart = is_beta ? SmartChartBeta : SmartChart;
    return <Chart data-testid='SmartChart' {...props} />;
};

export default SmartChartSwitcher;
