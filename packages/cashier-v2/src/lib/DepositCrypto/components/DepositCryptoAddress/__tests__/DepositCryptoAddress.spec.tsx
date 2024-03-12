import React from 'react';
import { useAuthorize, useDepositCryptoAddress } from '@deriv/api-v2';
import { useDevice } from '@deriv-com/ui';
import { render, screen } from '@testing-library/react';
import DepositCryptoAddress from '../DepositCryptoAddress';

jest.mock('@deriv/api-v2', () => ({
    useAuthorize: jest.fn(),
    useDepositCryptoAddress: jest.fn(),
}));

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn(),
}));

jest.mock('usehooks-ts', () => ({
    useCopyToClipboard: jest.fn(() => [true, jest.fn()]),
}));

describe('DepositCryptoAddress', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        HTMLCanvasElement.prototype.getContext = jest.fn();
        (useDevice as jest.Mock).mockReturnValue({ isMobile: false });
        (useAuthorize as jest.Mock).mockReturnValue({ isSuccess: true });
        (useDepositCryptoAddress as jest.Mock).mockReturnValue({
            data: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
            isLoading: false,
            mutate: jest.fn(),
        });
    });
    it('should show loader when crypto address not loaded yet', () => {
        (useDepositCryptoAddress as jest.Mock).mockReturnValue({ data: undefined, isLoading: true, mutate: jest.fn() });
        render(<DepositCryptoAddress />);
        expect(screen.getByTestId('dt_deposit-crypto-address-loader')).toBeInTheDocument();
    });

    it('should show crypto address after the address fetched', () => {
        render(<DepositCryptoAddress />);
        expect(screen.getByText('1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa')).toBeInTheDocument();
    });

    it('should show QR code', () => {
        render(<DepositCryptoAddress />);
        expect(screen.getByTestId('dt_deposit-crypto-address-qr-code')).toBeInTheDocument();
    });
});
