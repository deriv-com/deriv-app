import React from 'react';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import { mockStore } from '@deriv/stores';
import TraderProviders from '../../../../../../trader-providers';
import CancelDeal from '../cancel-deal-mobile';

const default_mocked_props = {
    has_cancellation: false,
    has_take_profit: false,
    has_stop_loss: false,
    onChangeMultiple: jest.fn(),
    cancellation_duration: '60m',
};
const default_mock_store = {
    modules: {
        trade: {
            cancellation_range_list: [],
        },
    },
};

describe('<CancelDeal />', () => {
    const mockCancelDeal = (mocked_store, mocked_props) => {
        return (
            <TraderProviders store={mocked_store}>
                <CancelDeal {...mocked_props} />
            </TraderProviders>
        );
    };

    it('should render the component with checkbox and popover by default', () => {
        const mock_root_store = mockStore(default_mock_store);
        render(mockCancelDeal(mock_root_store, default_mocked_props));

        const info_icon = screen.getByTestId(/dt_popover_wrapper/i);
        userEvent.hover(info_icon);

        expect(screen.getByText(/Deal cancellation/i)).toBeInTheDocument();
        expect(screen.queryByText(/Cancel your trade/i)).toBeInTheDocument();
        expect(screen.queryByText(/Take profit/i)).not.toBeInTheDocument();
    });
    it('should render <RadioGroup /> if has_cancellation === true and cancellation_range_list contains proper info', () => {
        const new_mocked_props = { ...default_mocked_props, has_cancellation: true };
        const new_mock_store = { ...default_mock_store };
        new_mock_store.modules = {
            trade: {
                cancellation_range_list: [{ value: '60m', text: 'test text' }],
            },
        };
        const mock_root_store = mockStore(new_mock_store);
        render(mockCancelDeal(mock_root_store, new_mocked_props));

        expect(screen.getByText(/test text/i)).toBeInTheDocument();
    });
});
