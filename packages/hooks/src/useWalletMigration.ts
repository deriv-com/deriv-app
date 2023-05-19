import { useFetch } from '@deriv/api';

const mock_wallet_migration_response = {
    status: 'ineligible',
    account_list: [
        {
            account_category: 'wallet',
            account_type: 'doughflow',
            platform: 'dwallet',
            currency: 'USD',
            link_accounts: [
                {
                    loginid: 'CR123',
                    account_category: 'trading',
                    account_type: 'standart',
                    platform: 'dtrade',
                    is_EU: '0',
                },
                {
                    loginid: 'MTR234',
                    account_category: 'trading',
                    account_type: 'mt5',
                    platform: 'mt5',
                    is_EU: '1',
                },
            ],
        },
        {
            account_category: 'wallet',
            account_type: 'virtual',
            platform: 'dwallet',
            currency: 'USD',
            link_accounts: [
                {
                    loginid: 'VRTC12',
                    account_category: 'trading',
                    account_type: 'standart',
                    platform: 'dtrade',
                },
            ],
        },
        {
            account_category: 'wallet',
            account_type: 'crypto',
            platform: 'dwallet',
            currency: 'BTC',
            link_accounts: [
                {
                    loginid: 'CR567',
                    account_category: 'trading',
                    account_type: 'Bitcoin',
                    platform: 'dtrade',
                },
            ],
        },
        {
            account_category: 'wallet',
            account_type: 'crypto',
            platform: 'dwallet',
            currency: 'ETH',
            link_accounts: [
                {
                    loginid: 'CR89',
                    account_category: 'trading',
                    account_type: 'Ethereum',
                    platform: 'dtrade',
                },
            ],
        },
    ],
};

const useWalletMigration = () => {
    const { data, ...rest } = useFetch('wallet_migration', {
        payload: { account: undefined },
        options: {
            initialData: mock_wallet_migration_response,
            enabled: false,
        },
    });

    const transformed_data = { ...data, foo: 'bar' };

    return {
        data,
        ...rest,
    };
};

export default useWalletMigration;
