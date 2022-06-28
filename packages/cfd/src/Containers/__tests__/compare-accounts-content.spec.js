import React from 'react';
import { screen, render } from '@testing-library/react';
import CompareAccountsContent from '../compare-accounts-content';

beforeAll(() => {
    const modal_root_el = document.createElement('div');
    modal_root_el.setAttribute('id', 'modal_root');
    document.body.appendChild(modal_root_el);
});

describe('should render the CompareAccountsContent component properly', () => {
    const only_gaming_company = {
        mt_gaming_company: {
            financial: 'USD',
        },
    };

    const all_landing_companies = {
        mt_gaming_company: {
            financial: 'USD',
        },
        mt_financial_company: {
            financial: 'USD',
            financial_stp: 'USD',
        },
    };

    const mock_props = {
        is_logged_in: true,
        platform: 'mt5',
        show_eu_related: 'false',
        residence: 'idn',
        is_eu: 'false',
        is_uk: 'true',
    };

    it('should render the component', () => {
        render(<CompareAccountsContent {...mock_props} landing_companies={all_landing_companies} />);
    });

    it('should render the proper column headers properly', () => {
        render(<CompareAccountsContent {...mock_props} landing_companies={all_landing_companies} />);
        expect(screen.getByText('Synthetic')).toBeInTheDocument();
        expect(screen.getByText('CFDs')).toBeInTheDocument();
        expect(screen.getByText('Financial STP')).toBeInTheDocument();
    });

    it('should render the proper data', () => {
        render(<CompareAccountsContent {...mock_props} landing_companies={all_landing_companies} />);
        expect(screen.getByText(/Account Currency/i)).toBeInTheDocument();
        expect(screen.getByText('EUR')).toBeInTheDocument();
        expect(screen.getByText('EUR/GBP/USD')).toBeInTheDocument();
        expect(screen.getByText('USD')).toBeInTheDocument();

        expect(screen.getAllByText(/Maximum leverage/i)[0]).toBeInTheDocument();
        expect(screen.getAllByText(/1/i)[0]).toBeInTheDocument();
        expect(screen.getByText(/Up to 1:1000/i)).toBeInTheDocument();
        expect(screen.getByText(/Up to 1:30/i)).toBeInTheDocument();
        expect(screen.getAllByText(/Up to 1:100/i)[0]).toBeInTheDocument();

        expect(screen.getAllByText(/Order execution/i)[0]).toBeInTheDocument();
        expect(screen.getAllByText(/2/i)[0]).toBeInTheDocument();
        expect(screen.getAllByText(/Market/i)[0]).toBeInTheDocument();
        expect(screen.getAllByText(/Market/i)[1]).toBeInTheDocument();
        expect(screen.getAllByText(/Market/i)[2]).toBeInTheDocument();

        expect(screen.getAllByText(/Spread/i)[0]).toBeInTheDocument();
        expect(screen.getAllByText('Fixed/Variable')[0]).toBeInTheDocument();
        expect(screen.getAllByText('Fixed/Variable')[1]).toBeInTheDocument();
        expect(screen.getAllByText('Variable')[0]).toBeInTheDocument();

        expect(screen.getAllByText(/Commission/i)[0]).toBeInTheDocument();
        expect(screen.getAllByText(/4/i)[0]).toBeInTheDocument();
        expect(screen.getAllByText(/No/i)[1]).toBeInTheDocument();
        expect(screen.getAllByText(/No/i)[2]).toBeInTheDocument();
        expect(screen.getAllByText(/No/i)[3]).toBeInTheDocument();

        expect(screen.getAllByText(/Minimum deposit/i)[0]).toBeInTheDocument();
        expect(screen.getAllByText(/No/i)[0]).toBeInTheDocument();
        expect(screen.getAllByText(/No/i)[1]).toBeInTheDocument();
        expect(screen.getAllByText(/No/i)[2]).toBeInTheDocument();

        expect(screen.getAllByText(/Margin call/i)[0]).toBeInTheDocument();
        expect(screen.getAllByText(/5/i)[0]).toBeInTheDocument();
        expect(screen.getAllByText(/100%/i)[0]).toBeInTheDocument();
        expect(screen.getAllByText(/100%/i)[1]).toBeInTheDocument();
        expect(screen.getAllByText(/100%/i)[2]).toBeInTheDocument();

        expect(screen.getAllByText(/Stop out level/i)[0]).toBeInTheDocument();
        expect(screen.getAllByText(/6/i)[0]).toBeInTheDocument();
        expect(screen.getAllByText(/50%/i)[0]).toBeInTheDocument();
        expect(screen.getAllByText(/50%/i)[1]).toBeInTheDocument();
        expect(screen.getAllByText(/50%/i)[2]).toBeInTheDocument();

        expect(screen.getAllByText(/Number of assets/i)[0]).toBeInTheDocument();
        expect(screen.getAllByText(/20+/i)[0]).toBeInTheDocument();
        expect(screen.getAllByText(/50+/i)[1]).toBeInTheDocument();
        expect(screen.getAllByText(/70+/i)[0]).toBeInTheDocument();

        expect(screen.getAllByText(/Cryptocurrency trading/i)[0]).toBeInTheDocument();
        expect(screen.getAllByText(/7/i)[0]).toBeInTheDocument();
        expect(screen.getAllByText('N/A')[0]).toBeInTheDocument();
        expect(screen.getAllByText('24/7')[0]).toBeInTheDocument();
        expect(screen.getAllByText('24/7')[1]).toBeInTheDocument();

        expect(screen.getAllByText(/Trading instruments/i)[0]).toBeInTheDocument();
        expect(screen.getAllByText(/Synthetics/i)[0]).toBeInTheDocument();
        expect(
            screen.getAllByText(/Forex, stocks, stock indices, cryptocurrencies, synthetic indices/i)[0]
        ).toBeInTheDocument();
        expect(screen.getAllByText(/FX-majors, FX-minors, FX-exotics, and cryptocurrencies/i)[0]).toBeInTheDocument();

        expect(
            screen.getByText(
                /At bank rollover, liquidity in the forex markets is reduced and may increase the spread and processing time for client orders. This happens around 21:00 GMT during daylight saving time, and 22:00 GMT non-daylight saving time./i
            )
        ).toBeInTheDocument();
        expect(
            screen.getByText(/Margin call and stop out level will change from time to time based on market condition/i)
        ).toBeInTheDocument();
        expect(
            screen.getByText(
                /To protect your portfolio from adverse market movements due to the market opening gap, we reserve the right to decrease leverage on all offered symbols for financial accounts before market close and increase it again after market open. Please make sure that you have enough funds available in your MT5 account to support your positions at all times./i
            )
        ).toBeInTheDocument();
        expect(
            screen.getByText(/Cryptocurrency trading is not available for clients residing in the United Kingdom./i)
        ).toBeInTheDocument();
        expect(
            screen.getByText(
                /Leverage gives you the ability to trade a larger position using your existing capital. Leverage varies across different symbols/i
            )
        ).toBeInTheDocument();
        expect(
            screen.getByText(
                /All 3 account types use market execution. This means you agree with the broker's price in advance and will place orders at the broker's price./i
            )
        ).toBeInTheDocument();
        expect(
            screen.getByText(
                /The spread is the difference between the buy price and sell price. A variable spread means that the spread is constantly changing, depending on market conditions. A fixed spread remains constant but is subject to alteration, at the Broker's absolute discretion./i
            )
        ).toBeInTheDocument();
        expect(screen.getByText(/Deriv charges no commission across all account types/i)).toBeInTheDocument();
        expect(
            screen.getByText(
                /You’ll get a warning, known as margin call, if your account balance drops down close to the stop out level/i
            )
        ).toBeInTheDocument();
        expect(
            screen.getByText(
                /To understand stop out, first you need to learn about margin level, which is the ratio of your equity \(the total balance you would have if you close all your positions at that point\) to the margin you're using at the moment. If your margin level drops below our stop out level, your positions may be closed automatically to protect you from further losses./i
            )
        ).toBeInTheDocument();
        expect(
            screen.getByText(/Indicates the availability of cryptocurrency trading on a particular account./i)
        ).toBeInTheDocument();
    });

    it('should render the correct content for the only_gaming_company', () => {
        render(<CompareAccountsContent {...mock_props} landing_companies={only_gaming_company} />);
        expect(screen.getAllByText(/Synthetic/i)[0]).toBeInTheDocument();
    });
});
