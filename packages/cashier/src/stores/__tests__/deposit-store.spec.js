import DepositStore from '../deposit-store';
import { configure } from 'mobx';

configure({ safeDescriptors: false });

describe('DepositStore', () => {
    let deposit_store;

    beforeEach(() => {
        const root_store = {
            client: {
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
});
