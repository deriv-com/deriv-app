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
        // @ts-expect-error - since this is a mock, we only need partial properties of the account
        render(<MT5DesktopRedirectOption mt5TradeAccount={{ white_label_links: {} }} />);

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
        // @ts-expect-error - since this is a mock, we only need partial properties of the account
        render(<MT5DesktopRedirectOption mt5TradeAccount={{ white_label_links: {} }} />);

        const linkElements = screen.getAllByTestId(/dt_mt5_trade_link_/);
        const renderedOrder = linkElements.map(el => el.textContent);

        expect(renderedOrder).toEqual(['web', 'windows', 'macos', 'linux']);
    });
});
