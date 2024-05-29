import React from 'react';
import { createBrowserHistory, History } from 'history';
import { useDevice } from '@deriv-com/ui';
import { Router } from 'react-router';
import { useActiveAccount } from '@deriv/api-v2';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FiatOnRamp from '../FiatOnRamp';

const mockedUseDevice = useDevice as jest.MockedFunction<typeof useDevice>;

jest.mock('@deriv/api-v2', () => ({
    useActiveAccount: jest.fn(),
}));

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn(() => false),
}));

jest.mock('../../../lib', () => ({
    FiatOnRampModule: jest.fn(() => <div>FiatOnRampModule</div>),
}));

jest.mock('../../../components', () => ({
    PageContainer: jest.fn(({ children }) => <div>{children}</div>),
}));

const mockUseActiveAccount = useActiveAccount as jest.MockedFunction<typeof useActiveAccount>;

describe('FiatOnRamp', () => {
    let history: History;
    let mockedProps: React.ComponentProps<typeof FiatOnRamp>;

    beforeEach(() => {
        history = createBrowserHistory();
        mockedProps = {
            path: '/cashier-v2/onramp',
            routes: [
                { path: '/cashier-v2/deposit', title: 'Deposit', component: () => <>Deposit</> },
                { path: '/cashier-v2/withdrawal', title: 'Withdrawal', component: () => <>Withdrawal</> },
                { path: '/cashier-v2/transfer', title: 'Transfer', component: () => <>Transfer</> },
                { path: '/cashier-v2/onramp', title: 'Fiat onramp', component: () => <>Fiat onramp</> },
            ],
            title: 'Fiat onramp',
        };
    });

    const wrapper = ({ children }: { children: React.ReactNode }) => {
        return <Router history={history}>{children}</Router>;
    };

    it('component should render FiatOnRamp when user active account is crypto', () => {
        mockUseActiveAccount.mockReturnValue({
            data: {
                //@ts-expect-error since this is a mock, we only need partial properties of data
                currency_config: {
                    is_crypto: true,
                },
            },
        });

        render(<FiatOnRamp {...mockedProps} />, { wrapper });

        expect(screen.getByText('FiatOnRampModule')).toBeInTheDocument();
    });

    it('should redirect to /cashier-v2/deposit when isCrypto is false', () => {
        mockUseActiveAccount.mockReturnValue({
            data: {
                //@ts-expect-error since this is a mock, we only need partial properties of data
                currency_config: {
                    is_crypto: false,
                },
            },
        });

        render(<FiatOnRamp {...mockedProps} />, { wrapper });

        expect(history.location.pathname).toBe('/cashier-v2/deposit');
    });

    it('should redirect to selected route', () => {
        //@ts-expect-error since this is a mock, we only need partial properties of data
        mockedUseDevice.mockReturnValueOnce({ isMobile: true });
        render(<FiatOnRamp {...mockedProps} />, { wrapper });

        const routesDropdown = screen.getByRole('combobox');
        userEvent.click(routesDropdown);
        const transferRouteOption = screen.getByText('Transfer');
        userEvent.click(transferRouteOption);

        expect(history.location.pathname).toBe('/cashier-v2/transfer');
    });
});
