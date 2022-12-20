import { routes } from '@deriv/shared';
import PaymentAgentStore from '../payment-agent-store';

describe('PaymentAgentStore', () => {
    let payment_agent_store;
    const mocked_payment_agent_list = {
        list: [
            {
                currencies: 'USD',
                deposit_commission: 0,
                email: 'pa@example.com',
                further_information: 'further information',
                max_withdrawal: '2000',
                min_withdrawal: '10',
                name: 'Payment Agent of CR90000000',
                paymentagent_loginid: 'CR90000000',
                phone_numbers: [{ phone_number: '+12345678' }],
                supported_payment_methods: [{ payment_method: 'Visa' }],
                urls: [{ url: 'http://www.pa.com' }],
                withdrawal_commission: 0,
            },
            {
                currencies: 'USD',
                deposit_commission: 0,
                email: 'pa@example.com',
                further_information: 'further information',
                max_withdrawal: '2000',
                min_withdrawal: '10',
                name: 'Payment Agent of CR90000002',
                paymentagent_loginid: 'CR90000002',
                phone_numbers: [{ phone_number: '+12345678' }],
                supported_payment_methods: [{ payment_method: 'Visa' }, { payment_method: 'Mastercard' }],
                urls: [{ url: 'http://www.pa.com' }],
                withdrawal_commission: 0,
            },
        ],
    };
    const mocked_payment_agents = [
        {
            currency: 'USD',
            deposit_commission: 0,
            email: 'pa@example.com',
            further_information: 'further information',
            max_withdrawal: '2000',
            min_withdrawal: '10',
            name: 'Payment Agent of CR90000000',
            paymentagent_loginid: 'CR90000000',
            phones: [{ phone_number: '+12345678' }],
            supported_banks: [{ payment_method: 'Visa' }],
            urls: [{ url: 'http://www.pa.com' }],
            withdrawal_commission: 0,
        },
        {
            currency: 'USD',
            deposit_commission: 0,
            email: 'pa@example.com',
            further_information: 'further information',
            max_withdrawal: '2000',
            min_withdrawal: '10',
            name: 'Payment Agent of CR90000002',
            paymentagent_loginid: 'CR90000002',
            phones: [{ phone_number: '+12345678' }],
            supported_banks: [{ payment_method: 'Visa' }, { payment_method: 'Mastercard' }],
            urls: [{ url: 'http://www.pa.com' }],
            withdrawal_commission: 0,
        },
    ];
    const mocked_withdrawal_request = {
        loginid: 'CR90000000',
        currency: 'USD',
        amount: '200',
        verification_code: 'abCDefXa',
    };

    beforeEach(() => {
        const root_store = {
            client: {
                currency: 'USD',
                residence: 'id',
            },
            common: {
                routeTo: jest.fn(),
            },
            modules: {
                cashier: {
                    general_store: {
                        setLoading: jest.fn(),
                        onMountCommon: jest.fn(),
                    },
                },
            },
        };
        const WS = {
            allPaymentAgentList: () =>
                Promise.resolve({
                    paymentagent_list: mocked_payment_agent_list,
                }),
            authorized: {
                paymentAgentDetails: () =>
                    Promise.resolve({ paymentagent_details: { max_withdrawal: '2000', min_withdrawal: '10' } }),
                paymentAgentList: jest.fn(() =>
                    Promise.resolve({
                        paymentagent_list: mocked_payment_agent_list,
                    })
                ),
                paymentAgentWithdraw: jest.fn(() =>
                    Promise.resolve({ paymentagent_withdraw: '2', paymentagent_name: 'name' })
                ),
            },
            wait: () => Promise.resolve(),
        };

        payment_agent_store = new PaymentAgentStore({ root_store, WS });
    });

    beforeAll(() => {
        const spyWindow = jest.spyOn(window, 'window', 'get');
        spyWindow.mockImplementation(() => ({
            location: {
                pathname: routes.cashier_pa,
            },
        }));
    });

    afterAll(() => {
        spyWindow.mockRestore();
    });

    it('should set active_tab_index', () => {
        payment_agent_store.setActiveTabIndex(0);
        expect(payment_agent_store.active_tab_index).toBe(0);

        payment_agent_store.setActiveTabIndex(1);
        expect(payment_agent_store.active_tab_index).toBe(1);
    });

    it('should get is_payment_agent_visible', async () => {
        expect(payment_agent_store.is_payment_agent_visible).toBe(false);

        await payment_agent_store.onMountPaymentAgentWithdraw();
        expect(payment_agent_store.is_payment_agent_visible).toBe(true);
    });

    it('should get payment agent details', async () => {
        const payment_agent_details = await payment_agent_store.getPaymentAgentDetails();
        expect(payment_agent_details).toEqual({
            min_withdrawal: '10',
            max_withdrawal: '2000',
        });
    });

    it('should add a supported bank', () => {
        payment_agent_store.addSupportedBank('Visa');
        expect(payment_agent_store.supported_banks).toEqual(expect.arrayContaining([{ text: 'Visa', value: 'visa' }]));
    });

    it('should clear the list of supported banks', () => {
        payment_agent_store.clearSuppertedBanks();
        expect(payment_agent_store.supported_banks.length).toBe(0);
    });

    it('should sort the list of supported banks', () => {
        payment_agent_store.addSupportedBank('Visa');
        payment_agent_store.addSupportedBank('Mastercard');
        payment_agent_store.addSupportedBank('ZingPay');
        payment_agent_store.sortSupportedBanks();
        expect(payment_agent_store.supported_banks).toStrictEqual([
            { text: 'Mastercard', value: 'mastercard' },
            { text: 'Visa', value: 'visa' },
            { text: 'ZingPay', value: 'zingpay' },
        ]);
    });

    it('should add payment agent to list', () => {
        payment_agent_store.setList(mocked_payment_agents[0]);
        expect(payment_agent_store.list).toEqual(
            expect.arrayContaining([
                {
                    currency: 'USD',
                    deposit_commission: 0,
                    email: 'pa@example.com',
                    further_information: 'further information',
                    max_withdrawal: '2000',
                    min_withdrawal: '10',
                    name: 'Payment Agent of CR90000000',
                    paymentagent_loginid: 'CR90000000',
                    phones: [{ phone_number: '+12345678' }],
                    supported_banks: [{ payment_method: 'Visa' }],
                    urls: [{ url: 'http://www.pa.com' }],
                    withdrawal_commission: 0,
                },
            ])
        );
    });

    it('should clear the list of payment agents', () => {
        payment_agent_store.clearList();
        expect(payment_agent_store.list.length).toBe(0);
    });

    // it('should set payment agent list', async () => {
    //     const spySortSupportedBanks = jest.spyOn(payment_agent_store, 'sortSupportedBanks');

    //     await payment_agent_store.setPaymentAgentList();
    //     expect(payment_agent_store.list).toEqual(expect.arrayContaining(mocked_payment_agents));
    //     expect(spySortSupportedBanks).toHaveBeenCalled();
    // });

    it('should filter payment agent list by selected bank', async () => {
        await payment_agent_store.setPaymentAgentList();
        payment_agent_store.filterPaymentAgentList('card');
        expect(payment_agent_store.filtered_list).toEqual(
            expect.arrayContaining([
                {
                    currency: 'USD',
                    deposit_commission: 0,
                    email: 'pa@example.com',
                    further_information: 'further information',
                    max_withdrawal: '2000',
                    min_withdrawal: '10',
                    name: 'Payment Agent of CR90000002',
                    paymentagent_loginid: 'CR90000002',
                    phones: [{ phone_number: '+12345678' }],
                    supported_banks: [{ payment_method: 'Visa' }, { payment_method: 'Mastercard' }],
                    urls: [{ url: 'http://www.pa.com' }],
                    withdrawal_commission: 0,
                },
                {
                    currency: 'USD',
                    deposit_commission: 0,
                    email: 'pa@example.com',
                    further_information: 'further information',
                    max_withdrawal: '2000',
                    min_withdrawal: '10',
                    name: 'Payment Agent of CR90000000',
                    paymentagent_loginid: 'CR90000000',
                    phones: [{ phone_number: '+12345678' }],
                    supported_banks: [{ payment_method: 'Visa' }],
                    urls: [{ url: 'http://www.pa.com' }],
                    withdrawal_commission: 0,
                },
            ])
        );
    });

    it('should filter payment agent list by search term', async () => {
        payment_agent_store.setSearchTerm('CR90000002');
        await payment_agent_store.setPaymentAgentList();
        payment_agent_store.filterPaymentAgentList();
        expect(payment_agent_store.filtered_list.length).toBe(1);
        expect(payment_agent_store.filtered_list).toEqual(
            expect.arrayContaining([
                {
                    currency: 'USD',
                    deposit_commission: 0,
                    email: 'pa@example.com',
                    further_information: 'further information',
                    max_withdrawal: '2000',
                    min_withdrawal: '10',
                    name: 'Payment Agent of CR90000002',
                    paymentagent_loginid: 'CR90000002',
                    phones: [{ phone_number: '+12345678' }],
                    supported_banks: [{ payment_method: 'Visa' }, { payment_method: 'Mastercard' }],
                    urls: [{ url: 'http://www.pa.com' }],
                    withdrawal_commission: 0,
                },
            ])
        );
    });

    it('should set has_payment_agent_search_warning to true when there is no matches for the search term', async () => {
        payment_agent_store.setSearchTerm('blabla');
        await payment_agent_store.setPaymentAgentList();
        payment_agent_store.filterPaymentAgentList();
        expect(payment_agent_store.filtered_list.length).toBe(0);
    });

    it('should return empty filtered list of payment agent if there is no payment agent available when accessing from payment agent page', async () => {
        payment_agent_store.filterPaymentAgentList();
        expect(payment_agent_store.filtered_list).toEqual([]);
    });

    it('should filter the payment agent list on change of payment method', async () => {
        await payment_agent_store.setPaymentAgentList();
        payment_agent_store.onChangePaymentMethod({ target: { value: '0' } });
        expect(payment_agent_store.filtered_list.length).toBe(2);

        payment_agent_store.onChangePaymentMethod({ target: { value: 'card' } });
        expect(payment_agent_store.filtered_list.length).toBe(2);
    });

    it('should set is_withdraw', () => {
        payment_agent_store.setIsWithdraw();
        expect(payment_agent_store.is_withdraw).toBeTruthy();

        payment_agent_store.setIsWithdraw(false);
        expect(payment_agent_store.is_withdraw).toBeFalsy();
    });

    it('should set is_search_loading', () => {
        payment_agent_store.setIsSearchLoading(true);
        expect(payment_agent_store.is_search_loading).toBeTruthy();
    });

    it('should set has_payment_agent_search_warning', () => {
        payment_agent_store.setPaymentAgentSearchWarning(true);
        expect(payment_agent_store.has_payment_agent_search_warning).toBeTruthy();
    });

    it('should set search_term', () => {
        payment_agent_store.setSearchTerm('Search term');
        expect(payment_agent_store.search_term).toBe('Search term');
    });

    // it('should set is_try_withdraw_successful', () => {
    //     const spySetErrorMessage = jest.spyOn(payment_agent_store.error, 'setErrorMessage');

    //     payment_agent_store.setIsTryWithdrawSuccessful(true);
    //     expect(spySetErrorMessage).toHaveBeenCalledWith('');
    //     expect(payment_agent_store.is_try_withdraw_successful).toBeTruthy();
    // });

    it('should set is_withdraw_successful', () => {
        payment_agent_store.setIsWithdrawSuccessful(false);
        expect(payment_agent_store.is_withdraw_successful).toBeFalsy();
    });

    it('should set confirm value', () => {
        const confirmation = {
            amount: '100',
            currency: 'USD',
            loginid: 'CR90000000',
            payment_agent_name: 'Payment Agent of CR90000000',
        };

        payment_agent_store.setConfirmation(confirmation);
        expect(payment_agent_store.confirm).toEqual(confirmation);
    });

    it('should set receipt value', () => {
        const receipt = {
            amount_transferred: '100',
            payment_agent_email: 'pa@example.com',
            payment_agent_id: 'CR90000000',
            payment_agent_name: 'Payment Agent of CR90000000',
            payment_agent_phone: '+12345678',
            payment_agent_url: 'http://www.pa.com',
        };

        payment_agent_store.setReceipt(receipt);
        expect(payment_agent_store.receipt).toEqual(receipt);
    });

    it('should add payment agent', () => {
        const payment_agent = {
            name: 'Payment Agent of CR90000003',
            paymentagent_loginid: 'CR90000003',
            max_withdrawal: '2000',
            min_withdrawal: '10',
            email: 'pa@example.com',
            phone_numbers: [{ phone_number: '+12345678' }],
            urls: [{ url: 'http://www.pa.com' }],
        };

        payment_agent_store.addPaymentAgent(payment_agent);
        expect(payment_agent_store.agents).toEqual(
            expect.arrayContaining([
                {
                    text: 'Payment Agent of CR90000003',
                    value: 'CR90000003',
                    max_withdrawal: '2000',
                    min_withdrawal: '10',
                    email: 'pa@example.com',
                    phone: [{ phone_number: '+12345678' }],
                    url: [{ url: 'http://www.pa.com' }],
                },
            ])
        );
    });

    it('should mount payment agent withdraw', async () => {
        await payment_agent_store.onMountPaymentAgentWithdraw();

        expect(payment_agent_store.is_withdraw).toBeTruthy();
        expect(payment_agent_store.is_withdraw_successful).toBeFalsy();
        expect(payment_agent_store.receipt).toEqual({});
        expect(payment_agent_store.agents).toEqual(
            expect.arrayContaining([
                {
                    text: 'Payment Agent of CR90000000',
                    value: 'CR90000000',
                    max_withdrawal: '2000',
                    min_withdrawal: '10',
                    email: 'pa@example.com',
                    phone: [{ phone_number: '+12345678' }],
                    url: [{ url: 'http://www.pa.com' }],
                },
            ])
        );
    });

    it('should redirect to deposit page if there is no available payment agent upon accessing PA withdrawal', async () => {
        payment_agent_store.WS.authorized.paymentAgentList.mockResolvedValueOnce({ paymentagent_list: { list: [] } });
        await payment_agent_store.onMountPaymentAgentWithdraw();
        expect(payment_agent_store.root_store.common.routeTo).toHaveBeenCalledWith(routes.cashier_deposit);
    });

    // it('should request to try payment agent withdraw', async () => {
    //     const spySetErrorMessage = jest.spyOn(payment_agent_store.error, 'setErrorMessage');

    //     await payment_agent_store.onMountPaymentAgentWithdraw();
    //     await payment_agent_store.requestTryPaymentAgentWithdraw(mocked_withdrawal_request);
    //     expect(spySetErrorMessage).toHaveBeenCalledWith('');
    //     expect(payment_agent_store.confirm).toEqual({
    //         amount: '200',
    //         currency: 'USD',
    //         loginid: 'CR90000000',
    //         payment_agent_name: 'Payment Agent of CR90000000',
    //     });
    //     expect(payment_agent_store.is_try_withdraw_successful).toBeTruthy();
    // });

    // it('should handle error when requesting to try payment agent withdraw', async () => {
    //     const spySetErrorMessage = jest.spyOn(payment_agent_store.error, 'setErrorMessage');
    //     const error_message = { message: 'Sorry, an error occurred.' };

    //     payment_agent_store.WS.authorized.paymentAgentWithdraw.mockResolvedValueOnce({ error: error_message });
    //     await payment_agent_store.requestTryPaymentAgentWithdraw(mocked_withdrawal_request);
    //     expect(spySetErrorMessage).toHaveBeenLastCalledWith(error_message, payment_agent_store.resetPaymentAgent);
    //     expect(payment_agent_store.is_try_withdraw_successful).toBeFalsy();
    // });

    // it('should reset payment agent withdrawal form', () => {
    //     const spySetErrorMessage = jest.spyOn(payment_agent_store.error, 'setErrorMessage');

    //     payment_agent_store.resetPaymentAgent();
    //     expect(spySetErrorMessage).toHaveBeenLastCalledWith('');
    //     expect(payment_agent_store.is_withdraw).toBeFalsy();
    //     expect(payment_agent_store.active_tab_index).toBe(0);
    // });

    // it('should mount payment agent list', async () => {
    //     const spyGetPaymentAgentList = jest.spyOn(payment_agent_store, 'getPaymentAgentList');

    //     await payment_agent_store.onMountPaymentAgentList();
    //     expect(spyGetPaymentAgentList).toHaveBeenCalled();
    // });

    it('should get all payment agents', async () => {
        const payment_agents = await payment_agent_store.getAllPaymentAgentList();
        expect(payment_agents).toEqual({
            paymentagent_list: mocked_payment_agent_list,
        });
    });

    it('should set all_payment_agent_list', () => {
        const list = {
            paymentagent_list: mocked_payment_agent_list,
        };

        payment_agent_store.setAllPaymentAgentList(list);
        expect(payment_agent_store.all_payment_agent_list).toEqual(list);
        expect(payment_agent_store.is_payment_agent_visible_in_onboarding).toBeTruthy();
    });

    it('should request for payment agent withdraw', async () => {
        payment_agent_store.WS.authorized.paymentAgentWithdraw.mockResolvedValueOnce({ paymentagent_withdraw: 1 });
        await payment_agent_store.onMountPaymentAgentWithdraw();
        await payment_agent_store.requestPaymentAgentWithdraw(mocked_withdrawal_request);
        expect(payment_agent_store.receipt).toEqual({
            amount_transferred: '200.00',
            payment_agent_email: 'pa@example.com',
            payment_agent_id: 'CR90000000',
            payment_agent_name: 'Payment Agent of CR90000000',
            payment_agent_phone: [{ phone_number: '+12345678' }],
            payment_agent_url: [{ url: 'http://www.pa.com' }],
        });
        expect(payment_agent_store.is_withdraw_successful).toBeTruthy();
        expect(payment_agent_store.is_try_withdraw_successful).toBeFalsy();
        expect(payment_agent_store.confirm).toEqual({});
    });

    // it('should handle error when requesting for payment agent withdraw', async () => {
    //     const spySetErrorMessage = jest.spyOn(payment_agent_store.error, 'setErrorMessage');
    //     const error_message = { message: 'Sorry, an error occurred.' };

    //     payment_agent_store.WS.authorized.paymentAgentWithdraw.mockResolvedValueOnce({ error: error_message });
    //     await payment_agent_store.requestPaymentAgentWithdraw(mocked_withdrawal_request);
    //     expect(spySetErrorMessage).toHaveBeenLastCalledWith(error_message, payment_agent_store.resetPaymentAgent);
    //     expect(payment_agent_store.is_withdraw_successful).toBeFalsy();
    // });
});
