import React from 'react';
import { useHover } from 'usehooks-ts';
import { useAuthorize, useDepositCryptoAddress } from '@deriv/api';
import { render, screen } from '@testing-library/react';
import useDevice from '../../../../../../../hooks/useDevice';
import DepositCryptoAddress from '../DepositCryptoAddress';

jest.mock('@deriv/api', () => ({
    useAuthorize: jest.fn(),
    useDepositCryptoAddress: jest.fn(),
}));

jest.mock('../../../../../../../hooks/useDevice');

jest.mock('usehooks-ts', () => ({
    useCopyToClipboard: jest.fn(() => [true, jest.fn()]),
    useHover: jest.fn(),
}));

describe('DepositCryptoAddress', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        HTMLCanvasElement.prototype.getContext = jest.fn();
        (useDevice as jest.Mock).mockReturnValue({ isMobile: false });
        (useHover as jest.Mock).mockReturnValue(false);
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
        (useDevice as jest.Mock).mockReturnValue({ isMobile: true });
        render(<DepositCryptoAddress />);
        expect(screen.getByText('1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa')).toBeInTheDocument();
    });

    it('should show QR code', () => {
        render(<DepositCryptoAddress />);
        expect(screen.getByTestId('dt_deposit-crypto-address-qr-code')).toBeInTheDocument();
    });

    it('should show copy text when hovering', () => {
        (useHover as jest.Mock).mockReturnValue(true);
        render(<DepositCryptoAddress />);
        expect(screen.getByText('Copy')).toBeInTheDocument();
    });
});
