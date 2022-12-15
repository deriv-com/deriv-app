import React from 'react';
import ReactDOM from 'react-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import PaymentAgentWithdrawConfirm from '../payment-agent-withdraw-confirm';
import { StoreProvider } from '@deriv/stores';

const mockRootStore = {
    ui: {
        disableApp: jest.fn(),
        enableApp: jest.fn(),
    },
};

jest.mock('Stores/connect', () => ({
    __esModule: true,
    default: 'mockedDefaultExport',
    connect: () => Component => Component,
}));

describe('<PaymentAgentWithdrawConfirm />', () => {
    beforeAll(() => {
        ReactDOM.createPortal = jest.fn(component => {
            return component;
        });
    });

    afterAll(() => {
        ReactDOM.createPortal.mockClear();
    });

    const props = {
        amount: 20,
        currency: 'USD',
        client_loginid: 'CR90000100',
        error: {},
        loginid: 'CR90000999',
        payment_agent_name: 'Alicharger',
        requestPaymentAgentWithdraw: jest.fn(),
        setIsTryWithdrawSuccessful: jest.fn(),
        verification_code: 'ABCdef',
    };

    it('should show proper messages and buttons', () => {
        render(<PaymentAgentWithdrawConfirm {...props} />, {
            wrapper: ({ children }) => <StoreProvider store={mockRootStore}>{children}</StoreProvider>,
        });

        const [back_btn, transfer_now_btn] = screen.getAllByRole('button');

        expect(screen.getByTestId('dt_red_warning_icon')).toBeInTheDocument();
        expect(screen.getByText('Funds transfer information')).toBeInTheDocument();
        expect(screen.getByText('From account number')).toBeInTheDocument();
        expect(screen.getByText('CR90000100')).toBeInTheDocument();
        expect(screen.getByText('To account number')).toBeInTheDocument();
        expect(screen.getByText('CR90000999')).toBeInTheDocument();
        expect(screen.getByText('Alicharger')).toBeInTheDocument();
        expect(screen.getByText('Amount')).toBeInTheDocument();
        expect(screen.getByText('20.00 USD')).toBeInTheDocument();
        expect(screen.getByRole('checkbox')).toBeInTheDocument();
        expect(back_btn).toBeInTheDocument();
        expect(transfer_now_btn).toBeInTheDocument();
    });

    it('should show error messages and button', () => {
        render(
            <PaymentAgentWithdrawConfirm
                {...props}
                error={{
                    code: 'code',
                    message: 'error_message',
                }}
            />,
            {
                wrapper: ({ children }) => <StoreProvider store={mockRootStore}>{children}</StoreProvider>,
            }
        );

        expect(screen.getByText('Cashier Error')).toBeInTheDocument();
        expect(screen.getByText('error_message')).toBeInTheDocument();
        expect(screen.getAllByRole('button')[2]).toBeInTheDocument();
    });

    it('should trigger setIsTryWithdrawSuccessful method when the client clicks on Back button', () => {
        render(<PaymentAgentWithdrawConfirm {...props} />, {
            wrapper: ({ children }) => <StoreProvider store={mockRootStore}>{children}</StoreProvider>,
        });

        const [back_btn, _] = screen.getAllByRole('button');
        fireEvent.click(back_btn);

        expect(props.setIsTryWithdrawSuccessful).toHaveBeenCalledWith(false);
    });

    it('should enable Transfer now button when checkbox is checked', () => {
        render(<PaymentAgentWithdrawConfirm {...props} />, {
            wrapper: ({ children }) => <StoreProvider store={mockRootStore}>{children}</StoreProvider>,
        });

        const el_checkbox = screen.getByRole('checkbox');
        const [_, transfer_now_btn] = screen.getAllByRole('button');
        fireEvent.click(el_checkbox);

        expect(transfer_now_btn).toBeEnabled();
    });

    it('should trigger requestPaymentAgentWithdraw method when the client clicks on Transfer now button', () => {
        render(<PaymentAgentWithdrawConfirm {...props} />, {
            wrapper: ({ children }) => <StoreProvider store={mockRootStore}>{children}</StoreProvider>,
        });

        const el_checkbox = screen.getByRole('checkbox');
        const [_, transfer_now_btn] = screen.getAllByRole('button');
        fireEvent.click(el_checkbox);
        fireEvent.click(transfer_now_btn);

        expect(props.requestPaymentAgentWithdraw).toHaveBeenCalledWith({
            loginid: props.loginid,
            currency: props.currency,
            amount: props.amount,
            verification_code: props.verification_code,
        });
    });
});
