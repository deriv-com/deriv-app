import DepositStore from '../deposit-store';
import { configure } from 'mobx';

configure({ safeDescriptors: false });

describe('DepositStore', () => {
    let deposit_store;

    beforeEach(() => {
        const root_store = {
            client: {
                is_authentication_needed: false,
                is_tnc_needed: false,
                is_financial_account: false,
                is_financial_information_incomplete: false,
                is_trading_experience_incomplete: false,
                account_status: {},
                is_eu: false,
                mt5_login_list: [],
                is_deposit_lock: false,
                is_virtual: false,
                updateAccountStatus: jest.fn(),
            },
            modules: {
                cashier: {
                    general_store: {
                        active_container: 'deposit',
                        is_crypto: false,
                        onMountCommon: jest.fn(),
                        setLoading: jest.fn(),
                        setOnRemount: jest.fn(),
                    },
                    iframe: {
                        checkIframeLoaded: jest.fn(),
                        clearTimeoutCashierUrl: jest.fn(),
                        is_session_timeout: false,
                        setContainerHeight: jest.fn(),
                        setIframeUrl: jest.fn(),
                        setSessionTimeout: jest.fn(),
                        setTimeoutCashierUrl: jest.fn(),
                    },
                },
            },
        };
        const WS = {
            authorized: {
                cashier: jest.fn(() => Promise.resolve({ cashier: 'https://cashier.deriv.com' })),
            },
            send: jest.fn(() => Promise.resolve({})),
        };

        deposit_store = new DepositStore(WS, root_store);
    });

    it('should mount deposit properly', async () => {
        const { checkIframeLoaded, setIframeUrl, setSessionTimeout, setTimeoutCashierUrl } =
            deposit_store.root_store.modules.cashier.iframe;
        const { updateAccountStatus } = deposit_store.root_store.client;

        await deposit_store.onMountDeposit();
        expect(checkIframeLoaded).toHaveBeenCalled();

        deposit_store.root_store.modules.cashier.iframe.is_session_timeout = true;

        await deposit_store.onMountDeposit();
        expect(checkIframeLoaded).toHaveBeenCalled();
        expect(setIframeUrl).toHaveBeenCalledWith('https://cashier.deriv.com');
        expect(setSessionTimeout).toHaveBeenCalledWith(false);
        expect(setTimeoutCashierUrl).toHaveBeenCalled();
        expect(updateAccountStatus).toHaveBeenCalled();
    });

    it('should handle the error on deposit', async () => {
        const { setSessionTimeout, clearTimeoutCashierUrl } = deposit_store.root_store.modules.cashier.iframe;
        const error_message = 'Sorry, an error occured.';
        const spyHandleCashierError = jest.spyOn(deposit_store.error, 'handleCashierError');

        deposit_store.root_store.modules.cashier.iframe.is_session_timeout = true;
        deposit_store.WS.authorized.cashier.mockResolvedValueOnce({ error: { message: error_message } });

        await deposit_store.onMountDeposit();
        expect(spyHandleCashierError).toHaveBeenCalledWith({ message: error_message });
        expect(setSessionTimeout).toHaveBeenCalledWith(true);
        expect(clearTimeoutCashierUrl).toHaveBeenCalled();
    });

    it('should not load the iframe if client is on virtual account', async () => {
        const { setLoading } = deposit_store.root_store.modules.cashier.general_store;
        const { checkIframeLoaded } = deposit_store.root_store.modules.cashier.iframe;

        deposit_store.root_store.modules.cashier.iframe.is_session_timeout = true;
        deposit_store.root_store.client.is_virtual = true;

        await deposit_store.onMountDeposit();
        expect(checkIframeLoaded).not.toHaveBeenCalled();
        expect(setLoading).toHaveBeenCalledWith(false);
    });

    it('should return is_deposit_locked equal to true if the client needs authentication', () => {
        expect(deposit_store.is_deposit_locked).toBeFalsy();

        deposit_store.root_store.client.account_status.status = ['authentication_needed'];
        deposit_store.root_store.client.is_authentication_needed = true;
        deposit_store.root_store.client.is_eu = true;
        expect(deposit_store.is_deposit_locked).toBeTruthy();
    });

    it('should return is_deposit_locked equal to true if the client needs financial assessment', () => {
        deposit_store.root_store.client.account_status.status = [
            'financial_information_not_complete',
            'trading_experience_not_complete',
        ];
        deposit_store.root_store.client.is_financial_account = true;
        deposit_store.root_store.client.is_financial_information_incomplete = true;
        expect(deposit_store.is_deposit_locked).toBeTruthy();

        deposit_store.root_store.client.is_financial_information_incomplete = false;
        deposit_store.root_store.client.is_trading_experience_incomplete = true;
        expect(deposit_store.is_deposit_locked).toBeTruthy();
    });

    it('should return is_deposit_locked equal to true if the client needs terms and conditions', () => {
        deposit_store.root_store.client.account_status.status = ['cashier_locked'];
        deposit_store.root_store.client.is_eu = true;
        deposit_store.root_store.client.is_tnc_needed = true;
        expect(deposit_store.is_deposit_locked).toBeTruthy();

        deposit_store.root_store.client.is_eu = false;
        deposit_store.root_store.client.mt5_login_list = [{ account_type: 'real', sub_account_type: 'financial_stp' }];
        expect(deposit_store.is_deposit_locked).toBeTruthy();
    });

    it('should return is_deposit_locked equal to true if the client needs financial risk approval', () => {
        deposit_store.root_store.client.account_status.status = ['financial_assessment_not_complete'];
        deposit_store.error.is_ask_financial_risk_approval = true;
        expect(deposit_store.is_deposit_locked).toBeTruthy();
    });

    it('should submit funds protection', async () => {
        Object.defineProperty(window, 'location', {
            configurable: true,
            value: { reload: jest.fn() },
        });

        await deposit_store.submitFundsProtection();
        expect(location.reload).toHaveBeenCalled();

        window.location.reload.mockRestore();
    });

    it('should handle the error upon submitting funds protection', async () => {
        const spySetMessage = jest.spyOn(deposit_store.error, 'setMessage');
        const error_message = 'Sorry, an error occurred.';

        deposit_store.WS.send.mockResolvedValueOnce({ error: { message: error_message } });

        await deposit_store.submitFundsProtection();
        expect(spySetMessage).toHaveBeenCalledWith(error_message);
    });
});
