import React from 'react';
import { useCtraderAccountsList } from '@deriv/api-v2';
import { useDevice } from '@deriv-com/ui';
import { render, screen } from '@testing-library/react';
import { ModalProvider, useModal } from '../../../../../components/ModalProvider';
import CTraderSuccessModal from '../CTraderSuccessModal';
import '@testing-library/jest-dom';

jest.mock('@deriv/api-v2', () => ({
    useCtraderAccountsList: jest.fn(),
}));

jest.mock('@deriv-com/ui', () => ({
    Loader: () => <div>Loading...</div>,
    useDevice: jest.fn(),
}));

jest.mock('../../../../../components/ModalProvider', () => ({
    ...jest.requireActual('../../../../../components/ModalProvider'),
    useModal: jest.fn(),
}));

jest.mock('../../../screens', () => ({
    CFDSuccess: ({ actionButtons, title }: { actionButtons: React.ReactNode; title: string }) => (
        <div data-testid='cfd-success'>
            {title}
            {actionButtons}
        </div>
    ),
}));

jest.mock('../../../../../components', () => ({
    ModalStepWrapper: ({
        children,
        renderFooter,
    }: {
        children: React.ReactNode;
        renderFooter?: () => React.ReactNode;
    }) => (
        <div>
            {children}
            {renderFooter && <div>{renderFooter()}</div>}
        </div>
    ),
    ModalWrapper: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

jest.mock('../components', () => ({
    CTraderSuccessModalButtons: () => <div>CTraderSuccessModalButtons</div>,
}));

describe('CTraderSuccessModal', () => {
    const mockHide = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        (useModal as jest.Mock).mockReturnValue({ hide: mockHide });
    });

    it('renders loader when data is loading', () => {
        (useCtraderAccountsList as jest.Mock).mockReturnValue({ data: null, isLoading: true });
        (useDevice as jest.Mock).mockReturnValue({ isDesktop: true });

        render(<CTraderSuccessModal walletCurrencyType='USD' />);
        expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    it('renders desktop layout correctly', () => {
        (useCtraderAccountsList as jest.Mock).mockReturnValue({
            data: [{ display_balance: '1000 USD', login: '12345' }],
            isLoading: false,
        });
        (useDevice as jest.Mock).mockReturnValue({ isDesktop: true });

        render(<CTraderSuccessModal walletCurrencyType='USD' />);
        expect(screen.getByTestId('cfd-success')).toHaveTextContent('Your Deriv cTrader account is ready');
        expect(screen.getByText('CTraderSuccessModalButtons')).toBeInTheDocument();
    });

    it('renders mobile layout correctly', () => {
        (useCtraderAccountsList as jest.Mock).mockReturnValue({
            data: [{ display_balance: '1000 USD', login: '12345' }],
            isLoading: false,
        });
        (useDevice as jest.Mock).mockReturnValue({ isDesktop: false });

        render(
            <ModalProvider>
                <CTraderSuccessModal isDemo={false} walletCurrencyType='USD' />
            </ModalProvider>
        );
        expect(screen.getByTestId('cfd-success')).toHaveTextContent('Your Deriv cTrader account is ready');
        expect(screen.getAllByText('CTraderSuccessModalButtons')).toHaveLength(2);
    });

    it('renders correct content for demo account', () => {
        (useCtraderAccountsList as jest.Mock).mockReturnValue({
            data: [{ display_balance: '1000 USD', login: '12345' }],
            isLoading: false,
        });
        (useDevice as jest.Mock).mockReturnValue({ isDesktop: true });

        render(<CTraderSuccessModal isDemo walletCurrencyType='USD' />);
        expect(screen.getByTestId('cfd-success')).toHaveTextContent('Your Deriv cTrader demo account is ready');
        expect(screen.getByText('CTraderSuccessModalButtons')).toBeInTheDocument();
    });
});
