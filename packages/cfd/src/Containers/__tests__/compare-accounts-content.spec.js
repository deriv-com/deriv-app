import React from 'react';
import { screen, render } from '@testing-library/react';
import CompareAccountsContent from '../compare-accounts-content';

describe('should render the CompareAccountsContent component properly', () => {
    let modal_root_el;

    beforeAll(() => {
        modal_root_el = document.createElement('div');
        modal_root_el.setAttribute('id', 'modal_root');
        document.body.appendChild(modal_root_el);
    });

    afterAll(() => {
        document.body.removeChild(modal_root_el);
    });

    const all_landing_companies = {
        mt_gaming_company: {
            financial: 'USD',
        },
        mt_financial_company: {
            financial: 'USD',
            financial_stp: 'USD',
        },
    };

    let mock_props;

    beforeEach(() => {
        mock_props = {
            is_logged_in: true,
            platform: 'mt5',
            is_eu_client: 'false',
            residence: 'idn',
            is_eu: 'false',
            is_uk: 'false',
        };
    });

    it('should render the proper column headers properly', () => {
        render(<CompareAccountsContent {...mock_props} landing_companies={all_landing_companies} />);
        expect(screen.getByText('Derived')).toBeInTheDocument();
        expect(screen.getByText('CFDs')).toBeInTheDocument();
    });

    it('should render the proper data for synthetic', () => {
        render(<CompareAccountsContent {...mock_props} landing_companies={all_landing_companies} />);
        expect(screen.getByText(/Account Currency/i)).toBeInTheDocument();
        expect(screen.getByText('EUR')).toBeInTheDocument();
        expect(screen.getByText('EUR/GBP/USD')).toBeInTheDocument();
        expect(screen.getByText('USD')).toBeInTheDocument();

        expect(screen.getAllByText(/Maximum leverage/i)).toHaveLength(2);
        expect(screen.getByText(/Up to 1:1000/i)).toBeInTheDocument();

        expect(screen.getAllByText(/Order execution/i)).toHaveLength(2);
        expect(screen.getAllByText(/Market/i)[0]).toBeInTheDocument();

        expect(screen.getAllByText(/Spread/i)).toHaveLength(4);
        expect(screen.getAllByText('Fixed/Variable')[0]).toBeInTheDocument();

        expect(screen.getAllByText(/Commission/i)).toHaveLength(3);
        expect(screen.getAllByText(/No/i).length).toBe(12);

        expect(screen.getAllByText(/Minimum deposit/i)).toHaveLength(1);

        expect(screen.getAllByText(/Margin call/i)).toHaveLength(4);
        expect(screen.getAllByText('100%').length).toBe(3);

        expect(screen.getAllByText(/Stop out level/i)).toHaveLength(5);
        expect(screen.getAllByText('50%').length).toBe(3);

        expect(screen.getAllByText(/Number of assets/i)).toHaveLength(1);
        expect(screen.getAllByText('20+').length).toBe(1);
        expect(screen.getAllByText('50+').length).toBe(1);
        expect(screen.getAllByText('70+').length).toBe(1);

        expect(screen.getAllByText(/Cryptocurrency trading/i)).toHaveLength(4);
        expect(screen.getAllByText('N/A').length).toBe(1);
        expect(screen.getAllByText('24/7').length).toBe(2);

        expect(screen.getAllByText(/Trading instruments/i)).toHaveLength(1);
        expect(screen.getAllByText(/Synthetics/i).length).toBe(1);
        expect(
            screen.getByText(/Forex, stocks, stock indices, cryptocurrencies, synthetic indices/i)
        ).toBeInTheDocument();

        expect(screen.getByText(/FX-majors, FX-minors, FX-exotics, and cryptocurrencies/i)).toBeInTheDocument();
    });

    it('should render the correct footer text', () => {
        render(
            <CompareAccountsContent {...mock_props} landing_companies={all_landing_companies} is_eu_client={true} />
        );

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

    it('should render the correct content for the DerivX platform', () => {
        render(
            <CompareAccountsContent
                {...mock_props}
                landing_companies={all_landing_companies}
                platform='dxtrade'
                residence='uk'
            />
        );

        expect(screen.getAllByText(/Account currency/i)[0]).toBeInTheDocument();
        expect(screen.getAllByText('EUR/GBP')).toHaveLength(1);
        expect(screen.getByText(/Number of assets/i)).toBeInTheDocument();
        expect(screen.getByText('90+')).toBeInTheDocument();
        expect(
            screen.getByText('FX-majors (standard/micro lots), FX-minors, Commodities, Cryptocurrencies (except UK)')
        ).toBeInTheDocument();
    });

    it('should not see the Financial STP column in the DerivX platform', () => {
        render(<CompareAccountsContent landing_companies={all_landing_companies} {...mock_props} platform='dxtrade' />);
        expect(screen.queryByText('Financial STP')).not.toBeInTheDocument();
    });

    it('should render Account currency even if the user is not logged in', () => {
        render(
            <CompareAccountsContent landing_companies={all_landing_companies} {...mock_props} is_logged_in={false} />
        );
        expect(screen.queryByText(/Account currency/i)).toBeInTheDocument();
    });

    it('should render the column head from CFDs to Financial if is_eu is true', () => {
        render(<CompareAccountsContent {...mock_props} landing_companies={all_landing_companies} is_eu={true} />);
        expect(screen.getAllByText(/Financial/i)).toHaveLength(2);
    });
});
