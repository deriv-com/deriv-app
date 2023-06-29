import { useStore } from '@deriv/stores';

const useWalletMigration = () => {
    // TODO: Use 'useFetch' in the future when BE functionality will be released
    // or mockServer start to work

    const {
        client: { wallet_migration_status },
    } = useStore();

    return {
        status: wallet_migration_status,
    };
};

export default useWalletMigration;
