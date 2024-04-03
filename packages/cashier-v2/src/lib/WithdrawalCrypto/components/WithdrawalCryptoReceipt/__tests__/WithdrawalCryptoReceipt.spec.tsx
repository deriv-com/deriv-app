import React from 'react';
import { cleanup, render, screen, fireEvent } from '@testing-library/react';
import { useDevice } from '@deriv-com/ui';
import { useWithdrawalCryptoContext } from '../../../provider';
import WithdrawalCryptoReceipt from '../WithdrawalCryptoReceipt';

jest.mock('../../../provider', () => ({
    ...jest.requireActual('../../../provider'),
    useWithdrawalCryptoContext: jest.fn(),
}));

jest.mock('../../../../../components', () => ({
    ...jest.requireActual('../../../../../components'),
    CurrencyIcon: jest.fn(({ currency, size }) => (
        <div>
            {currency}-icon-{size}
        </div>
    )),
}));

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn(),
}));

const mockUseWithdrawalCryptoContext = useWithdrawalCryptoContext as jest.MockedFunction<
    typeof useWithdrawalCryptoContext
>;

const mockUseDevice = useDevice as jest.MockedFunction<typeof useDevice>;

const mockResetWithdrawalVerification = jest.fn();

describe('<WithdrawalCryptoReceipt />', () => {
    beforeEach(() => {
        // @ts-expect-error - since this is a mock, we only need partial properties of the hook
        mockUseWithdrawalCryptoContext.mockReturnValue({
            withdrawalReceipt: {
                address: 'SampleAddress',
                amount: '1.00000000',
                fromAccount: {
                    currency: 'BTC',
                },
            },
            resetWithdrawalVerification: mockResetWithdrawalVerification,
        });

        // @ts-expect-error - since this is a mock, we only need partial properties of the hook
        mockUseDevice.mockReturnValue({ isMobile: false });
    });

    afterEach(cleanup);

    it('should check if the correct icon is rendered with the correct size in desktop mode', () => {
        render(<WithdrawalCryptoReceipt />);

        expect(screen.getByText('BTC-icon-md')).toBeInTheDocument();
    });

    it('should check if the correct icon is rendered with the correct size in mobile mode', () => {
        // @ts-expect-error - since this is a mock, we only need partial properties of the hook
        mockUseDevice.mockReturnValue({ isMobile: true });

        render(<WithdrawalCryptoReceipt />);

        expect(screen.getByText('BTC-icon-sm')).toBeInTheDocument();
    });

    it('should check if the correct amount is displayed with the currency', () => {
        render(<WithdrawalCryptoReceipt />);

        expect(screen.getByText('1.00000000 BTC')).toBeInTheDocument();
    });

    it('should check if the correct address is rendered', () => {
        render(<WithdrawalCryptoReceipt />);

        expect(screen.getByText('SampleAddress')).toBeInTheDocument();
    });

    it('should check if the `Make a new withdrawal` resets the verification code', () => {
        render(<WithdrawalCryptoReceipt />);

        const makeANewWithdrawalBtn = screen.getByText('Make a new withdrawal');
        fireEvent.click(makeANewWithdrawalBtn);

        expect(mockResetWithdrawalVerification).toBeCalled();
    });
});
