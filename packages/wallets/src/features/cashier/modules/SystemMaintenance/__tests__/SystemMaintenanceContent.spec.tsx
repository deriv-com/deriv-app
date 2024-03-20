import { render, screen } from '@testing-library/react';
import getSystemMaintenanceContent from '../SystemMaintenanceContent';

window.LC_API = {
    on_chat_ended: jest.fn(),
    open_chat_window: jest.fn(),
};

describe('SystemMaintenanceContent', () => {
    it('should render title and description as undefined when cashier is not locked', () => {
        const result = getSystemMaintenanceContent({
            currency: 'USD',
            isCashierLocked: false,
            isCrypto: false,
            isDepositLocked: false,
            isWithdrawalLocked: false,
        });

        expect(result?.description).toBeUndefined();
        expect(result?.title).toBeUndefined();
    });

    it('should render correct message when cashier is locked', () => {
        const result = getSystemMaintenanceContent({
            currency: 'USD',
            isCashierLocked: true,
            isCrypto: false,
            isDepositLocked: false,
            isWithdrawalLocked: false,
        });

        if (result) render(result.description);
        expect(
            screen.getByText(
                'Due to system maintenance, deposits and withdrawals with your USD Wallet are unavailable at the moment. Please try again later.'
            )
        ).toBeInTheDocument();

        if (result) render(result.title);
        expect(
            screen.getByText('USD Wallet deposits and withdrawals are temporarily unavailable.')
        ).toBeInTheDocument();
    });

    it('should render correct message when deposit is locked for crypto account', () => {
        const result = getSystemMaintenanceContent({
            currency: 'BTC',
            isCashierLocked: false,
            isCrypto: true,
            isDepositLocked: true,
            isWithdrawalLocked: false,
        });

        if (result) render(result.description);
        expect(
            screen.getByText(
                'Due to system maintenance, deposits into your BTC Wallet are unavailable at the moment. Please try again later.'
            )
        ).toBeInTheDocument();

        if (result) render(result.title);
        expect(screen.getByText('BTC Wallet deposits are temporarily unavailable.')).toBeInTheDocument();
    });

    it('should render correct message when withdrawal is locked for crypto account', () => {
        const result = getSystemMaintenanceContent({
            currency: 'BTC',
            isCashierLocked: false,
            isCrypto: true,
            isDepositLocked: false,
            isWithdrawalLocked: true,
        });

        if (result) render(result.description);
        expect(
            screen.getByText(
                'Due to system maintenance, withdrawals from your BTC Wallet are unavailable at the moment. Please try again later.'
            )
        ).toBeInTheDocument();

        if (result) render(result.title);
        expect(screen.getByText('BTC Wallet withdrawals are temporarily unavailable.')).toBeInTheDocument();
    });
});
