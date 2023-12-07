import React from 'react';
import { render, screen } from '@testing-library/react';
import { StoreProvider, mockStore } from '@deriv/stores';
import ControlWidgets from '../control-widgets';

jest.mock('Modules/SmartChart', () => ({
    ...jest.requireActual('Modules/SmartChart'),
    ChartMode: () => <div>MockedChartMode</div>,
    DrawTools: () => <div>MockedDrawTools</div>,
    Share: () => <div>MockedShare</div>,
    StudyLegend: () => <div>MockedStudyLegend</div>,
    Views: () => <div>MockedViews</div>,
}));

describe('<ControlWidgets />', () => {
    const store = mockStore({});
    const mockedControlWidgets = () => {
        return (
            <StoreProvider store={store}>
                <ControlWidgets />
            </StoreProvider>
        );
    };

    it('Should render all mocked widgets', () => {
        render(mockedControlWidgets());
        expect(screen.getByText(/mockedchartmode/i)).toBeInTheDocument();
        expect(screen.getByText(/mockeddrawtools/i)).toBeInTheDocument();
        expect(screen.getByText(/mockedshare/i)).toBeInTheDocument();
        expect(screen.getByText(/mockedstudylegend/i)).toBeInTheDocument();
        expect(screen.getByText(/mockedviews/i)).toBeInTheDocument();
    });
});
