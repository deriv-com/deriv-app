import React from 'react';
import { useHover } from 'usehooks-ts';
import { render, screen } from '@testing-library/react';
import useDevice from '../../../../../../../hooks/useDevice';
import DepositCryptoAddress from '../DepositCryptoAddress';

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
    });
    it('should show loader when crypto address not loaded yet', () => {
        render(<DepositCryptoAddress depositCryptoAddress={undefined} isLoading={true} />);
        expect(screen.getByTestId('dt_deposit-crypto-address-loader')).toBeInTheDocument();
    });

    it('should show crypto address after the address fetched', () => {
        (useDevice as jest.Mock).mockReturnValue({ isMobile: true });
        render(<DepositCryptoAddress depositCryptoAddress='1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa' isLoading={false} />);
        expect(screen.getByText('1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa')).toBeInTheDocument();
    });

    it('should show QR code', () => {
        render(<DepositCryptoAddress depositCryptoAddress='1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa' isLoading={false} />);
        expect(screen.getByTestId('dt_deposit-crypto-address-qr-code')).toBeInTheDocument();
    });

    it('should show copy text when hovering', () => {
        (useHover as jest.Mock).mockReturnValue(true);
        render(<DepositCryptoAddress depositCryptoAddress='1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa' isLoading={false} />);
        expect(screen.getByText('Copy')).toBeInTheDocument();
    });
});
