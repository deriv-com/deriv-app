import { useStore } from '@deriv/stores';

const useHasSvgAccount = () => {
    const { client } = useStore();
    const { active_accounts } = client;
    const has_svg_account = active_accounts.some(account => account.landing_company_shortcode === 'svg');

    return has_svg_account;
};

export default useHasSvgAccount;
