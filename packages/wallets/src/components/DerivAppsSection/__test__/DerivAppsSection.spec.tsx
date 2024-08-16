import React, { PropsWithChildren } from 'react';
import { APIProvider, useActiveLinkedToTradingAccount } from '@deriv/api-v2';
import { render, screen } from '@testing-library/react';
import WalletsAuthProvider from '../../../AuthProvider';
import { ModalProvider } from '../../ModalProvider';
import DerivAppsSection from '../DerivAppsSection';

jest.mock('@deriv/api-v2', () => ({
    ...jest.requireActual('@deriv/api-v2'),
    useActiveLinkedToTradingAccount: jest.fn(() => ({
        data: {
            currency_config: { display_code: 'USD' },
            isLoading: false,
            loginid: 'CRW1',
        },
    })),
    useActiveWalletAccount: jest.fn(() => ({
        data: { currency_config: { display_code: 'USD' }, is_virtual: false, loginid: 'CRW1' },
    })),
}));

jest.mock('../../../hooks/useAllBalanceSubscription', () =>
    jest.fn(() => ({
        data: {
            CRW1: {
                balance: 100,
                currency: 'USD',
            },
        },
        isLoading: false,
    }))
);

const mockUseActiveLinkedToTradingAccount = useActiveLinkedToTradingAccount as jest.MockedFunction<
    typeof useActiveLinkedToTradingAccount
>;

const wrapper = ({ children }: PropsWithChildren) => {
    return (
        <APIProvider>
            <WalletsAuthProvider>
                <ModalProvider>{children}</ModalProvider>
            </WalletsAuthProvider>
        </APIProvider>
    );
};

describe('DerivAppsSection', () => {
    it('renders the component when no activeLinkedToTradingAccount is exists', () => {
        (mockUseActiveLinkedToTradingAccount as jest.Mock).mockReturnValueOnce({ isLoading: false });
        render(<DerivAppsSection />, { wrapper });
        expect(screen.getByRole('button', { name: 'Get' })).toBeInTheDocument();
    });
    it('renders the component when an activeLinkedToTradingAccount exists', () => {
        render(<DerivAppsSection />, { wrapper });
        expect(screen.getByText('100.00 USD')).toBeInTheDocument();
    });
});
