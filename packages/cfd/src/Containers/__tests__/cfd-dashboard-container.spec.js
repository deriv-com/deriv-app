import React from 'react';
import { render, screen } from '@testing-library/react';
import CFDDashboardContainer from '../cfd-dashboard-container';

jest.mock('@deriv/components', () => {
    const original_module = jest.requireActual('@deriv/components');

    return {
        ...original_module,
        Icon: jest.fn(() => 'mocked_icon'),
    };
});

describe('CFDDashboardContainer', () => {
    const mock_props = {
        platform: 'mt5',
        active_index: 0,
        is_dark_mode_on: false,
    };

    it('should render <CFDDashboardContainer /> correctly', () => {
        render(<CFDDashboardContainer {...mock_props} />);
        expect(screen.getByTestId('dt_cfd_dashboard_download_center_container')).toBeInTheDocument();
    });

    it('should render <CFDDashboardContainer /> correctly with dark mode on', () => {
        render(<CFDDashboardContainer {...mock_props} is_dark_mode_on='true' />);
        expect(screen.getByTestId('dt_cfd_dashboard_download_center_container')).toBeInTheDocument();
    });
    it('should render correct text according to the platform (mt5)', () => {
        render(<CFDDashboardContainer {...mock_props} />);
        expect(
            screen.getByText('Run MT5 from your browser or download the MT5 app for your devices')
        ).toBeInTheDocument();
        expect(
            screen.getByText('The MT5 desktop app is not supported by Windows XP, Windows 2003, and Windows Vista.')
        ).toBeInTheDocument();
        expect(screen.getByTestId('td_mt5_text')).toBeInTheDocument();
    });
    it('should render correct text according to the platform (DerivX)', () => {
        render(<CFDDashboardContainer {...mock_props} platform='dxtrade' />);
        expect(screen.getByText('Run Deriv X on your browser or download the mobile app')).toBeInTheDocument();
        expect(screen.getByText('Web terminal')).toBeInTheDocument();
        expect(screen.getByTestId('dt_dxtrade_desktop_download')).toBeInTheDocument();
    });
});
