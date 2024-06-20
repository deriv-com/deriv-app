import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RealSignupBannerDTraderV2 from '../real-signup-banner-dtrader-v2';

const mock_currency_btc_icon = 'CurrencyBtcIcon';
const mock_currency_eur_icon = 'CurrencyEurIcon';

jest.mock('@deriv/quill-icons', () => ({
    ...jest.requireActual('@deriv/quill-icons'),
    CurrencyBtcIcon: jest.fn(() => mock_currency_btc_icon),
    CurrencyEurIcon: jest.fn(() => mock_currency_eur_icon),
}));

const mockProps = {
    openRealAccount: jest.fn(),
    is_eu: false,
};

describe('RealSignupBannerDTraderV2', () => {
    it('should render banner with specific for eu icons and apply specific className for their container if eu === true', () => {
        render(<RealSignupBannerDTraderV2 {...mockProps} is_eu />);

        const eu_currency = screen.getByText(mock_currency_eur_icon);

        expect(eu_currency).toBeInTheDocument();
        expect(eu_currency).toHaveClass('banner__currency--is-eu');
        expect(screen.queryByText(mock_currency_btc_icon)).not.toBeInTheDocument();
    });

    it('should render banner with specific for non-eu icons and apply not specific className for their container if eu === false', () => {
        render(<RealSignupBannerDTraderV2 {...mockProps} />);

        const non_eu_currency = screen.getByText(mock_currency_btc_icon);

        expect(non_eu_currency).toBeInTheDocument();
        expect(non_eu_currency).not.toHaveClass('banner__currency--is-eu');
        expect(screen.queryByText(mock_currency_eur_icon)).not.toBeInTheDocument();
    });
    it('should call openRealAccount when user clicks on banner', () => {
        render(<RealSignupBannerDTraderV2 {...mockProps} />);

        expect(mockProps.openRealAccount).not.toBeCalled();
        userEvent.click(screen.getByText(mock_currency_btc_icon));
        expect(mockProps.openRealAccount).toBeCalled();
    });
});
