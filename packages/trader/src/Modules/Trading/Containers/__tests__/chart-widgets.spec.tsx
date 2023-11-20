import React from 'react';
import { screen, render } from '@testing-library/react';
import { ChartBottomWidgets, ChartTopWidgets, DigitsWidget } from '../chart-widgets';

jest.mock('../chart-widgets.tsx', () => ({
    ...jest.requireActual('../chart-widgets.tsx'),
    DigitsWidget: () => <div>MockedDigitsWidget</div>,
    ChartTopWidgets: () => <div>MockedChartTopWidgets</div>,
    ChartBottomWidgets: () => <div>MockedChartBottomWidgets</div>,
}));

describe('<DigitsWidget />', () => {
    it('Should render mocked digits widget', () => {
        render(<DigitsWidget digits={[0, 1, 2, 3, 4, 5]} tick={{ pip_size: 1 }} />);
        expect(screen.getByText(/mockeddigitswidget/i)).toBeInTheDocument();
    });
});

describe('<ChartTopWidgets>', () => {
    it('Should render mocked ChartTopWidget', () => {
        render(<ChartTopWidgets open_market={{ category: '', subcategory: '' }} open={true} />);
        expect(screen.getByText(/mockedcharttopwidgets/i)).toBeInTheDocument();
    });
});

describe('<ChartBottomWidgets>', () => {
    it('Should render mocked ChartBottomWidgets', () => {
        render(
            <ChartBottomWidgets digits={[0, 1, 2, 3, 4, 5]} tick={{ pip_size: 1 }} show_accumulators_stats={false} />
        );
        expect(screen.getByText(/mockedchartbottomwidgets/i)).toBeInTheDocument();
    });
});
