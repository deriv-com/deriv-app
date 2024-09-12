import React from 'react';
import { render, screen } from '@testing-library/react';
import ToolbarWidgets from '../toolbar-widgets';
import { useDevice } from '@deriv-com/ui';
import { isDesktopOs } from '@deriv/shared';

jest.mock('Modules/SmartChart', () => ({
    ...jest.requireActual('Modules/SmartChart'),
    ChartMode: () => <div>MockedChartMode</div>,
    DrawTools: () => <div>MockedDrawTools</div>,
    Share: () => <div>MockedShare</div>,
    StudyLegend: () => <div>MockedStudyLegend</div>,
    Views: () => <div>MockedViews</div>,
    ToolbarWidget: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn(() => ({ isMobile: true })),
}));

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    isDesktopOs: jest.fn(() => false),
}));

describe('<ToolBarWidgets />', () => {
    let mocked_props: React.ComponentProps<typeof ToolbarWidgets>;
    beforeEach(() => {
        mocked_props = {
            position: 'top',
            updateChartType: jest.fn(),
            updateGranularity: jest.fn(),
        };
    });
    it('Should render only mocked chart mode when isMobile is true', () => {
        render(<ToolbarWidgets {...mocked_props} />);
        expect(screen.getByText(/mockedchartmode/i)).toBeInTheDocument();
        expect(screen.queryByText(/mockeddrawtools/i)).not.toBeInTheDocument();
        expect(screen.queryByText(/mockedshare/i)).not.toBeInTheDocument();
        expect(screen.queryByText(/mockedstudylegend/i)).not.toBeInTheDocument();
        expect(screen.queryByText(/mockedviews/i)).not.toBeInTheDocument();
    });
    it('Should render all mocked widgets when isDesktop is true', () => {
        (isDesktopOs as jest.Mock).mockReturnValue(true);
        (useDevice as jest.Mock).mockReturnValueOnce({ isMobile: false });
        render(<ToolbarWidgets {...mocked_props} />);
        expect(screen.getByText(/mockedchartmode/i)).toBeInTheDocument();
        expect(screen.getByText(/mockeddrawtools/i)).toBeInTheDocument();
        expect(screen.getByText(/mockedshare/i)).toBeInTheDocument();
        expect(screen.getByText(/mockedstudylegend/i)).toBeInTheDocument();
        expect(screen.getByText(/mockedviews/i)).toBeInTheDocument();
    });
});
