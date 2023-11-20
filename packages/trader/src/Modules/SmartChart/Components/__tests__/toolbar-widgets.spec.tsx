import React from 'react';
import { render, screen } from '@testing-library/react';
import ToolbarWidgets from '../toolbar-widgets';
import { isDesktop } from '@deriv/shared';

jest.mock('Modules/SmartChart', () => ({
    ...jest.requireActual('Modules/SmartChart'),
    ChartMode: () => <div>MockedChartMode</div>,
    DrawTools: () => <div>MockedDrawTools</div>,
    Share: () => <div>MockedShare</div>,
    StudyLegend: () => <div>MockedStudyLegend</div>,
    Views: () => <div>MockedViews</div>,
    ToolbarWidget: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    isDesktop: jest.fn(() => false),
}));

describe('<ToolBarWidgets />', () => {
    let mocked_props: React.ComponentProps<typeof ToolbarWidgets>;
    beforeEach(() => {
        mocked_props = {
            is_mobile: true,
            position: 'top',
            updateChartType: jest.fn(),
            updateGranularity: jest.fn(),
        };
    });
    it('Should render only mocked chart mode when isDestop is false', () => {
        render(<ToolbarWidgets {...mocked_props} />);
        expect(screen.getByText(/mockedchartmode/i)).toBeInTheDocument();
        expect(screen.queryByText(/mockeddrawtools/i)).not.toBeInTheDocument();
        expect(screen.queryByText(/mockedshare/i)).not.toBeInTheDocument();
        expect(screen.queryByText(/mockedstudylegend/i)).not.toBeInTheDocument();
        expect(screen.queryByText(/mockedviews/i)).not.toBeInTheDocument();
    });
    it('Should render all mocked widgets when isDestop is true', () => {
        (isDesktop as jest.Mock).mockReturnValue(true);
        render(<ToolbarWidgets {...mocked_props} />);
        expect(screen.getByText(/mockedchartmode/i)).toBeInTheDocument();
        expect(screen.getByText(/mockeddrawtools/i)).toBeInTheDocument();
        expect(screen.getByText(/mockedshare/i)).toBeInTheDocument();
        expect(screen.getByText(/mockedstudylegend/i)).toBeInTheDocument();
        expect(screen.getByText(/mockedviews/i)).toBeInTheDocument();
    });
});
