import { cacheTrackEvents } from '@deriv/shared';
import { Analytics } from '@deriv-com/analytics';

export const sendDtraderV2OpenToAnalytics = () => {
    cacheTrackEvents.loadEvent([
        {
            event: {
                name: 'ce_dtrader_trade_form',
                properties: {
                    action: 'open',
                },
            },
        },
    ]);
};

export const sendSelectedTradeTypeToAnalytics = (
    trade_name: string,
    subform_name: string,
    market_name: string,
    trade_type_count: number
) => {
    cacheTrackEvents.loadEvent([
        {
            event: {
                name: 'ce_dtrader_trade_form',
                properties: {
                    action: 'select_trade_type',
                    trade_name,
                    subform_name,
                    market_name,
                    trade_type_count,
                },
            },
        },
    ]);
};

export const sendOpenGuideToAnalytics = (trade_name: string, subform_name: string) => {
    cacheTrackEvents.loadEvent([
        {
            event: {
                name: 'ce_dtrader_trade_form',
                properties: {
                    action: 'open_guide',
                    trade_name,
                    subform_name,
                },
            },
        },
    ]);
};

export const sendMarketTypeToAnalytics = (market_name: string, trade_name: string) => {
    cacheTrackEvents.loadEvent([
        {
            event: {
                name: 'ce_dtrader_trade_form',
                properties: {
                    action: 'select_market_type',
                    market_name,
                    trade_name,
                },
            },
        },
    ]);
};

export const sendDtraderV2PurchaseToAnalytics = (trade_name: string, market_name: string, contract_id: number) => {
    cacheTrackEvents.loadEvent([
        {
            event: {
                name: 'ce_dtrader_trade_form',
                properties: {
                    action: 'run_contract',
                    trade_name,
                    market_name,
                    contract_id,
                },
            },
        },
    ]);
};

export const sendDtraderPurchaseToAnalytics = (trade_name: string, market_name: string, contract_id: number) => {
    cacheTrackEvents.loadEvent([
        {
            event: {
                name: 'ce_contracts_set_up_form',
                properties: {
                    action: 'run_contract',
                    trade_name,
                    market_name,
                    contract_id,
                },
            },
        },
    ]);
};
