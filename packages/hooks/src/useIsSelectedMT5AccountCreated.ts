import { useStore } from '@deriv/stores';
import { MT5_ACCOUNT_STATUS } from '@deriv/shared';

const getStatusBadge = (status: string) => {
    if (status === 'proof_failed') {
        return MT5_ACCOUNT_STATUS.FAILED;
    } else if (status === 'verification_pending') {
        return MT5_ACCOUNT_STATUS.PENDING;
    } else if (status === 'needs_verification') {
        return MT5_ACCOUNT_STATUS.NEEDS_VERIFICATION;
    }
};

const useIsSelectedMT5AccountCreated = () => {
    const {
        client,
        modules: { cfd },
    } = useStore();
    const { mt5_login_list, trading_platform_available_accounts } = client;
    const { jurisdiction_selected_shortcode, product } = cfd;
    const created_account = mt5_login_list.filter(
        account => account.landing_company_short === jurisdiction_selected_shortcode && account.product === product
    );
    const selected_account = trading_platform_available_accounts.filter(
        account => account.shortcode === jurisdiction_selected_shortcode && account.product === product
    );

    const is_selected_MT5_account_created = created_account && Object.keys(created_account).length > 0;
    const selected_mt5_account = is_selected_MT5_account_created ? created_account[0] : selected_account[0];
    const selected_account_status = is_selected_MT5_account_created
        ? getStatusBadge(selected_mt5_account?.status)
        : MT5_ACCOUNT_STATUS.PENDING;

    return {
        is_selected_MT5_account_created,
        selected_mt5_account,
        selected_account_status,
    };
};

export default useIsSelectedMT5AccountCreated;
