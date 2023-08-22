import React from 'react';
import { screen, render } from '@testing-library/react';
import { mockStore } from '@deriv/stores';
import TraderProviders from '../../../../trader-providers';
import ProgressSliderStream from '../progress-slider-stream';

jest.mock('@deriv/components', () => ({
    ...jest.requireActual('@deriv/components'),
    ProgressSlider: () => <div>Mocked Progress Slider</div>,
}));

const contract_info = {
    contract_type: 'TEST',
    date_expiry: 1222222224,
    date_start: 1222222222,
    tick_count: 2,
    tick_stream: [
        { epoch: 1, tick: 1, tick_display_value: '300' },
        { epoch: 2, tick: 2, tick_display_value: '302' },
    ],
};

describe('<ProgressSliderStream />', () => {
    const mockProgressSliderStream = (mocked_store, contract_info = null) => {
        return (
            <TraderProviders store={mocked_store}>
                <ProgressSliderStream contract_info={contract_info} />
            </TraderProviders>
        );
    };

    it('should not render <ProgressSliderStream /> if contract_info is falsy', () => {
        const mock_root_store = mockStore({});
        render(mockProgressSliderStream(mock_root_store));

        expect(screen.queryByText('Mocked Progress Slider')).not.toBeInTheDocument();
    });
    it('should render <ProgressSliderStream /> if contract_info was passed in props', () => {
        const mock_root_store = mockStore({});
        render(mockProgressSliderStream(mock_root_store, contract_info));

        expect(screen.getByText('Mocked Progress Slider')).toBeInTheDocument();
    });
});
