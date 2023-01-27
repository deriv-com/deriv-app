import React from 'react';
import ReactDOM from 'react-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import PaymentAgentTransferConfirm from '../payment-agent-transfer-confirm.jsx';
import CashierProviders from '../../../../cashier-providers';

describe('<PaymentAgentTransferConfirm />', () => {
    let mockRootStore;

    beforeAll(() => {
        ReactDOM.createPortal = jest.fn(component => {
            return component;
        });
    });

    afterAll(() => {
        ReactDOM.createPortal.mockClear();
    });

    beforeEach(() => {
        mockRootStore = {
            ui: {
                disableApp: jest.fn(),
                enableApp: jest.fn(),
            },
            client: {
                loginid: 'CR900000100',
                currency: 'USD',
            },
            modules: {
                cashier: {
                    payment_agent_transfer: {
                        confirm: {
                            amount: 100,
                            description: 'description',
                            client_id: 'CR900000101',
                            client_name: 'George',
                        },
                        error: {},
                        requestPaymentAgentTransfer: jest.fn(),
                        setIsTryTransferSuccessful: jest.fn(),
                    },
                },
            },
        };
    });

    const renderPaymentAgentTransferConfirm = () => {
        return render(
            <CashierProviders store={mockRootStore}>
                <PaymentAgentTransferConfirm />
            </CashierProviders>
        );
    };

    it('should show proper icon and message', () => {
        renderPaymentAgentTransferConfirm();

        expect(screen.getByTestId('dt_red_warning_icon')).toBeInTheDocument();
        expect(screen.getByText('Check transfer information')).toBeInTheDocument();
    });

    it(`setIsTryTransferSuccessful method should be triggered when click on 'Back' button`, () => {
        renderPaymentAgentTransferConfirm();

        const el_back_btn = screen.getByRole('button', { name: 'Back' });
        fireEvent.click(el_back_btn);

        expect(mockRootStore.modules.cashier.payment_agent_transfer.setIsTryTransferSuccessful).toHaveBeenCalledWith(
            false
        );
    });

    it(`requestPaymentAgentTransfer fuction should be triggered if checkbox is enabled and the "Transfer now" button is clicked`, () => {
        renderPaymentAgentTransferConfirm();

        const el_checkbox_transfer_consent = screen.getByRole('checkbox');
        fireEvent.click(el_checkbox_transfer_consent);
        const el_btn_transfer_now = screen.getByRole('button', { name: 'Transfer now' });
        fireEvent.click(el_btn_transfer_now);

        expect(mockRootStore.modules.cashier.payment_agent_transfer.requestPaymentAgentTransfer).toHaveBeenCalledWith({
            amount: 100,
            currency: 'USD',
            description: 'description',
            transfer_to: 'CR900000101',
        });
    });

    it(`should show error message`, () => {
        mockRootStore.modules.cashier.payment_agent_transfer.error = { code: 'error_code', message: 'error_message' };
        renderPaymentAgentTransferConfirm();

        expect(screen.getByText('error_message')).toBeInTheDocument();
    });
});
