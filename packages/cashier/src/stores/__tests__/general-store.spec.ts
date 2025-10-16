import { configure } from 'mobx';
import { waitFor } from '@testing-library/react';
import { routes, ContentFlag } from '@deriv/shared';
import GeneralStore from '../general-store';
import type { TWebSocket, TRootStore } from '../../types';
import { mockStore } from '@deriv/stores';

configure({ safeDescriptors: false });

let general_store: GeneralStore, root_store: ReturnType<typeof mockStore>, WS: DeepPartial<TWebSocket>;

beforeEach(() => {
    root_store = mockStore({
        client: {
            account_list: [{ is_virtual: false, title: 'USD' }],
            account_status: {
                status: [],
                cashier_validation: [],
            },
            balance: undefined,
            currency: 'USD',
            has_active_real_account: false,
            is_logged_in: true,
            is_eu: false,
            is_virtual: false,
            switched: false,
        },
        common: {
            routeTo: jest.fn(),
        },
        menu: {
            attach: jest.fn(),
            update: jest.fn(),
        },
        modules: {
            cashier: {
                account_transfer: {
                    accounts_list: [],
                    container: 'account_transfer',
                    selected_from: { balance: null },
                    sortAccountsTransfer: jest.fn(),
                },
                crypto_fiat_converter: {
                    converter_from_amount: null,
                },
                iframe: {
                    clearIframe: jest.fn(),
                },
                onramp: {
                    is_onramp_tab_visible: false,
                },
                payment_agent: {
                    setPaymentAgentList: jest.fn().mockResolvedValueOnce([]),
                    filterPaymentAgentList: jest.fn(),
                },
                transaction_history: {
                    is_transactions_crypto_visible: false,
                    setIsTransactionsCryptoVisible: jest.fn(),
                },
                withdraw: {
                    check10kLimit: jest.fn(),
                    setIsWithdrawConfirmed: jest.fn(),
                },
            },
        },
        ui: {
            toggleSetCurrencyModal: jest.fn(),
        },
        traders_hub: { content_flag: ContentFlag.CR_DEMO },
    });
    WS = {
        authorized: {
            p2pAdvertiserInfo: jest.fn().mockResolvedValueOnce({ error: { code: 'advertiser_error' } }),
        },
        wait: jest.fn(),
    };
    general_store = new GeneralStore(WS as TWebSocket, root_store as TRootStore);
});

