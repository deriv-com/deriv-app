import { configure } from 'mobx';
import { waitFor } from '@testing-library/react';
import { routes, ContentFlag } from '@deriv/shared';
import GeneralStore from '../general-store';
import type { TWebSocket, TRootStore } from 'Types';

configure({ safeDescriptors: false });

let general_store: GeneralStore, root_store: DeepPartial<TRootStore>, WS: DeepPartial<TWebSocket>;

beforeEach(() => {
    root_store = {
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
                account_prompt_dialog: {
                    last_location: null,
                    resetIsConfirmed: jest.fn(),
                },
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
                    getAllPaymentAgentList: jest.fn().mockResolvedValue(['PA1', 'PA2']),
                    setAllPaymentAgentList: jest.fn(),
                    setPaymentAgentList: jest.fn().mockResolvedValueOnce([]),
                    filterPaymentAgentList: jest.fn(),
                },
                payment_agent_transfer: {
                    is_payment_agent: false,
                    checkIsPaymentAgent: jest.fn(),
                },
                transaction_history: {
                    is_crypto_transactions_visible: false,
                    onMount: jest.fn(),
                    setIsCryptoTransactionsVisible: jest.fn(),
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
    };
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
        // TODO: Check this
        // const remountFunc = () => 'function';
        general_store.setOnRemount('function');

        expect(general_store.onRemount).toBe('function');
    });

    it('should return false if the client currency is equal to USD when is_crypto property was called', () => {
        expect(general_store.is_crypto).toBeFalsy();
    });

    it('should return true if the client currency is equal to BTC when is_crypto property was called', () => {
        general_store.root_store.client.currency = 'BTC';
        expect(general_store.is_crypto).toBeTruthy();
    });

    it('should return false if is_p2p_visible equal to false when is_p2p_enabled property was called', () => {
        expect(general_store.is_p2p_enabled).toBeFalsy();
    });

    it('should return true if is_p2p_visible equal to true and the client is not from eu country when is_p2p_enabled property was called', () => {
        general_store.setIsP2pVisible(true);
        expect(general_store.is_p2p_enabled).toBeTruthy();
    });

    it('should return false if is_p2p_visible equal to true and the client is from eu country when is_p2p_enabled property was called', () => {
        general_store.setIsP2pVisible(true);
        general_store.root_store.traders_hub.content_flag = ContentFlag.EU_REAL;
        expect(general_store.is_p2p_enabled).toBeFalsy();
    });

    // TODO: fix this test once website_status is called after authorized card has been released
    // it('should show p2p in cashier onboarding if the user account is not virtual, and he has USD account', async () => {
    //     await general_store.showP2pInCashierOnboarding();

    //     expect(general_store.show_p2p_in_cashier_onboarding).toBeTruthy();
    // });

    it('should not show p2p in cashier onboarding if the user has accounts with fiat currency, but has no account with USD currency', async () => {
        general_store.root_store.client.account_list = [{ title: 'EUR' }];
        await general_store.showP2pInCashierOnboarding();

        expect(general_store.show_p2p_in_cashier_onboarding).toBeFalsy();
    });

    it('should not show p2p in cashier onboarding if the user account is not virtual, and has no fiat currency accounts', async () => {
        general_store.root_store.client.account_list = [{ title: 'BTC' }];
        await general_store.showP2pInCashierOnboarding();

        expect(general_store.show_p2p_in_cashier_onboarding).toBeFalsy();
    });

    it('should set has_set_currency equal to true if the client has real USD account', () => {
        general_store.setHasSetCurrency();

        expect(general_store.has_set_currency).toBeTruthy();
    });

    it('should set has_set_currency equal to false if the client has real account with account.title = "Real"', () => {
        general_store.root_store.client.account_list = [{ is_virtual: 1, title: 'Real' }];
        general_store.root_store.client.has_active_real_account = true;
        general_store.setHasSetCurrency();

        expect(general_store.has_set_currency).toBeFalsy();
    });

    it('should perform proper cashier onboarding mounting', async () => {
        general_store.has_set_currency = false;
        const spySetHasSetCurrency = jest.spyOn(general_store, 'setHasSetCurrency');
        const spySetIsCashierOnboarding = jest.spyOn(general_store, 'setIsCashierOnboarding');
        const spySetLoading = jest.spyOn(general_store, 'setLoading');
        const { account_prompt_dialog, payment_agent } = general_store.root_store.modules.cashier;
        await general_store.onMountCashierOnboarding();

        expect(spySetHasSetCurrency).toHaveBeenCalledTimes(1);
        expect(spySetIsCashierOnboarding).toHaveBeenCalledWith(true);
        expect(account_prompt_dialog.resetIsConfirmed).toHaveBeenCalledTimes(1);
        expect(spySetLoading.mock.calls).toEqual([[true], [false]]);
        expect(payment_agent.setAllPaymentAgentList).toHaveBeenCalledWith(['PA1', 'PA2']);
    });

    it('should calculate proper percentage for account transfer container', () => {
        general_store.root_store.modules.cashier.crypto_fiat_converter.converter_from_amount = 500;
        general_store.root_store.modules.cashier.account_transfer.selected_from.balance = 10000;
        general_store.setActiveTab('account_transfer');
        general_store.calculatePercentage();

        expect(general_store.percentage).toBe(5);
    });

    it('should calculate proper percentage for other containers', () => {
        general_store.root_store.client.balance = '9000';
        general_store.setActiveTab('deposit');
        general_store.calculatePercentage(1000);

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

    it('should change value of the variable is_cashier_onboarding', () => {
        general_store.setIsCashierOnboarding(true);

        expect(general_store.is_cashier_onboarding).toBeTruthy();
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

    it('should perform proper init invocation when is_logged_in is equal to true', async () => {
        const spyCheckP2pStatus = jest.spyOn(general_store, 'checkP2pStatus');
        general_store.root_store.client.is_logged_in = true;
        general_store.init();

        await waitFor(() => {
            expect(spyCheckP2pStatus).toHaveBeenCalledTimes(1);
        });

        // Don't remove eslint here as WS.wait is expected to be called 3 times from init and checkP2pStatus
        // eslint-disable-next-line testing-library/await-async-utils
        expect(general_store.WS.wait).toHaveBeenCalledTimes(3);
        expect(general_store.root_store.modules.cashier.withdraw.check10kLimit).toHaveBeenCalledTimes(1);
    });

    it('should set is_p2p_visible equal to false, if there is a virtual account', () => {
        general_store.root_store.client.is_virtual = true;
        general_store.checkP2pStatus();

        expect(general_store.is_p2p_visible).toBeFalsy();
    });

    it('should check is the client a payment agent ? when onMountCommon was called', async () => {
        general_store.root_store.client.is_logged_in = true;
        await general_store.onMountCommon(false);

        expect(
            general_store.root_store.modules.cashier.payment_agent_transfer.checkIsPaymentAgent
        ).toHaveBeenCalledTimes(1);
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
        general_store.root_store.modules.cashier.payment_agent.filterPaymentAgentList.mockResolvedValueOnce([]);
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

    it('should route to deposit page and call proper methods if is_crypto_transactions_visible equal to false and location.pahname = /cashier/crypto-transactions when onMountCommon was called', async () => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        jest.spyOn(window, 'window', 'get').mockImplementation(() => ({
            location: {
                pathname: routes.cashier_crypto_transactions,
            },
        }));
        const { onMount, setIsCryptoTransactionsVisible } =
            general_store.root_store.modules.cashier.transaction_history;
        general_store.root_store.client.is_logged_in = true;
        await general_store.onMountCommon(false);

        expect(general_store.root_store.common.routeTo).toHaveBeenCalledWith(routes.cashier_deposit);
        expect(setIsCryptoTransactionsVisible).toHaveBeenCalledWith(true);
        expect(onMount).toHaveBeenCalledTimes(1);
        jest.restoreAllMocks();
    });

    it('should set cashier tab index', () => {
        general_store.setCashierTabIndex(1);

        expect(general_store.cashier_route_tab_index).toBe(1);
    });

    it('should set p2p visibility equal to true', () => {
        general_store.setIsP2pVisible(true);

        expect(general_store.is_p2p_visible).toBeTruthy();
    });

    it('should set p2p visibility equal to false and route to /cashier/deposit if current location.pathname = /cashier/p2p and account_prompt_dialog.last_location is equal to null', () => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        jest.spyOn(window, 'window', 'get').mockImplementation(() => ({
            location: {
                pathname: routes.cashier_p2p,
                hostname: 'localhost.binary.sx',
            },
        }));
        general_store.setIsP2pVisible(false);

        expect(general_store.is_p2p_visible).toBeFalsy();
        expect(general_store.root_store.common.routeTo).toHaveBeenCalledWith(routes.cashier_deposit);
    });

    it('should change the value of the variable is_loading', () => {
        general_store.setLoading(true);
        expect(general_store.is_loading).toBeTruthy();
    });

    it('should set active tab', () => {
        general_store.setActiveTab('deposit');
        expect(general_store.active_container).toBe('deposit');
    });

    // it('should perform proper accountSwitcherListener invocation', () => {
    //     const spyOnRemount = jest.spyOn(general_store, 'onRemount');
    //     general_store.accountSwitcherListener();

    //     const { iframe, payment_agent } = general_store.root_store.modules.cashier;

    //     expect(iframe.clearIframe).toHaveBeenCalledTimes(1);
    //     expect(general_store.payment_agent).toEqual(payment_agent);
    //     expect(general_store.is_populating_values).toBeFalsy();
    //     expect(spyOnRemount).toHaveBeenCalledTimes(1);
    // });
});
