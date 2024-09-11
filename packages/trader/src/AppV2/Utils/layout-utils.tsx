import { getTradeParams } from './trade-params-utils';

export const HEIGHT = {
    ADVANCED_FOOTER: 136,
    ADDITIONAL_INFO: 30,
    BOTTOM_NAV: 56,
    CHART_STATS: 56,
    HEADER: 40,
    PADDING: 24,
};

export const isTradeParamVisible = ({
    component_key,
    contract_type,
    has_cancellation,
    symbol,
}: {
    component_key: string;
    contract_type: string;
    has_cancellation: boolean;
    symbol: string;
}) => {
    const params = getTradeParams(symbol, has_cancellation)?.[contract_type] ?? {};
    return component_key in params;
};

export const getChartHeight = ({
    contract_type,
    has_cancellation,
    is_accumulator,
    symbol,
}: {
    contract_type: string;
    has_cancellation: boolean;
    is_accumulator: boolean;
    symbol: string;
}) => {
    const height = window.innerHeight - HEIGHT.HEADER - HEIGHT.BOTTOM_NAV - HEIGHT.ADVANCED_FOOTER - HEIGHT.PADDING;
    const isVisible = (component_key: string) =>
        isTradeParamVisible({ component_key, symbol, has_cancellation, contract_type });

    if (is_accumulator) return height - HEIGHT.CHART_STATS;
    if (
        isVisible('expiration') ||
        isVisible('mult_info_display') ||
        isVisible('payout_per_point_info') ||
        isVisible('allow_equals') ||
        isVisible('payout')
    )
        return height - HEIGHT.ADDITIONAL_INFO;
    return height;
};
