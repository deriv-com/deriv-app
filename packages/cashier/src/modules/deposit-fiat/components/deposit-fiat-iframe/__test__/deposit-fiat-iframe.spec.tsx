import React from 'react';
import { render, screen } from '@testing-library/react';
import { mockStore } from '@deriv/stores';
import { useDepositFiatAddress } from '@deriv/hooks';
import CashierProviders from '../../../../../cashier-providers';
import DepositFiatIframe from '../deposit-fiat-iframe';

jest.mock('@deriv/hooks', () => ({
    ...jest.requireActual('@deriv/hooks'),
    useDepositFiatAddress: jest.fn(),
}));

const mockedUseDepositFiatAddress = useDepositFiatAddress as jest.MockedFunction<typeof useDepositFiatAddress>;

describe('<DepositFiatIframe />', () => {
    it('should render the loader when waiting for the response from the cashier API', () => {
        // @ts-expect-error need to come up with a way to mock the return type of useFetch
        mockedUseDepositFiatAddress.mockReturnValue({
            data: undefined,
            isLoading: false,
            isSuccess: true,
            error: undefined,
            resend: jest.fn(),
        });

        const mock = mockStore({});

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <CashierProviders store={mock}>{children}</CashierProviders>
        );
        render(<DepositFiatIframe />, { wrapper });

        expect(screen.getByTestId('dt_initial_loader')).toBeInTheDocument();
    });

    it('should render the iframe once the url is received from API', () => {
        // @ts-expect-error need to come up with a way to mock the return type of useFetch
        mockedUseDepositFiatAddress.mockReturnValue({
            data: 'https://example.com',
            isLoading: false,
            isSuccess: true,
            error: undefined,
            resend: jest.fn(),
        });

        const mock = mockStore({});

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <CashierProviders store={mock}>{children}</CashierProviders>
        );
        render(<DepositFiatIframe />, { wrapper });

        expect(screen.getByTestId('dt_deposit_fiat_iframe_iframe')).toBeInTheDocument();
    });
});
