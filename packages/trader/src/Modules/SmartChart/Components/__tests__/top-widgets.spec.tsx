import React from 'react';
import ReactDOM from 'react-dom';
import { render, screen } from '@testing-library/react';
import TopWidgets from '../top-widgets';
import { isMobile, isDesktop } from '@deriv/shared';

jest.mock('../recent-trade-info.tsx', () => jest.fn(() => <div>MockedRecentTradeInfo</div>));
jest.mock('Modules/SmartChart', () => ({
    ...jest.requireActual('Modules/SmartChart'),
    ChartTitle: () => <div>MockedChartTitle</div>,
}));
jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    isMobile: jest.fn(() => false),
    isDesktop: jest.fn(() => true),
}));

describe('<TopWidgets />', () => {
    let mocked_props: React.ComponentProps<typeof TopWidgets>;
    beforeAll(() => {
        ReactDOM.createPortal = jest.fn(component => {
            return component as React.ReactPortal;
        });
    });
    beforeEach(() => {
        mocked_props = {
            InfoBox: <div>Info Box Content</div>,
            is_mobile: false,
            is_title_enabled: true,
            y_axis_width: 100,
            theme: 'dark',
            open_market: {
                category: 'category',
            },
            open: true,
            is_digits_widget_active: true,
        };
    });
    it('Should render info box and mocked chart title and should not render toast notification or recent trade info for Desktop', () => {
        render(<TopWidgets {...mocked_props} />);
        const chart_title = screen.getByText(/mockedcharttitle/i);
        expect(screen.getByText(/info box content/i)).toBeInTheDocument();
        expect(chart_title).toBeInTheDocument();
    });
    it('Should render only one mocked chart title and toast notification for Mobile', () => {
        mocked_props.is_mobile = true;
        (isMobile as jest.Mock).mockReturnValue(true);
        (isDesktop as jest.Mock).mockReturnValue(false);
        render(<TopWidgets {...mocked_props} />);
        const chart_title = screen.getByText(/mockedcharttitle/i);
        expect(chart_title).toBeInTheDocument();
    });
    it('Should render mocked recent trade info for Mobile when digits widget is not active', () => {
        mocked_props.is_digits_widget_active = false;
        mocked_props.is_mobile = true;
        (isMobile as jest.Mock).mockReturnValue(true);
        (isDesktop as jest.Mock).mockReturnValue(false);
        render(<TopWidgets {...mocked_props} />);
        expect(screen.getByText(/mockedrecenttradeinfo/i)).toBeInTheDocument();
    });
});
