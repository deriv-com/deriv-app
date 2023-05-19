import { useFetch } from '@deriv/api';

const mock_balance_response = {
    accounts: {
        CR123: {
            balance: 123,
            converted_amount: 123,
            currency: 'USD',
            demo_account: 0,
            status: 1,
            type: 'deriv',
        },
        CR567: {
            balance: 567,
            converted_amount: 567,
            currency: 'Bitcoin',
            demo_account: 0,
            status: 1,
            type: 'deriv',
        },
        CR89: {
            balance: 89,
            converted_amount: 89,
            currency: 'ETH',
            demo_account: 0,
            status: 1,
            type: 'deriv',
        },
        MTR234: {
            balance: 234,
            converted_amount: 234,
            currency: 'USD',
            demo_account: 0,
            status: 1,
            type: 'deriv',
        },
        VRTC12: {
            balance: 12,
            converted_amount: 12,
            currency: 'USD',
            demo_account: 1,
            status: 1,
            type: 'deriv',
        },
    },
    balance: 42069,
    currency: 'USD',
    id: 'f1d28779-9745-1746-95ec-b98c17804779',
    loginid: 'CR90000010',
    total: {
        deriv: {
            amount: 10000,
            currency: 'USD',
        },
        deriv_demo: {
            amount: 10000,
            currency: 'USD',
        },
        mt5: {
            amount: 0,
            currency: 'USD',
        },
        mt5_demo: {
            amount: 0,
            currency: 'USD',
        },
    },
};

const useBalance = () => {
    const { data, ...rest } = useFetch('balance', {
        payload: { account: undefined },
        options: {
            initialData: mock_balance_response,
            enabled: false,
        },
    });

    const transformed_data = { ...data, foo: 'bar' };

    return {
        data,
        ...rest,
    };
};

export default useBalance;
