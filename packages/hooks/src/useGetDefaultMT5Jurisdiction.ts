import { useStore } from '@deriv/stores';

/**
 * Get default Jurisdiction for MT5 product types
 * Product types = Standard /Financial /Swap Free /Zero Spread/ STP = yet to be confirmed
 *
 */
const useGetDefaultMT5Jurisdiction = () => {
    const {
        client: { trading_platform_available_accounts },
        modules: { cfd },
    } = useStore();

    const { product } = cfd;

    // const default_jurisdiction = trading_platform_available_accounts.filter(
    //     available_account => available_account.product === product
    //      && is_default_jurisdiction
    // )[0]?.shortcode;

    return 'vanuatu';
};

export default useGetDefaultMT5Jurisdiction;
