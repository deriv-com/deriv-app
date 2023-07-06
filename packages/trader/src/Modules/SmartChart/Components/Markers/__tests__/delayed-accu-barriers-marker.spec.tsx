import React from 'react';
import { render, screen } from '@testing-library/react';
import DelayedAccuBarriersMarker from '../delayed-accu-barriers-marker';

describe('DelayedAccuBarriersMarker', () => {
    const getMarkerComponentInnerHTML = (price_array: number[]) =>
        `MockedMarkerComponent with price_array: ${JSON.stringify(price_array)}`;
    const mocked_props = {
        epoch_array: [1111111111, 2222222222],
        contract_info: { high_barrier: '4444.44', low_barrier: '2222.22' },
        granularity: 0,
        is_dark_theme: false,
        is_in_contract_details: true,
        marker_component: jest.fn(({ price_array }) => <div>{getMarkerComponentInnerHTML(price_array)}</div>),
        previous_spot_time: 1111.11,
        price_array: [4444.44, 2222.22],
        type: 'TickContract',
    };
    it('should render marker_component properly', () => {
        render(<DelayedAccuBarriersMarker {...mocked_props} />);
        const marker_component_text = screen.getByText(getMarkerComponentInnerHTML(mocked_props.price_array));
        expect(marker_component_text).toBeInTheDocument();
    });
});
