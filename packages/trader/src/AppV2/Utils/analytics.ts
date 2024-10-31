import { Analytics } from '@deriv-com/analytics';

export const sendDtraderV2OpenAnalytics = () => {
    Analytics.trackEvent('ce_dtrader_trade_form', {
        action: 'open',
    });
};

export const sendSelectedTradeTypeAnalytics = (
    trade_name: string,
    subform_name: string,
    market_name: string,
    trade_type_count: number
) => {
    Analytics.trackEvent('ce_dtrader_trade_form', {
        action: 'select_trade_type',
        trade_name,
        subform_name,
        market_name,
        trade_type_count,
    });
};

export const sendOpenGuideAnalytics = (trade_name: string, subform_name: string) => {
    Analytics.trackEvent('ce_dtrader_trade_form', {
        action: 'open_guide',
        trade_name,
        subform_name,
    });
};

export const sendMarketTypeAnalytics = (market_name: string, trade_name: string) => {
    Analytics.trackEvent('ce_dtrader_trade_form', {
        action: 'select_market_type',
        market_name,
        trade_name,
    });
};

export const sendDtraderV2PurchaseAnalytics = (trade_name: string, market_name: string, contract_id: number) => {
    Analytics.trackEvent('ce_dtrader_trade_form', {
        action: 'run_contract',
        trade_name,
        market_name,
        contract_id,
    });
};

export const sendDtraderPurchaseAnalytics = (trade_name: string, market_name: string, contract_id: number) => {
    Analytics.trackEvent('ce_contracts_set_up_form', {
        form_name: 'ce_contracts_set_up_form',
        trade_type_name: trade_name,
        action: 'run_contract',
        trade_name,
        market_name,
        contract_id,
    });
};
