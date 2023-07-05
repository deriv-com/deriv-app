import React from 'react';
import { render, screen } from '@testing-library/react';
import CFDCompareAccountsPlatformLabel from '../cfd-compare-accounts-platform-label';
import { platfromsHeaderLabel } from '../../../Helpers/compare-accounts-config';

describe('<CFDCompareAccountsPlatformLabel />', () => {
    const mocked_props = {
        trading_platforms: {
            platform: 'mt5',
        },
    };
    it('should renders MT5 platform label', () => {
        render(<CFDCompareAccountsPlatformLabel {...mocked_props} />);
        expect(screen.getByText(platfromsHeaderLabel.mt5)).toBeInTheDocument();
    });

    it('should renders Deriv X platform label', () => {
        mocked_props.trading_platforms.platform = 'dxtrade';
        render(<CFDCompareAccountsPlatformLabel {...mocked_props} />);
        expect(screen.getByText(platfromsHeaderLabel.other_cfds)).toBeInTheDocument();
    });
});
