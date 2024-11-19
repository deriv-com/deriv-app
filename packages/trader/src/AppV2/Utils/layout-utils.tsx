import { TCommonStoreServicesError } from '@deriv/stores/types';
import { getTradeParams } from './trade-params-utils';

export const HEIGHT = {
    ADVANCED_FOOTER: 136,
    ADDITIONAL_INFO: 30,
    BOTTOM_NAV: 56,
    CHART_STATS: 56,
    HEADER: 40,
    PADDING: 24,
};

export const ASPECT_RATIO = 0.5625;

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

export const SERVICE_ERROR = {
    INSUFFICIENT_BALANCE: 'InsufficientBalance',
    INVALID_CONTRACT_PROPOSAL: 'InvalidContractProposal',
    AUTHORIZATION_REQUIRED: 'AuthorizationRequired',
    PLEASE_AUTHENTICATE: 'PleaseAuthenticate',
    PENDING_VERIFICATION: 'PendingVerification',
    COMPANY_WIDE_LIMIT_EXCEEDED: 'CompanyWideLimitExceeded',
};

export const checkIsServiceModalError = ({
    services_error,
    is_mf_verification_pending_modal_visible,
}: {
    services_error: TCommonStoreServicesError;
    is_mf_verification_pending_modal_visible?: boolean;
}) => {
    const { code, type } = services_error || {};
    // Error modal is shown only for next four types. For the rest - snackbar.
    const is_insufficient_balance =
        code === SERVICE_ERROR.INSUFFICIENT_BALANCE || code === SERVICE_ERROR.INVALID_CONTRACT_PROPOSAL;
    const is_authorization_required = code === SERVICE_ERROR.AUTHORIZATION_REQUIRED && type === 'buy';
    const is_account_verification_required = code === SERVICE_ERROR.PLEASE_AUTHENTICATE;
    return (
        is_insufficient_balance ||
        is_authorization_required ||
        is_account_verification_required ||
        !!is_mf_verification_pending_modal_visible
    );
};
