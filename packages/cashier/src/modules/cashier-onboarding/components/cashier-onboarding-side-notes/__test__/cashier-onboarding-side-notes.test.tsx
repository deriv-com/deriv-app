import React from 'react';
import { mockStore } from '@deriv/stores';
import { render, screen } from '@testing-library/react';
import CashierProviders from '../../../../../cashier-providers';
import CashierOnboardingSideNotes from '../cashier-onboarding-side-notes';
import { useDevice } from '@deriv-com/ui';

jest.mock('@deriv/api', () => ({
    ...jest.requireActual('@deriv/api'),
    useFetch: jest.fn(() => ({
        data: {
            website_status: {
                currencies_config: {
                    USD: { type: 'fiat', name: 'US Dollar' },
                    BTC: { type: 'crypto', name: 'Bitcoin' },
                },
            },
        },
    })),
}));

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn(() => ({ isMobile: false })),
}));

describe('CashierOnboardingSideNotes', () => {
    test('should render CashierOnboardingSideNoteFiat on mobile if is_crypto is false', () => {
        (useDevice as jest.Mock).mockReturnValueOnce({ isMobile: true });
        const mock = mockStore({
            client: { currency: 'USD' },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <CashierProviders store={mock}>{children}</CashierProviders>
        );
        render(<CashierOnboardingSideNotes />, { wrapper });

        expect(screen.getByText(/To change your account currency/i)).toBeInTheDocument();
    });

    test('should render CashierOnboardingSideNoteCrypto on mobile on mobile if is_crypto is true', async () => {
        (useDevice as jest.Mock).mockReturnValueOnce({ isMobile: true });
        const mock = mockStore({
            client: { currency: 'BTC' },
            modules: {
                cashier: {
                    general_store: {
                        setDepositTarget: jest.fn(),
                    },
                },
            },
        });

        const wrapper = ({ children }: { children: JSX.Element }) => (
            <CashierProviders store={mock}>{children}</CashierProviders>
        );
        render(<CashierOnboardingSideNotes />, { wrapper });

        expect(screen.getByText(/You can open another cryptocurrency account/i)).toBeInTheDocument();
    });
});
