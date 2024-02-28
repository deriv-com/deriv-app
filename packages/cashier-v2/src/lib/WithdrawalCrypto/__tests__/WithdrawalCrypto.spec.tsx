import React from 'react';
import { cleanup, render, screen } from '@testing-library/react';
import { useWithdrawalCryptoContext } from '../provider';
import WithdrawalCryptoModule from '../WithdrawalCrypto';

jest.mock('../components', () => ({
    ...jest.requireActual('../components'),
    WithdrawalCryptoDisclaimer: jest.fn(() => <div>WithdrawalCryptoDisclaimer</div>),
    WithdrawalCryptoForm: jest.fn(() => <div>WithdrawalCryptoForm</div>),
    WithdrawalCryptoReceipt: jest.fn(() => <div>WithdrawalCryptoReceipt</div>),
}));

jest.mock('../provider', () => ({
    ...jest.requireActual('../provider'),
    useWithdrawalCryptoContext: jest.fn(),
    WithdrawalCryptoProvider: jest.fn(({ children }) => <div>{children}</div>),
}));

const mockUseWithdrawalCryptoContext = useWithdrawalCryptoContext as jest.MockedFunction<
    typeof useWithdrawalCryptoContext
>;

describe('', () => {
    beforeEach(() => {
        mockUseWithdrawalCryptoContext.mockReturnValue({
            // @ts-expect-error - since this is a mock, we only need partial properties of the hook
            activeAccount: {
                currency: 'BTC',
            },
            // @ts-expect-error - since this is a mock, we only need partial properties of the hook
            getCurrencyConfig: jest.fn(() => {
                name: 'Bitcoin'; // NOSONAR
            }),
            isWithdrawalSuccess: false,
        });
    });

    afterEach(cleanup);

    it('should render the WithdrawalCryptoDisclaimer on successful withdrawal', () => {
        render(<WithdrawalCryptoModule setVerificationCode={jest.fn()} verificationCode='Abcd1234' />);
        expect(screen.getByText('WithdrawalCryptoDisclaimer')).toBeInTheDocument();
    });

    it('should render the WithdrawalCryptoForm on successful withdrawal', () => {
        render(<WithdrawalCryptoModule setVerificationCode={jest.fn()} verificationCode='Abcd1234' />);
        expect(screen.getByText('WithdrawalCryptoForm')).toBeInTheDocument();
    });

    it('should render the WithdrawalCryptoReceipt on successful withdrawal', () => {
        mockUseWithdrawalCryptoContext.mockReturnValue({
            // @ts-expect-error - since this is a mock, we only need partial properties of the hook
            activeAccount: {
                currency: 'BTC',
            },
            // @ts-expect-error - since this is a mock, we only need partial properties of the hook
            getCurrencyConfig: jest.fn(() => {
                name: 'Bitcoin'; // NOSONAR
            }),
            isWithdrawalSuccess: true,
        });

        render(<WithdrawalCryptoModule setVerificationCode={jest.fn()} verificationCode='Abcd1234' />);
        expect(screen.getByText('WithdrawalCryptoReceipt')).toBeInTheDocument();
    });
});
