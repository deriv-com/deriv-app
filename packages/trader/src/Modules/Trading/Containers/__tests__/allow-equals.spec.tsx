import React from 'react';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import { mockStore } from '@deriv/stores';
import { TCoreStores } from '@deriv/stores/types';
import TraderProviders from '../../../../trader-providers';
import AllowEquals from '../allow-equals';

const default_mock_store = {
    modules: {
        trade: {
            is_equal: 0,
            has_equals_only: false,
            onChange: jest.fn(),
        },
    },
};

describe('<AllowEquals />', () => {
    const mockAllowEquals = (mocked_store: TCoreStores) => {
        return (
            <TraderProviders store={mocked_store}>
                <AllowEquals />
            </TraderProviders>
        );
    };
    it('should render component', () => {
        const mock_root_store = mockStore(default_mock_store);
        render(mockAllowEquals(mock_root_store));

        expect(screen.getByText(/Win payout/i)).toBeInTheDocument();
    });
    it('should call onChange function if checkbox was clicked', () => {
        const mock_root_store = mockStore(default_mock_store);
        render(mockAllowEquals(mock_root_store));

        const checkbox = screen.getByText(/Equals/i);
        userEvent.click(checkbox);

        expect(default_mock_store.modules.trade.onChange).toBeCalled();
    });
});
