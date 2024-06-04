import React from 'react';
import { useAuthorize, useCashierFiatAddress } from '@deriv/api-v2';
import { act, render, screen, waitFor } from '@testing-library/react';
import DepositFiat from '../DepositFiat';

jest.mock('@deriv/api-v2', () => ({
    useAuthorize: jest.fn(),
    useCashierFiatAddress: jest.fn(),
}));

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    Loader: jest.fn(() => <div>Loader</div>),
}));

describe('DepositFiat', () => {
    beforeEach(() => {
        (useAuthorize as jest.Mock).mockReturnValueOnce({ isSuccess: true });
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should render error screen if isError and depositError is a server error', () => {
        const serverError = { code: '500', message: 'Server Error' };

        (useCashierFiatAddress as jest.Mock).mockReturnValueOnce({
            data: null,
            error: { error: serverError },
            isError: true,
            isLoading: false,
            mutate: jest.fn(),
        });

        render(<DepositFiat />);
        expect(screen.getByText('Server Error')).toBeInTheDocument();
    });

    it('should render loader while loading', () => {
        (useAuthorize as jest.Mock).mockReturnValueOnce({ isSuccess: false });
        (useCashierFiatAddress as jest.Mock).mockReturnValueOnce({
            data: null,
            error: null,
            isError: false,
            isLoading: true,
            mutate: jest.fn(),
        });

        render(<DepositFiat />);
        expect(screen.getByText('Loader')).toBeInTheDocument();
        expect(screen.queryByTestId('dt_deposit-fiat-iframe')).not.toBeInTheDocument();
    });

    it('should render iframe after loading is completed and iframe url is received', async () => {
        (useCashierFiatAddress as jest.Mock).mockReturnValueOnce({
            data: 'https://iframe_url',
            error: null,
            isError: false,
            isLoading: false,
            mutate: jest.fn(),
        });

        await act(async () => {
            render(<DepositFiat />);
            await waitFor(() => {
                expect(screen.queryByTestId('Loader')).not.toBeInTheDocument();
            });
            const iframe = screen.getByTestId('dt_deposit-fiat-iframe');
            expect(iframe).toHaveAttribute('src', 'https://iframe_url');
        });
    });
});
