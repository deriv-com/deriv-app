import React from 'react';
import { render, screen } from '@testing-library/react';
import CFDInstrumentsLabelHighlighted from '../cfd-instruments-label-highlighted';

jest.mock('../instruments-icon-with-label', () => jest.fn(() => <div>Mocked Icon</div>));

describe('<CFDInstrumentsLabelHighlighted />', () => {
    const mocked_props = {
        trading_platforms: {
            platform: 'mt5',
            market_type: 'gaming',
            shortcode: 'svg',
        },
    };

    it('should renders icons for market type gaming/synthetic', () => {
        render(<CFDInstrumentsLabelHighlighted {...mocked_props} />);

        const containerElement = screen.getByTestId('dt_compare_cfd_account_outline__container');
        expect(containerElement).toBeInTheDocument();
        expect(containerElement).toHaveClass('compare-cfd-account-outline');
    });

    it('should renders icons for market type all financial', () => {
        mocked_props.trading_platforms.market_type = 'financial';
        render(<CFDInstrumentsLabelHighlighted {...mocked_props} />);

        const containerElement = screen.getByTestId('dt_compare_cfd_account_outline__container');
        expect(containerElement).toBeInTheDocument();
        expect(containerElement).toHaveClass('compare-cfd-account-outline');
    });

    it('should renders icons for market type all', () => {
        mocked_props.trading_platforms.market_type = 'financial';
        render(<CFDInstrumentsLabelHighlighted {...mocked_props} />);

        const containerElement = screen.getByTestId('dt_compare_cfd_account_outline__container');
        expect(containerElement).toBeInTheDocument();
        expect(containerElement).toHaveClass('compare-cfd-account-outline');
    });
});
