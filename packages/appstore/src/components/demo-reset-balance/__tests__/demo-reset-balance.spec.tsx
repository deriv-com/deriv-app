import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { APIProvider, useRequest } from '@deriv/api';
import { StoreProvider, mockStore } from '@deriv/stores';
import DemoResetBalance from '../demo-reset-balance';

jest.mock('@deriv/api', () => ({
    ...jest.requireActual('@deriv/api'),
    useRequest: jest.fn(() => ({ mutate: jest.fn() })),
}));

const mockUseRequest = useRequest as jest.MockedFunction<typeof useRequest<'topup_virtual'>>;

describe('<DemoResetBalance />', () => {
    it('should render demo reset balance component correctly', () => {
        const mock = mockStore({});
        // @ts-expect-error need to come up with a way to mock the return type of useRequest
        mockUseRequest.mockReturnValue({});
        const setActiveTabIndex = jest.fn();

        render(<DemoResetBalance setActiveTabIndex={setActiveTabIndex} />, {
            wrapper: ({ children }) => (
                <StoreProvider store={mock}>
                    <APIProvider>{children}</APIProvider>
                </StoreProvider>
            ),
        });

        expect(screen.getByText('Reset balance to 10,000.00 USD')).toBeInTheDocument();
        expect(
            screen.getByText('Reset your virtual balance if it falls below 10,000.00 USD or exceeds 10,000.00 USD.')
        ).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Reset balance' })).toBeInTheDocument();
    });

    it('should disable reset balance button if the balance is equal to 10000 usd', () => {
        const mock = mockStore({
            client: {
                accounts: {
                    VRW1002: {
                        balance: 10000,
                    },
                },
                loginid: 'VRW1002',
            },
        });
        // @ts-expect-error need to come up with a way to mock the return type of useRequest
        mockUseRequest.mockReturnValue({});
        const setActiveTabIndex = jest.fn();

        render(<DemoResetBalance setActiveTabIndex={setActiveTabIndex} />, {
            wrapper: ({ children }) => (
                <StoreProvider store={mock}>
                    <APIProvider>{children}</APIProvider>
                </StoreProvider>
            ),
        });

        expect(screen.getByRole('button', { name: /Reset balance/i })).toBeDisabled();
    });

    it('should call reset balance API when click on Reset balance', () => {
        const mock = mockStore({
            client: {
                accounts: {
                    VRW1002: {
                        balance: 9880,
                    },
                },
                loginid: 'VRW1002',
            },
        });
        // @ts-expect-error need to come up with a way to mock the return type of useRequest
        mockUseRequest.mockReturnValue({
            mutate: jest.fn(),
        });
        const { mutate } = mockUseRequest('topup_virtual');
        const setActiveTabIndex = jest.fn();

        render(<DemoResetBalance setActiveTabIndex={setActiveTabIndex} />, {
            wrapper: ({ children }) => (
                <StoreProvider store={mock}>
                    <APIProvider>{children}</APIProvider>
                </StoreProvider>
            ),
        });

        const reset_balance_button = screen.getByRole('button', { name: /Reset balance/i });
        userEvent.click(reset_balance_button);
        expect(mutate).toBeCalledTimes(1);
    });

    it('should change tab when click on transfer funds button', () => {
        const mock = mockStore({});
        // @ts-expect-error need to come up with a way to mock the return type of useRequest
        mockUseRequest.mockReturnValue({
            isSuccess: true,
        });
        const setActiveTabIndex = jest.fn();

        render(<DemoResetBalance setActiveTabIndex={setActiveTabIndex} />, {
            wrapper: ({ children }) => (
                <StoreProvider store={mock}>
                    <APIProvider>{children}</APIProvider>
                </StoreProvider>
            ),
        });

        const transfer_funds_button = screen.getByRole('button', { name: /Transfer funds/i });

        userEvent.click(transfer_funds_button);
        expect(setActiveTabIndex).toBeCalledTimes(1);
    });

    it('should show success message and transfer funds button if reset balance is reset successfully', () => {
        const mock = mockStore({});
        // @ts-expect-error need to come up with a way to mock the return type of useRequest
        mockUseRequest.mockReturnValue({
            isSuccess: true,
        });
        const setActiveTabIndex = jest.fn();

        render(<DemoResetBalance setActiveTabIndex={setActiveTabIndex} />, {
            wrapper: ({ children }) => (
                <StoreProvider store={mock}>
                    <APIProvider>{children}</APIProvider>
                </StoreProvider>
            ),
        });

        expect(screen.getByText('Your balance has been reset to 10,000.00 USD.')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Transfer funds/i })).toBeInTheDocument();
    });
});
