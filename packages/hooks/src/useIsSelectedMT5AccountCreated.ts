import { useStore } from '@deriv/stores';

const useIsSelectedMT5AccountCreated = () => {
    const {
        client,
        modules: { cfd },
    } = useStore();
    const { mt5_login_list, trading_platform_available_accounts } = client;
    const { jurisdiction_selected_shortcode, product } = cfd;
    const created_account = mt5_login_list.filter(
        account => account.landing_company_short === jurisdiction_selected_shortcode && account.product === product
    )[0];
    const selected_account = trading_platform_available_accounts.filter(
        account => account.shortcode === jurisdiction_selected_shortcode && account.product === product
    )[0];

    return {
        selected_mt5_account: created_account ?? selected_account,
        is_selected_MT5_account_created: created_account && Object.keys(created_account).length > 0,
    };
};

export default useIsSelectedMT5AccountCreated;
