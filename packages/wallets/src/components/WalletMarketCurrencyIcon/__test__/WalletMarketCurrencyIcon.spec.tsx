import React from 'react';
import { render, screen } from '@testing-library/react';
import { CFD_PLATFORMS, MARKET_TYPE } from '../../../features/cfd/constants';
import WalletMarketCurrencyIcon from '../WalletMarketCurrencyIcon';
import '@testing-library/jest-dom';

const defaultProps = {
    currency: 'USD',
    isDemo: false,
};
describe('WalletMarketCurrencyIcon', () => {
    it('renders MT5 Financial Icon', () => {
        render(
            <WalletMarketCurrencyIcon
                {...defaultProps}
                marketType={MARKET_TYPE.FINANCIAL}
                platform={CFD_PLATFORMS.MT5}
            />
        );
        const marketIcon = screen.getByTestId('dt_wallet_icon');
        const currencyIcon = screen.getByTestId('dt_wallet_currency_icon');
        expect(screen.getByTestId('dt_wallet_market_icon')).toBeInTheDocument();
        expect(marketIcon).toBeInTheDocument();
        expect(currencyIcon).toBeInTheDocument();
    });

    it('renders DXTrade icon', () => {
        render(
            <WalletMarketCurrencyIcon {...defaultProps} marketType={MARKET_TYPE.ALL} platform={CFD_PLATFORMS.DXTRADE} />
        );
        const marketIcon = screen.getByTestId('dt_wallet_icon');
        const currencyIcon = screen.getByTestId('dt_wallet_currency_icon');
        expect(screen.getByTestId('dt_wallet_market_icon')).toBeInTheDocument();
        expect(marketIcon).toBeInTheDocument();
        expect(currencyIcon).toBeInTheDocument();
    });

    it('renders Options icon', () => {
        render(<WalletMarketCurrencyIcon {...defaultProps} marketType={undefined} platform={undefined} />);
        const marketIcon = screen.getByTestId('dt_wallet_icon');
        const currencyIcon = screen.getByTestId('dt_wallet_currency_icon');
        expect(screen.getByTestId('dt_wallet_market_icon')).toBeInTheDocument();
        expect(marketIcon).toBeInTheDocument();
        expect(currencyIcon).toBeInTheDocument();
    });
});
