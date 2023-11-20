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
    const store_config = mockStore({});
    const renderComponent = ({ mocked_store_props = store_config }) =>
        render(
            <StoreProvider store={mocked_store_props}>
                <ControlWidgets />
            </StoreProvider>
        );
    const mocked_store_props = mockStore({
        contract_trade: {
            updateChartType: jest.fn(),
            updateGranularity: jest.fn(),
        },
    });

    it('Should render all mocked widgets', () => {
        renderComponent({ mocked_store_props });
        expect(screen.getByText(/mockedchartmode/i)).toBeInTheDocument();
        expect(screen.getByText(/mockeddrawtools/i)).toBeInTheDocument();
        expect(screen.getByText(/mockedshare/i)).toBeInTheDocument();
        expect(screen.getByText(/mockedstudylegend/i)).toBeInTheDocument();
        expect(screen.getByText(/mockedviews/i)).toBeInTheDocument();
    });
});
