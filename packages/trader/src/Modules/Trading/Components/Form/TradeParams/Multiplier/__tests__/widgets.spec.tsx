import React from 'react';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import { mockStore } from '@deriv/stores';
import TraderProviders from '../../../../../../../trader-providers';
import { TCoreStores } from '@deriv/stores/types';
import { AccumulatorOptionsWidget } from '../widgets';

const default_mock_store = {
    modules: {
        trade: {
            growth_rate: 0.01,
            has_open_accu_contract: true,
            tick_size_barrier: 0,
        },
    },
};

jest.mock('Modules/Trading/Containers/radio-group-options-modal', () =>
    jest.fn(prop => (
        <div data-open={prop.is_open} onClick={prop.toggleModal}>
            RadioGroupOptionsModal component
        </div>
    ))
);

describe('AccumulatorOptionsWidget', () => {
    const mockAccumulatorOptionsWidget = (mocked_store: TCoreStores) => {
        return (
            <TraderProviders store={mocked_store}>
                <AccumulatorOptionsWidget />
            </TraderProviders>
        );
    };

    it('should render component with extra tooltip', () => {
        const mock_root_store = mockStore(default_mock_store);
        render(mockAccumulatorOptionsWidget(mock_root_store));

        expect(screen.getByText(/1%/i)).toBeInTheDocument();
        expect(screen.getByTestId(/dt_popover_wrapper/i)).toBeInTheDocument();
    });
    it('should render tooltip with text if user click on info icon, but should not open RadioGroupOptionsModal', () => {
        const mock_root_store = mockStore(default_mock_store);
        render(mockAccumulatorOptionsWidget(mock_root_store));

        const info_icon = screen.getByTestId(/dt_popover_wrapper/i);
        userEvent.click(info_icon);

        expect(screen.getByText(/Your stake will grow/i)).toBeInTheDocument();
        expect(screen.getByText(/RadioGroupOptionsModal/i)).toHaveAttribute('data-open', 'false');
    });
    it('if Accum contract is not open, user is able to open RadioGroupOptionsModal', () => {
        const new_mock_store = { ...default_mock_store };
        new_mock_store.modules.trade = {
            growth_rate: 0.01,
            has_open_accu_contract: false,
            tick_size_barrier: 0,
        };
        const mock_root_store = mockStore(new_mock_store);
        render(mockAccumulatorOptionsWidget(mock_root_store));

        const toggle_button = screen.getByText(/RadioGroupOptionsModal/i);
        userEvent.click(toggle_button);

        expect(screen.getByText(/RadioGroupOptionsModal/i)).toHaveAttribute('data-open', 'true');
    });
});
