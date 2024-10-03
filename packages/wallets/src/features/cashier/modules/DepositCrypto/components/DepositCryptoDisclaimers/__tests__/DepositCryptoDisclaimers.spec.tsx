import React from 'react';
import { useActiveWalletAccount, useCryptoConfig } from '@deriv/api-v2';
import { render, screen } from '@testing-library/react';
import DepositCryptoDisclaimers from '../DepositCryptoDisclaimers';

jest.mock('@deriv/api-v2');

describe('DepositCryptoDisclaimers', () => {
    const mockData = {
        currency: 'ETH',
        currency_config: {
            fractional_digits: 2,
            is_tUSDT: false,
        },
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders with default disclaimer', () => {
        (useActiveWalletAccount as jest.Mock).mockReturnValue({ data: {} });
        (useCryptoConfig as jest.Mock).mockReturnValue({ data: {} });

        render(<DepositCryptoDisclaimers />);

        expect(screen.getByText('To avoid loss of funds:')).toBeInTheDocument();
        expect(screen.getByText(/Incorrect transfers may result in the loss of funds./)).toBeInTheDocument();
        expect(screen.queryByText(/A minimum deposit value of/)).not.toBeInTheDocument();
        expect(
            screen.getByText("You'll receive an email when your deposit starts being processed.")
        ).toBeInTheDocument();
    });

    it('renders with minimum deposit disclaimer for active currency', () => {
        (useActiveWalletAccount as jest.Mock).mockReturnValue({ data: mockData });
        (useCryptoConfig as jest.Mock).mockReturnValue({ data: { minimum_deposit: 10 } });

        render(<DepositCryptoDisclaimers />);

        expect(screen.getByText('To avoid loss of funds:')).toBeInTheDocument();
        expect(screen.getByText('Only send Ethereum (ETH) to this address.')).toBeInTheDocument();
        expect(
            screen.getByText('Make sure to copy the Deriv ETH Wallet address to your crypto wallet.')
        ).toBeInTheDocument();
        expect(
            screen.getByText(
                'In your crypto wallet, select the Ethereum (ETH) network when transferring to Deriv. Incorrect transfers may result in the loss of funds.'
            )
        ).toBeInTheDocument();
        expect(
            screen.getByText("You'll receive an email when your deposit starts being processed.")
        ).toBeInTheDocument();
    });

    it('renders with specific minimum deposit disclaimer for tUSDT', () => {
        const tUSDTData = {
            currency: 'tUSDT',
            currency_config: {
                ...mockData.currency_config,
                is_tUSDT: true,
            },
        };

        (useActiveWalletAccount as jest.Mock).mockReturnValue({ data: tUSDTData });
        (useCryptoConfig as jest.Mock).mockReturnValue({ data: { minimum_deposit: 10 } });

        render(<DepositCryptoDisclaimers />);

        expect(screen.getByText('Only send Tron (TRC20) to this address.')).toBeInTheDocument();
        expect(
            screen.getByText('Make sure to copy the Deriv tUSDT Wallet address to your crypto wallet.')
        ).toBeInTheDocument();
        expect(
            screen.getByText(
                'In your crypto wallet, select the Tron (TRC20) network when transferring to Deriv. Incorrect transfers may result in the loss of funds.'
            )
        ).toBeInTheDocument();
        expect(screen.getByText(/A minimum deposit value of/)).toBeInTheDocument();
        expect(screen.getByText(/Otherwise, a fee is applied./)).toBeInTheDocument();
        expect(
            screen.getByText("You'll receive an email when your deposit starts being processed.")
        ).toBeInTheDocument();
    });
});
