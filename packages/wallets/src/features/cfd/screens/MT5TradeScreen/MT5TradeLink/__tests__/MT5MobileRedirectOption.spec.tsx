import React from 'react';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { THooks } from '../../../../../../types';
import { getDeeplinkUrl, getMobileAppInstallerUrl, getWebtraderUrl } from '../constants';
import MT5MobileRedirectOption from '../MT5MobileRedirectOption';

jest.mock('../constants', () => ({
    getDeeplinkUrl: jest.fn(),
    getMobileAppInstallerUrl: jest.fn(),
    getWebtraderUrl: jest.fn(),
}));

describe('MT5MobileRedirectOption', () => {
    const mockMT5TradeAccount = {} as THooks.MT5AccountsList;
    let originalLocation: Location;

    beforeEach(() => {
        jest.useFakeTimers({ legacyFakeTimers: true });
        (getDeeplinkUrl as jest.Mock).mockReturnValue('mock-deeplink-url');
        (getMobileAppInstallerUrl as jest.Mock).mockResolvedValue('mock-installer-url');
        (getWebtraderUrl as jest.Mock).mockReturnValue('mock-webtrader-url');

        originalLocation = window.location;
        // @ts-expect-error - this is required to mock the replacement of the read-only window.location
        delete window.location;
        window.location = {
            ...originalLocation,
            replace: jest.fn(),
        } as Location;
    });

    afterEach(() => {
        jest.clearAllMocks();
        jest.useRealTimers();
        window.location = originalLocation;
    });

    it('renders the content of mt5 mobile redirect option', () => {
        render(<MT5MobileRedirectOption mt5TradeAccount={mockMT5TradeAccount} />);

        expect(screen.getByText('MetaTrader5 web terminal')).toBeInTheDocument();
        expect(screen.getAllByText(/Trade with MT5 mobile app/)[0]).toBeInTheDocument();
        expect(screen.getByText(/Note: Don't have the MT5 app?/)).toBeInTheDocument();
    });

    it('navigates to webtrader URL when web terminal button is clicked', () => {
        render(<MT5MobileRedirectOption mt5TradeAccount={mockMT5TradeAccount} />);

        const webTerminalLink = screen.getByRole('link', { name: /MetaTrader5 web terminal/ });
        expect(webTerminalLink).toHaveAttribute('target', '_blank');
        expect(webTerminalLink).toHaveAttribute('rel', 'noopener noreferrer');
        expect(webTerminalLink).toHaveAttribute('href', 'mock-webtrader-url');
    });

    it('initiates mobile app redirection when mobile app button is clicked', async () => {
        render(<MT5MobileRedirectOption mt5TradeAccount={mockMT5TradeAccount} />);

        fireEvent.click(screen.getAllByText(/Trade with MT5 mobile app/)[0]);
        expect(window.location.replace).toHaveBeenCalledWith('mock-deeplink-url');
        (window.location.replace as jest.Mock).mockClear();

        await act(async () => {
            jest.runAllTimers();
        });

        await waitFor(
            () => {
                expect(window.location.replace).toHaveBeenCalledWith('mock-installer-url');
            },
            { timeout: 3001 }
        );
    });

    it('clears timeout when document becomes hidden', () => {
        render(<MT5MobileRedirectOption mt5TradeAccount={mockMT5TradeAccount} />);

        fireEvent.click(screen.getAllByText(/Trade with MT5 mobile app/)[0]);
        Object.defineProperty(document, 'hidden', { configurable: true, value: true });
        act(() => {
            document.dispatchEvent(new Event('visibilitychange'));
        });
        act(() => {
            jest.advanceTimersByTime(3000);
        });

        expect(window.location.replace).toHaveBeenCalledTimes(1);
        expect(window.location.replace).toHaveBeenCalledWith('mock-deeplink-url');
    });

    it('clears timeout and opens installer when window.onblur is true and document is not hidden', () => {
        render(<MT5MobileRedirectOption mt5TradeAccount={mockMT5TradeAccount} />);

        fireEvent.click(screen.getAllByText(/Trade with MT5 mobile app/)[0]);
        Object.defineProperty(document, 'hidden', { configurable: false, value: false });
        Object.defineProperty(window, 'onblur', {
            value: jest.fn(),
            writable: true,
        });
        act(() => {
            document.dispatchEvent(new Event('visibilitychange'));
        });
        act(() => {
            jest.advanceTimersByTime(3000);
        });

        expect(window.location.replace).toHaveBeenCalledTimes(3);
        expect(window.location.replace).toHaveBeenCalledWith('mock-deeplink-url');
    });
});
