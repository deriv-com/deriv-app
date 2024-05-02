import React from 'react';
import { useActiveAccount, useCryptoConfig } from '@deriv/api-v2';
import { render, screen } from '@testing-library/react';
import DepositCryptoDisclaimers from '../DepositCryptoDisclaimers';

jest.mock('@deriv/api-v2', () => ({
    useActiveAccount: jest.fn(),
    useCryptoConfig: jest.fn(),
}));

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

    it('should render with default disclaimer', () => {
        (useActiveAccount as jest.Mock).mockReturnValue({ data: {} });
        (useCryptoConfig as jest.Mock).mockReturnValue({ data: {} });

        render(<DepositCryptoDisclaimers />);

        expect(screen.getByText('To avoid loss of funds:')).toBeInTheDocument();
        expect(screen.getByText('Do not send other cryptocurrencies to this address.')).toBeInTheDocument();
        expect(
            screen.getByText('Make sure to copy your Deriv account address correctly into your crypto wallet.')
        ).toBeInTheDocument();
        expect(screen.queryByText(/A minimum deposit value of/)).not.toBeInTheDocument();
        expect(
            screen.getByText('You’ll receive an email when your deposit starts being processed.')
        ).toBeInTheDocument();
    });

    it('should render with minimum deposit disclaimer for active currency', () => {
        (useActiveAccount as jest.Mock).mockReturnValue({ data: mockData });
        (useCryptoConfig as jest.Mock).mockReturnValue({ data: { minimum_deposit: 10 } });

        render(<DepositCryptoDisclaimers />);

        expect(screen.getByText('To avoid loss of funds:')).toBeInTheDocument();
        expect(screen.getByText('Do not send other cryptocurrencies to this address.')).toBeInTheDocument();
        expect(
            screen.getByText('Make sure to copy your Deriv account address correctly into your crypto wallet.')
        ).toBeInTheDocument();
        expect(screen.getByText(/A minimum deposit value of/)).toBeInTheDocument();
        expect(screen.getByText(/Ethereum \(ETH\) network/)).toBeInTheDocument();
        expect(
            screen.getByText('You’ll receive an email when your deposit starts being processed.')
        ).toBeInTheDocument();
    });

    it('should render with specific minimum deposit disclaimer for tUSDT', () => {
        const tUSDTData = {
            currency: 'tUSDT',
            currency_config: {
                ...mockData.currency_config,
                is_tUSDT: true,
            },
        };

        (useActiveAccount as jest.Mock).mockReturnValue({ data: tUSDTData });
        (useCryptoConfig as jest.Mock).mockReturnValue({ data: { minimum_deposit: 10 } });

        render(<DepositCryptoDisclaimers />);

        expect(screen.getByText('To avoid loss of funds:')).toBeInTheDocument();
        expect(screen.getByText('Do not send other cryptocurrencies to this address.')).toBeInTheDocument();
        expect(
            screen.getByText('Make sure to copy your Deriv account address correctly into your crypto wallet.')
        ).toBeInTheDocument();
        expect(screen.getByText(/A minimum deposit value of/)).toBeInTheDocument();
        expect(screen.getByText(/Tron \(TRC20\) network/)).toBeInTheDocument();
        expect(screen.getByText(/Otherwise, a fee is applied./)).toBeInTheDocument();
        expect(
            screen.getByText('You’ll receive an email when your deposit starts being processed.')
        ).toBeInTheDocument();
    });
});
