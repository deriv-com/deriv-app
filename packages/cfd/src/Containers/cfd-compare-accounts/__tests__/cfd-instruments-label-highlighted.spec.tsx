import React from 'react';
import { render, screen } from '@testing-library/react';
import CFDInstrumentsLabelHighlighted from '../cfd-instruments-label-highlighted';
import { StoreProvider, mockStore } from '@deriv/stores';
import { MARKET_TYPE } from '../../../Helpers/cfd-config';

jest.mock('../instruments-icon-with-label', () => jest.fn(() => <div>Mocked Icon</div>));

type TKeys = keyof typeof MARKET_TYPE;

type TMockedProps = {
    trading_platforms: {
        market_type: typeof MARKET_TYPE[TKeys];
        shortcode: string;
        platform: string;
    };
};

describe('<CFDInstrumentsLabelHighlighted />', () => {
    const mock = mockStore({
        traders_hub: {
            selected_region: 'Non-EU',
        },
    });

    const mocked_props: TMockedProps = {
        trading_platforms: {
            platform: 'mt5',
            market_type: MARKET_TYPE.UNREGULATED,
            shortcode: 'svg',
        },
    };

    it('should renders icons for market type gaming/synthetic', () => {
        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );
        render(<CFDInstrumentsLabelHighlighted {...mocked_props} />, { wrapper });

        const containerElement = screen.getByTestId('dt_compare_cfd_account_outline__container');
        expect(containerElement).toBeInTheDocument();
        expect(containerElement).toHaveClass('compare-cfd-account-outline');
    });

    it('should renders icons for market type all financial', () => {
        mocked_props.trading_platforms.market_type = MARKET_TYPE.FINANCIAL;
        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );
        render(<CFDInstrumentsLabelHighlighted {...mocked_props} />, { wrapper });
        const containerElement = screen.getByTestId('dt_compare_cfd_account_outline__container');
        expect(containerElement).toBeInTheDocument();
        expect(containerElement).toHaveClass('compare-cfd-account-outline');
    });

    it('should renders icons for market type all', () => {
        mocked_props.trading_platforms.market_type = MARKET_TYPE.FINANCIAL;
        const wrapper = ({ children }: { children: JSX.Element }) => (
            <StoreProvider store={mock}>{children}</StoreProvider>
        );
        render(<CFDInstrumentsLabelHighlighted {...mocked_props} />, { wrapper });
        const containerElement = screen.getByTestId('dt_compare_cfd_account_outline__container');
        expect(containerElement).toBeInTheDocument();
        expect(containerElement).toHaveClass('compare-cfd-account-outline');
    });
});
