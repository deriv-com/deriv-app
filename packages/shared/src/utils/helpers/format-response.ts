import { getUnsupportedContracts } from '../constants';
import { getSymbolDisplayName, TActiveSymbols } from './active-symbols';
import { getMarketInformation } from './market-underlying';

type TPortfolioPos = {
    buy_price: number;
    contract_id?: number;
    contract_type?: string;
    longcode: string;
    payout: number;
    shortcode: string;
    transaction_id?: number;
    transaction_ids?: {
        buy: number;
        sell: number;
    };
    limit_order?: {
        stop_loss?: null | number;
        take_profit?: null | number;
    };
};

type TIsUnSupportedContract = {
    contract_type?: string;
    is_forward_starting?: 0 | 1;
};

const isUnSupportedContract = (portfolio_pos: TIsUnSupportedContract) =>
    !!getUnsupportedContracts()[portfolio_pos.contract_type as keyof typeof getUnsupportedContracts] || // check unsupported contract type
    !!portfolio_pos.is_forward_starting; // for forward start contracts

export const formatPortfolioPosition = (
    portfolio_pos: TPortfolioPos,
    active_symbols: TActiveSymbols = [],
    indicative?: number
) => {
    const purchase = portfolio_pos.buy_price;
    const payout = portfolio_pos.payout;
    const display_name = getSymbolDisplayName(active_symbols, getMarketInformation(portfolio_pos.shortcode).underlying);
    const transaction_id =
        portfolio_pos.transaction_id || (portfolio_pos.transaction_ids && portfolio_pos.transaction_ids.buy);

    return {
        contract_info: portfolio_pos,
        details: portfolio_pos.longcode.replace(/\n/g, '<br />'),
        display_name,
        id: portfolio_pos.contract_id,
        indicative: (indicative && isNaN(indicative)) || !indicative ? 0 : indicative,
        payout,
        purchase,
        reference: Number(transaction_id),
        type: portfolio_pos.contract_type,
        is_unsupported: isUnSupportedContract(portfolio_pos),
        contract_update: portfolio_pos.limit_order,
    };
};

export const idv_error_statuses = Object.freeze({
    poi_name_dob_mismatch: 'POI_NAME_DOB_MISMATCH',
    poi_dob_mismatch: 'POI_DOB_MISMATCH',
    poi_name_mismatch: 'POI_NAME_MISMATCH',
    poi_expired: 'POI_EXPIRED',
    poi_failed: 'POI_FAILED',
});

export type TIDVErrorStatus = typeof idv_error_statuses[keyof typeof idv_error_statuses];

export const formatIDVError = (errors: string[], status_code: string) => {
    const error_keys: Record<string, TIDVErrorStatus> = {
        name: 'POI_NAME_MISMATCH',
        birth: 'POI_DOB_MISMATCH',
    };
    if (status_code === 'expired') {
        return 'POI_EXPIRED';
    }
    const status: TIDVErrorStatus[] = [];
    errors.forEach(error => {
        const error_regex = RegExp(/(name|birth)/i).exec(error);
        if (error_regex) {
            status.push(error_keys[error_regex[0].toLowerCase()]);
        }
    });
    return status.includes(error_keys.name) && status.includes(error_keys.birth)
        ? 'POI_NAME_DOB_MISMATCH'
        : status[0] ?? 'POI_FAILED';
};
