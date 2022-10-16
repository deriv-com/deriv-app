import PaymentAgentTransferStore from '../payment-agent-transfer-store';
import { routes } from '@deriv/shared';

let payment_agent_transfer_store, response_payment_agent, root_store, transfer_data, WS;

beforeEach(() => {
    WS = {
        authorized: {
            storage: {
                getSettings: jest.fn(),
            },
            paymentAgentTransfer: jest.fn(),
        },
    };
    root_store = {
        common: {
            routeTo: jest.fn(),
        },
        client: {
            loginid: '',
        },
        modules: {
            cashier: {
                payment_agent: {
                    getPaymentAgentDetails: jest.fn(),
                    getPaymentAgentList: jest.fn().mockResolvedValue({
                        paymentagent_list: {
                            list: [{ paymentagent_loginid: 'CR9999999', min_withdrawal: 1, max_withdrawal: 10 }],
                        },
                    }),
                },
                general_store: {
                    setLoading: jest.fn(),
                    onMountCommon: jest.fn(),
                },
            },
        },
    };
    payment_agent_transfer_store = new PaymentAgentTransferStore({ WS, root_store });
    response_payment_agent = {
        paymentagent_list: {
            list: [{ paymentagent_loginid: 'CR9000000' }],
        },
    };
    transfer_data = {
        amount: 100,
        currency: 'USD',
        description: 'This is description',
        transfer_to: 'CR9000000',
    };
});