describe('GeneralStore', () => {
    it('should set function on remount', () => {
        // TODO: use the actual function smh
        general_store.setOnRemount('function');

        expect(general_store.onRemount).toEqual('function');
    });

    it('should return false if the client currency is equal to USD when is_crypto property was called', () => {
        expect(general_store.is_crypto).toBeFalsy();
    });

    it('should return true if the client currency is equal to BTC when is_crypto property was called', () => {
        general_store.root_store.client.currency = 'BTC';
        expect(general_store.is_crypto).toBeTruthy();
    });

    it('should calculate proper percentage for account transfer container', () => {
        general_store.root_store.modules.cashier.crypto_fiat_converter.converter_from_amount = '500';
        general_store.root_store.modules.cashier.account_transfer.selected_from.balance = 10000;
        general_store.setActiveTab('account_transfer');
        general_store.calculatePercentage();

        expect(general_store.percentage).toBe(5);
    });

    it('should calculate proper percentage for other containers', () => {
        general_store.root_store.client.balance = '9000';
        general_store.setActiveTab('deposit');
        general_store.calculatePercentage('1000');

        expect(general_store.percentage).toBe(11);
    });

    it('should set percentage equal to zero if calculated percentage is not finite number', () => {
        general_store.root_store.client.balance = '9000';
        general_store.setActiveTab('deposit');
        general_store.calculatePercentage('abc');

        expect(general_store.percentage).toBe(0);
    });

    it('should reset percentage', () => {
        general_store.percentage = 50;
        general_store.percentageSelectorSelectionStatus(true);

        expect(general_store.percentage).toBe(0);
    });

    it('should change value of the variable is_deposit', () => {
        general_store.setIsDeposit(true);

        expect(general_store.is_deposit).toBeTruthy();
    });

    it('should change value of the variable should_show_all_available_currencies', () => {
        general_store.setShouldShowAllAvailableCurrencies(true);

        expect(general_store.should_show_all_available_currencies).toBeTruthy();
    });

    it('should set deposit target', () => {
        general_store.setDepositTarget('/cashier/payment-agent');

        expect(general_store.deposit_target).toBe('/cashier/payment-agent');
    });

    it('should trigger proper callbacks when setAccountSwitchListener was called', () => {
        const spyDisposeSwitchAccount = jest.spyOn(general_store, 'disposeSwitchAccount');
        const spyOnSwitchAccount = jest.spyOn(general_store, 'onSwitchAccount');
        general_store.setAccountSwitchListener();

        expect(spyDisposeSwitchAccount).toHaveBeenCalledTimes(1);
        expect(spyOnSwitchAccount).toHaveBeenCalledTimes(1);
        expect(spyOnSwitchAccount).toHaveBeenCalledWith(general_store.accountSwitcherListener);
    });

    it('should not call setPaymentAgentList method if is_populating_values is equal to true when onMountCommon was called', async () => {
        general_store.is_populating_values = true;
        await general_store.onMountCommon(false);

        await waitFor(() => {
            expect(general_store.root_store.modules.cashier.payment_agent.setPaymentAgentList).not.toHaveBeenCalled();
        });
    });

    it('should sort accounts transfer when onMountCommon was called', async () => {
        general_store.root_store.client.is_logged_in = true;
        await general_store.onMountCommon(false);

        expect(general_store.root_store.modules.cashier.account_transfer.sortAccountsTransfer).toHaveBeenCalledTimes(1);
    });

    it('should setOnRemount when onMountCommon was called with true argument', async () => {
        general_store.root_store.client.is_logged_in = true;
        const spySetOnRemount = jest.spyOn(general_store, 'setOnRemount');
        await general_store.onMountCommon(true);

        expect(spySetOnRemount).toHaveBeenCalledWith(general_store.onMountCommon);
    });

    it('should route to deposit page of payment agent tab  when is_payment_agent_visible is false and location.pahname = /cashier/payment-agent when onMountCommon was called', async () => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        jest.spyOn(window, 'window', 'get').mockImplementation(() => ({
            location: {
                pathname: routes.cashier_pa,
            },
        }));
        (
            general_store.root_store.modules.cashier.payment_agent.filterPaymentAgentList as jest.Mock
        ).mockResolvedValueOnce([]);
        general_store.root_store.client.is_logged_in = true;
        await general_store.onMountCommon(false);

        expect(general_store.root_store.common.routeTo).toHaveBeenCalledWith(routes.cashier_deposit);
        jest.restoreAllMocks();
    });

    it('should route to deposit page of onramp tab is not visible and location.pahname = /cashier/on-ramp when onMountCommon was called', async () => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        jest.spyOn(window, 'window', 'get').mockImplementation(() => ({
            location: {
                pathname: routes.cashier_onramp,
            },
        }));
        general_store.root_store.client.is_logged_in = true;
        await general_store.onMountCommon(false);

        expect(general_store.root_store.common.routeTo).toHaveBeenCalledWith(routes.cashier_deposit);
        jest.restoreAllMocks();
    });

    it('should route to deposit page and call proper methods if is_transactions_crypto_visible equal to false and location.pahname = /cashier/transactions-crypto when onMountCommon was called', async () => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        jest.spyOn(window, 'window', 'get').mockImplementation(() => ({
            location: {
                pathname: routes.cashier_transactions_crypto,
            },
        }));
        general_store.root_store.client.is_logged_in = true;
        await general_store.onMountCommon(false);

        expect(general_store.root_store.common.routeTo).toHaveBeenCalledWith(routes.cashier_deposit);
        jest.restoreAllMocks();
    });

    it('should set cashier tab index', () => {
        general_store.setCashierTabIndex(1);

        expect(general_store.cashier_route_tab_index).toBe(1);
    });

    it('should change the value of the variable is_loading', () => {
        general_store.setLoading(true);
        expect(general_store.is_loading).toBeTruthy();
    });

    it('should set active tab', () => {
        general_store.setActiveTab('deposit');
        expect(general_store.active_container).toBe('deposit');
    });
});
