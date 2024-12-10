import React from 'react';
import { useCtraderServiceToken } from '@deriv/api-v2';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { getPlatformFromUrl } from '../../../../../../helpers/urls';
import { TPlatforms } from '../../../../../../types';
import MT5TradeLink from '../MT5TradeLink';

jest.mock('@deriv/api-v2', () => ({
    useCtraderServiceToken: jest.fn(),
    useIsEuRegion: jest.fn(() => ({
        data: false,
    })),
}));

jest.mock('../../../../../../helpers/urls', () => ({
    getPlatformFromUrl: jest.fn(),
}));

describe('MT5TradeLink', () => {
    beforeEach(() => {
        (useCtraderServiceToken as jest.Mock).mockReturnValue({
            mutateAsync: jest.fn().mockResolvedValue({ service_token: { ctrader: { token: 'mock-token' } } }),
        });
        (getPlatformFromUrl as jest.Mock).mockReturnValue({ isStaging: false, isTestLink: false });

        window.open = jest.fn();
    });

    it('renders MT5 download link correctly', () => {
        render(<MT5TradeLink platform='mt5' />);

        expect(screen.getByText('MetaTrader 5 Linux app')).toBeInTheDocument();
        expect(screen.getByText('Learn more')).toBeInTheDocument();
    });

    it('renders DTrader web terminal link correctly', () => {
        render(<MT5TradeLink platform='dxtrade' />);

        expect(screen.getByText('Run Deriv X on your browser')).toBeInTheDocument();
        expect(screen.getByText('Web terminal')).toBeInTheDocument();
    });

    it('opens MT5 download link when clicked', () => {
        render(<MT5TradeLink platform='mt5' />);

        fireEvent.click(screen.getByText('Learn more'));
        expect(window.open).toHaveBeenCalledWith(
            'https://www.metatrader5.com/en/terminal/help/start_advanced/install_linux',
            '_blank',
            'noopener,noreferrer'
        );
    });

    it('opens DTrader web terminal when clicked', async () => {
        render(<MT5TradeLink platform='dxtrade' />);

        fireEvent.click(screen.getByText('Web terminal'));
        await waitFor(() => {
            expect(window.open).toHaveBeenCalledWith('https://dx.deriv.com');
        });
    });

    it('opens cTrader web terminal with token when clicked', async () => {
        render(<MT5TradeLink platform='ctrader' />);

        fireEvent.click(screen.getByText('Web terminal'));
        await waitFor(() => {
            expect(window.open).toHaveBeenCalledWith('https://ct.deriv.com/?token=mock-token');
        });
    });

    it('handles demo mode for DTrader', async () => {
        render(<MT5TradeLink isDemo={true} platform='dxtrade' />);

        fireEvent.click(screen.getByText('Web terminal'));
        await waitFor(() => {
            expect(window.open).toHaveBeenCalledWith('https://dx-demo.deriv.com');
        });
    });

    it('renders cTrader app download link correctly', () => {
        render(<MT5TradeLink app='ctrader' />);

        expect(screen.getByText('CTrader Windows App')).toBeInTheDocument();
        expect(screen.getByText('Download')).toBeInTheDocument();
    });
    it('handles cTrader token failure', async () => {
        (useCtraderServiceToken as jest.Mock).mockReturnValue({
            mutateAsync: jest.fn().mockResolvedValue({ service_token: { ctrader: { token: null } } }),
        });

        render(<MT5TradeLink platform='ctrader' />);

        fireEvent.click(screen.getByText('Web terminal'));
        await waitFor(() => {
            expect(window.open).toHaveBeenCalledWith('https://ct.deriv.com');
        });
    });

    it('handles staging environment for cTrader', async () => {
        (getPlatformFromUrl as jest.Mock).mockReturnValue({ isStaging: true, isTestLink: false });

        render(<MT5TradeLink platform='ctrader' />);

        fireEvent.click(screen.getByText('Web terminal'));
        await waitFor(() => {
            expect(window.open).toHaveBeenCalledWith('https://ct-uat.deriv.com/?token=mock-token');
        });
    });

    it('handles test link for cTrader', async () => {
        (getPlatformFromUrl as jest.Mock).mockReturnValue({ isStaging: false, isTestLink: true });

        render(<MT5TradeLink platform='ctrader' />);

        fireEvent.click(screen.getByText('Web terminal'));
        await waitFor(() => {
            expect(window.open).toHaveBeenCalledWith('https://ct-uat.deriv.com/?token=mock-token');
        });
    });

    it('handles other platforms', async () => {
        render(<MT5TradeLink platform={'mt5Investor' as TPlatforms.All} />);

        fireEvent.click(screen.getByText('Web terminal'));
        await waitFor(() => {
            expect(window.open).toHaveBeenCalledWith('');
        });
    });
});
