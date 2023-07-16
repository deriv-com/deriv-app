import DepositStore from '../deposit-store';
import { configure } from 'mobx';
import { TRootStore, TWebSocket } from '../../types';
import { mockStore } from '@deriv/stores';

configure({ safeDescriptors: false });

describe('DepositStore', () => {
    let deposit_store: DepositStore;

    beforeEach(() => {
        const root_store = mockStore({
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
        });
        const WS: DeepPartial<TWebSocket> = {
            authorized: {
                cashier: jest.fn(() => Promise.resolve({ cashier: 'https://cashier.deriv.com' })),
            },
            send: jest.fn(() => Promise.resolve({})),
        };

        deposit_store = new DepositStore(WS as TWebSocket, root_store as TRootStore);
    });

    it('should handle the error on deposit', async () => {
        const error_message = 'Sorry, an error occured.';
        const spyHandleCashierError = jest.spyOn(deposit_store.error, 'handleCashierError');

        (deposit_store.WS.authorized.cashier as jest.Mock).mockResolvedValueOnce({ error: { message: error_message } });

        await deposit_store.onMountDeposit();
        expect(spyHandleCashierError).toHaveBeenCalledWith({ message: error_message });
    });

    it('should not load the iframe if client is on virtual account', async () => {
        const { setLoading } = deposit_store.root_store.modules.cashier.general_store;

        deposit_store.root_store.client.is_virtual = true;

        await deposit_store.onMountDeposit();
        expect(setLoading).toHaveBeenCalledWith(false);
    });
    it('should call cashier deposit if the active_container is deposit and not on crypto', async () => {
        await deposit_store.onMountDeposit();
        expect(deposit_store.WS.authorized.cashier).toHaveBeenCalled();
    });
    it('should not call cashier deposit if the active_container is not deposit and on crypto', async () => {
        deposit_store.root_store.modules.cashier.general_store.active_container = 'withdraw';

        await deposit_store.onMountDeposit();
        expect(deposit_store.WS.authorized.cashier).not.toHaveBeenCalled();
    });
});
