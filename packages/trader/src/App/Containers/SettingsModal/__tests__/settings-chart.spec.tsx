import React from 'react';
import { render, screen } from '@testing-library/react';
import { mockStore } from '@deriv/stores';
import ChartSettings from '../settings-chart';
import TraderProviders from '../../../../trader-providers';

jest.mock('Assets/SvgComponents/settings/dark/interval-enabled.svg', () =>
    jest.fn(() => 'IntervalDurationEnabledDarkIcon')
);
jest.mock('Assets/SvgComponents/settings/dark/interval-disabled.svg', () =>
    jest.fn(() => 'IntervalDurationDisabledDarkIcon')
);
jest.mock('Assets/SvgComponents/settings/interval-enabled.svg', () =>
    jest.fn(() => 'IntervalDurationEnabledLightIcon')
);
jest.mock('Assets/SvgComponents/settings/interval-disabled.svg', () =>
    jest.fn(() => 'IntervalDurationDisabledLightIcon')
);

describe('<ChartSettings/>', () => {
    let default_mock_store: ReturnType<typeof mockStore>;
    beforeEach(() => {
        default_mock_store = mockStore({});
    });

    const mockChartSettings = () => {
        return (
            <TraderProviders store={default_mock_store}>
                <ChartSettings />
            </TraderProviders>
        );
    };

    it('should render component with media heading, icon for light mode (as it chosen by default) and checkbox with label', () => {
        render(mockChartSettings());

        expect(screen.getByText('Interval duration')).toBeInTheDocument();
        expect(screen.getByText('IntervalDurationDisabledLightIcon')).toBeInTheDocument();
        expect(screen.getByRole('checkbox')).toBeInTheDocument();
        expect(screen.getByText('Display remaining time for each interval')).toBeInTheDocument();
    });
    // it('should render component with icon for dark mode if is_dark_mode_on === true', () => {
    //     default_mock_store.ui.is_dark_mode_on = true;
    //     render(mockChartSettings());
    //     screen.debug();
    //     expect(screen.queryByText('IntervalDurationDisabledLightIcon')).not.toBeInTheDocument();
    //     expect(screen.getByText('IntervalDurationDisabledDarkIcon')).toBeInTheDocument();
    // });
});
