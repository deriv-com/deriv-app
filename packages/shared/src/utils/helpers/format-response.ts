import { GetSettings, ResidenceList } from '@deriv/api-types';
import { getUnsupportedContracts } from '../constants';
import { getSymbolDisplayName, TActiveSymbols } from './active-symbols';
import { getMarketInformation } from './market-underlying';
import { TContractInfo } from '../contract';
import { idv_error_statuses } from '../constants/error';

type TIsUnSupportedContract = {
    contract_type?: string;
    is_forward_starting?: 0 | 1;
};

const isUnSupportedContract = (portfolio_pos: TIsUnSupportedContract) =>
    !!getUnsupportedContracts()[portfolio_pos.contract_type as keyof typeof getUnsupportedContracts] || // check unsupported contract type
    !!portfolio_pos.is_forward_starting; // for forward start contracts

export const formatPortfolioPosition = (
    portfolio_pos: TContractInfo,
    active_symbols: TActiveSymbols = [],
    indicative?: number
) => {
    const purchase = portfolio_pos.buy_price;
    const payout = portfolio_pos.payout;
    const display_name = getSymbolDisplayName(
        active_symbols,
        getMarketInformation(portfolio_pos.shortcode || '').underlying
    );
    const transaction_id =
        portfolio_pos.transaction_id || (portfolio_pos.transaction_ids && portfolio_pos.transaction_ids.buy);

    return {
        contract_info: portfolio_pos,
        details: portfolio_pos.longcode?.replace(/\n/g, '<br />'),
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

export type TIDVErrorStatus = typeof idv_error_statuses[keyof typeof idv_error_statuses];

//formatIDVError is parsing errors messages from BE (strings) and returns error codes for using it on FE
export const formatIDVError = (errors: string[], status_code: string) => {
    if (errors.length === 0 && status_code === 'none') return null;
    const error_keys: Record<string, TIDVErrorStatus> = {
        name: 'POI_NAME_MISMATCH',
        birth: 'POI_DOB_MISMATCH',
        rejected: 'POI_FAILED',
    };
    if (status_code === 'expired') {
        return 'POI_EXPIRED';
    }
    const status: TIDVErrorStatus[] = [];
    errors.forEach(error => {
        const error_regex = RegExp(/(name|birth|rejected)/i).exec(error);
        if (error_regex) {
            status.push(error_keys[error_regex[0].toLowerCase()]);
        }
    });
    return status.includes(error_keys.name) &&
        status.includes(error_keys.birth) &&
        !status.includes(error_keys.rejected)
        ? 'POI_NAME_DOB_MISMATCH'
        : status[0] ?? 'POI_FAILED';
};

export const isVerificationServiceSupported = (
    residence_list: ResidenceList,
    account_settings: GetSettings,
    service: 'idv' | 'onfido'
): boolean => {
    const citizen = account_settings?.citizen || account_settings?.country_code;
    if (!citizen) return false;
    const citizen_data = residence_list.find(item => item.value === citizen);

    return !!citizen_data?.identity?.services?.[service]?.is_country_supported;
};
