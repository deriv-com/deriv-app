import { useStore } from '@deriv/stores';

const useIsSelectedMT5AccountCreated = () => {
    const {
        client,
        modules: { cfd },
    } = useStore();
    const { mt5_login_list } = client;
    const { jurisdiction_selected_shortcode, product } = cfd;

    const current_account = mt5_login_list.filter(
        account => account.landing_company_short === jurisdiction_selected_shortcode && account.product === product
    );
    return current_account ? current_account[0] : {};
};

export default useIsSelectedMT5AccountCreated;
