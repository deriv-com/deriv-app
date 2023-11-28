import { GetSettings, ProfitTable, ResidenceList, Statement } from '@deriv/api-types';
import { idv_error_statuses } from '../constants/idv-failure-codes';
import { getContractTypeFeatureFlag, getUnsupportedContracts, STATUS_CODES } from '../constants';
import { getSymbolDisplayName, TActiveSymbols } from './active-symbols';
import { getMarketInformation } from './market-underlying';
import { TContractInfo } from '../contract';
import { LocalStore } from '../storage';
import { extractInfoFromShortcode, isHighLow } from '../shortcode';

type TIsUnSupportedContract = {
    contract_type?: string;
    is_forward_starting?: 0 | 1;
};

const isUnSupportedContract = (portfolio_pos: TIsUnSupportedContract) =>
    !!getUnsupportedContracts()[portfolio_pos.contract_type as keyof typeof getUnsupportedContracts] || // check unsupported contract type
    !!portfolio_pos.is_forward_starting; // for forward start contracts

export const filterDisabledPositions = (
    position:
        | TContractInfo
        | NonNullable<Statement['transactions']>[number]
        | NonNullable<ProfitTable['transactions']>[number]
) => {
    const { contract_type, shortcode } = position as TContractInfo;
    const type = contract_type ?? extractInfoFromShortcode(shortcode ?? '').category?.toUpperCase() ?? '';
    return Object.entries(LocalStore.getObject('FeatureFlagsStore')?.data ?? {}).every(
        ([key, value]) => !!value || key !== getContractTypeFeatureFlag(type, isHighLow({ shortcode }))
    );
};

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
export const formatIDVError = (errors: string[], status_code: string, is_high_risk?: boolean) => {
    /**
     * Check required incase of DIEL client
     */
    if (
        errors.length === 0 &&
        (status_code === STATUS_CODES.NONE || status_code === STATUS_CODES.VERIFIED) &&
        !is_high_risk
    ) {
        return null;
    }
    if (is_high_risk && status_code === STATUS_CODES.VERIFIED) {
        return idv_error_statuses.poi_high_risk;
    }
    const error_keys: Record<string, TIDVErrorStatus> = {
        name: 'POI_NAME_MISMATCH',
        birth: 'POI_DOB_MISMATCH',
        rejected: 'POI_FAILED',
    };
    if (status_code === STATUS_CODES.EXPIRED) {
        return idv_error_statuses.poi_expired;
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
        ? idv_error_statuses.poi_name_dob_mismatch
        : status[0] ?? idv_error_statuses.poi_failed;
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
