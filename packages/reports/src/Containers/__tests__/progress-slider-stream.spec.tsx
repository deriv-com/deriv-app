import React from 'react';
import { mockContractInfo, TContractInfo } from '@deriv/shared';
import { mockStore } from '@deriv/stores';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ReportsProviders from '../../reports-providers';
import ProgressSliderStream from '../progress-slider-stream';

const progress_slider = 'ProgressSlider';

jest.mock('@deriv/components', () => ({
    ...jest.requireActual('@deriv/components'),
    ProgressSlider: jest.fn(() => <div>{progress_slider}</div>),
}));

describe('ProgressSliderStream', () => {
    let mocked_store = mockStore({});
    const mocked_props = { contract_info: mockContractInfo({ tick_count: 10 }) as Required<TContractInfo> };

    beforeEach(() => {
        mocked_store = mockStore({});
    });

    const mockedProgressSliderStream = () => (
        <ReportsProviders store={mocked_store}>
            <MemoryRouter>
                <ProgressSliderStream {...mocked_props} />
            </MemoryRouter>
        </ReportsProviders>
    );

    it('should render ProgressSlider', () => {
        render(mockedProgressSliderStream());
        expect(screen.getByText(progress_slider)).toBeInTheDocument();
    });

    it('should be empty if server_time is undefined', () => {
        mocked_store.common.server_time = undefined as unknown as moment.Moment;
        const { container } = render(mockedProgressSliderStream());
        expect(container).toBeEmptyDOMElement();
    });

    it('should render an empty div if contract_info is undefined', () => {
        mocked_props.contract_info = undefined as unknown as Required<TContractInfo>;
        const { container } = render(mockedProgressSliderStream());
        expect(container).not.toBeEmptyDOMElement();
        expect(screen.queryByText(progress_slider)).not.toBeInTheDocument();
    });
});
