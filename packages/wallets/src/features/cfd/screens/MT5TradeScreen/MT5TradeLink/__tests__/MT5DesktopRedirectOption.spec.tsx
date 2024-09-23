import React from 'react';
import { render, screen } from '@testing-library/react';
import MT5DesktopRedirectOption from '../MT5DesktopRedirectOption';

jest.mock('../MT5TradeLink', () => ({
    __esModule: true,
    default: ({ app, platform }: { app: string; platform: string }) => (
        <div data-platform={platform} data-testid={`dt_mt5_trade_link_${app}`}>
            {app}
        </div>
    ),
}));

describe('MT5DesktopRedirectOption', () => {
    it('renders MT5TradeLink components for all desktop apps', () => {
        render(<MT5DesktopRedirectOption />);

        const expectedApps = ['web', 'windows', 'macos', 'linux'];
        expectedApps.forEach(app => {
            const linkElement = screen.getByTestId(`dt_mt5_trade_link_${app}`);
            expect(linkElement).toBeInTheDocument();
            expect(linkElement).toHaveTextContent(app);
            expect(linkElement).toHaveAttribute('data-platform', 'mt5');
        });

        expect(screen.getAllByTestId(/dt_mt5_trade_link_/)).toHaveLength(expectedApps.length);
    });

    it('renders MT5TradeLink components in the correct order', () => {
        render(<MT5DesktopRedirectOption />);

        const linkElements = screen.getAllByTestId(/dt_mt5_trade_link_/);
        const renderedOrder = linkElements.map(el => el.textContent);

        expect(renderedOrder).toEqual(['web', 'windows', 'macos', 'linux']);
    });
});