describe('PaymentAgentTransferStore', () => {
    it('should return correct value', () => {
        expect(payment_agent_transfer_store.is_payment_agent_transfer_visible).toBeFalsy();
    });

    it('should check and set is_payment_agent as true value', async () => {
        WS.authorized.storage.getSettings.mockResolvedValue({
            get_settings: { is_authenticated_payment_agent: true },
        });
        await payment_agent_transfer_store.checkIsPaymentAgent();

        expect(payment_agent_transfer_store.is_payment_agent).toBeTruthy();
    });

    it('should check and set is_payment_agent as false value', async () => {
        WS.authorized.storage.getSettings.mockResolvedValue({
            get_settings: { is_authenticated_payment_agent: null },
        });
        await payment_agent_transfer_store.checkIsPaymentAgent();

        expect(payment_agent_transfer_store.is_payment_agent).toBeFalsy();
    });

    it('should set correct is_payment_agent value', () => {
        payment_agent_transfer_store.setIsPaymentAgent(true);

        expect(payment_agent_transfer_store.is_payment_agent).toBeTruthy();
    });

    it('should route to /cashier/deposit if there is no payment agent and window.location.pathname ends with /cashier/payment-agent-transfer', () => {
        const windowSpy = jest.spyOn(window, 'window', 'get');
        windowSpy.mockImplementation(() => ({
            location: {
                pathname: routes.cashier_pa_transfer,
            },
        }));

        payment_agent_transfer_store.setIsPaymentAgent(false);

        expect(payment_agent_transfer_store.root_store.common.routeTo).toHaveBeenCalledWith(routes.cashier_deposit);

        windowSpy.mockRestore();
    });

    it('shoud clear an error and set correct is_try_transfer_successful value', () => {
        const spySetErrorMessage = jest.spyOn(payment_agent_transfer_store.error, 'setErrorMessage');

        payment_agent_transfer_store.setIsTryTransferSuccessful(true);

        expect(spySetErrorMessage).toHaveBeenCalledWith('');
        expect(payment_agent_transfer_store.is_try_transfer_successful).toBeTruthy();
    });

    it('shoud set correct is_transfer_successful value', () => {
        payment_agent_transfer_store.setIsTransferSuccessful(true);

        expect(payment_agent_transfer_store.is_transfer_successful).toBeTruthy();
    });

    it('shoud set correct confirmation transfer value', () => {
        const confirm = {
            amount: 100,
            client_id: 'CR9000000',
            client_name: 'George',
            description: 'This is description',
        };

        payment_agent_transfer_store.setConfirmationPaymentAgentTransfer(confirm);

        expect(payment_agent_transfer_store.confirm).toEqual(confirm);
    });

    it('shoud set correct receipt value', () => {
        const receipt = {
            amount_transferred: 100,
            client_id: 'CR9000000',
            client_name: 'George',
        };

        payment_agent_transfer_store.setReceiptPaymentAgentTransfer(receipt);

        expect(payment_agent_transfer_store.receipt).toEqual(receipt);
    });

    it('shoud set correct transfer_limit value', () => {
        const transfer_limit = {
            min_withdrawal: 1,
            max_withdrawal: 10,
        };

        payment_agent_transfer_store.setMinMaxPaymentAgentTransfer(transfer_limit);

        expect(payment_agent_transfer_store.transfer_limit).toEqual({
            min: transfer_limit.min_withdrawal,
            max: transfer_limit.max_withdrawal,
        });
    });

    it('shoud reset payment agent transfer', () => {
        const spySetErrorMessage = jest.spyOn(payment_agent_transfer_store.error, 'setErrorMessage');
        payment_agent_transfer_store.resetPaymentAgentTransfer();

        expect(payment_agent_transfer_store.is_transfer_successful).toBeFalsy();
        expect(spySetErrorMessage).toHaveBeenCalledWith('');
    });

    it('should get current payment agent from response_payment_agent', async () => {
        payment_agent_transfer_store.root_store.client.loginid = 'CR9000000';

        expect(await payment_agent_transfer_store.getCurrentPaymentAgent(response_payment_agent)).toEqual({
            paymentagent_loginid: 'CR9000000',
        });
    });

    it('should get current payment agent from cashier.payment_agent.getPaymentAgentDetails()', async () => {
        payment_agent_transfer_store.root_store.modules.cashier.payment_agent.getPaymentAgentDetails.mockResolvedValue({
            paymentagent_loginid: 'CR9999999',
        });

        expect(await payment_agent_transfer_store.getCurrentPaymentAgent(response_payment_agent)).toEqual({
            paymentagent_loginid: 'CR9999999',
        });
    });

    it('should return an empty object if there are no payment agents', async () => {
        expect(await payment_agent_transfer_store.getCurrentPaymentAgent(response_payment_agent)).toEqual({});
    });

    it('should mount payment agent transfer', async () => {
        await payment_agent_transfer_store.onMountPaymentAgentTransfer();

        expect(payment_agent_transfer_store.root_store.modules.cashier.general_store.setLoading.mock.calls).toEqual([
            [true],
            [false],
        ]);
        expect(
            payment_agent_transfer_store.root_store.modules.cashier.general_store.onMountCommon
        ).toHaveBeenCalledTimes(1);
    });

    it('should set transfer_limits on mounting if there is no transfer_limit.min_withdrawal value', async () => {
        payment_agent_transfer_store.root_store.client.loginid = 'CR9999999';

        await payment_agent_transfer_store.onMountPaymentAgentTransfer();

        expect(payment_agent_transfer_store.transfer_limit).toEqual({
            min: 1,
            max: 10,
        });
    });

    it('shoud set correct confirmation transfer value if there is no any errors in response (dry_run = 1)', async () => {
        payment_agent_transfer_store.WS.authorized.paymentAgentTransfer.mockResolvedValue({
            paymentagent_transfer: 2,
            client_to_full_name: 'George',
        });
        await payment_agent_transfer_store.requestTryPaymentAgentTransfer(transfer_data);

        expect(payment_agent_transfer_store.confirm).toEqual({
            client_id: transfer_data.transfer_to,
            client_name: 'George',
            amount: transfer_data.amount,
            description: transfer_data.description,
        });

        expect(payment_agent_transfer_store.is_try_transfer_successful).toBeTruthy();
    });

    it('shoud trigger setErrorMessage callback if there is an error in response (paymentagent_transfer = 0), requestTryPaymentAgentTransfer', async () => {
        const spySetErrorMessage = jest.spyOn(payment_agent_transfer_store.error, 'setErrorMessage');
        payment_agent_transfer_store.WS.authorized.paymentAgentTransfer.mockResolvedValue({
            paymentagent_transfer: 0,
            error: {
                message: 'Error message!',
            },
        });

        await payment_agent_transfer_store.requestTryPaymentAgentTransfer(transfer_data);

        expect(spySetErrorMessage).toHaveBeenCalledWith(
            { message: 'Error message!' },
            payment_agent_transfer_store.resetPaymentAgentTransfer
        );
    });

    it('shoud set correct confirmation transfer value if there is no any errors in response (dry_run = 0)', async () => {
        payment_agent_transfer_store.WS.authorized.paymentAgentTransfer.mockResolvedValue({
            paymentagent_transfer: 1,
            client_to_full_name: 'George',
        });

        await payment_agent_transfer_store.requestPaymentAgentTransfer(transfer_data);

        expect(payment_agent_transfer_store.receipt).toEqual({
            amount_transferred: transfer_data.amount,
            client_id: transfer_data.transfer_to,
            client_name: 'George',
        });
        expect(payment_agent_transfer_store.is_transfer_successful).toBeTruthy();
        expect(payment_agent_transfer_store.is_try_transfer_successful).toBeFalsy();
        expect(payment_agent_transfer_store.confirm).toEqual({});
    });

    it('shoud trigger setErrorMessage callback if there is an error in response (paymentagent_transfer = 0), requestPaymentAgentTransfer', async () => {
        const spySetErrorMessage = jest.spyOn(payment_agent_transfer_store.error, 'setErrorMessage');
        payment_agent_transfer_store.WS.authorized.paymentAgentTransfer.mockResolvedValue({
            paymentagent_transfer: 0,
            error: {
                message: 'Error message!',
            },
        });

        await payment_agent_transfer_store.requestPaymentAgentTransfer(transfer_data);

        expect(spySetErrorMessage).toHaveBeenCalledWith(
            { message: 'Error message!' },
            payment_agent_transfer_store.resetPaymentAgentTransfer
        );
    });
});
