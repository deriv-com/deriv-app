import React from 'react';
import { screen, render } from '@testing-library/react';
import { ChartBottomWidgets, ChartTopWidgets, DigitsWidget, InfoBoxWidget } from '../contract-replay-widget';

jest.mock('../contract-replay-widget.tsx', () => ({
    ...jest.requireActual('../contract-replay-widget.tsx'),
    DigitsWidget: () => <div>MockedDigitsWidget</div>,
    InfoBoxWidget: () => <div>MockedInfoBoxWidget</div>,
    ChartTopWidgets: () => <div>MockedChartTopWidgets</div>,
    ChartBottomWidgets: () => <div>MockedChartBottomWidgets</div>,
}));

describe('<DigitsWidget />', () => {
    it('Should render mocked digits widget', () => {
        render(<DigitsWidget />);
        expect(screen.getByText(/mockeddigitswidget/i)).toBeInTheDocument();
    });
});

describe('<InfoBoxWidget />', () => {
    it('Should render mocked info box widget', () => {
        render(<InfoBoxWidget />);
        expect(screen.getByText(/mockedinfoboxwidget/i)).toBeInTheDocument();
    });
});

describe('<ChartTopWidgets>', () => {
    it('Should render mocked ChartTopWidget', () => {
        render(<ChartTopWidgets />);
        expect(screen.getByText(/mockedcharttopwidgets/i)).toBeInTheDocument();
    });
});

describe('<ChartBottomWidgets>', () => {
    it('Should render mocked ChartBottomWidgets', () => {
        render(<ChartBottomWidgets />);
        expect(screen.getByText(/mockedchartbottomwidgets/i)).toBeInTheDocument();
    });
});
