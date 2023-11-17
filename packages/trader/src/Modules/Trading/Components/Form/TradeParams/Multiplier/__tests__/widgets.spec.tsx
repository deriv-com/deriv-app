import React from 'react';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import { mockStore } from '@deriv/stores';
import { AccumulatorOptionsWidget, MultiplierOptionsWidget } from '../widgets';
import TraderProviders from '../../../../../../../trader-providers';
import { TCoreStores } from '@deriv/stores/types';

const default_mock_store_accumulators = {
    modules: {
        trade: {
            growth_rate: 0.01,
            has_open_accu_contract: true,
            tick_size_barrier: 0,
        },
    },
};
const default_mock_store_multipliers = {
    modules: {
        trade: {
            multiplier: 10,
            symbol: '1HZ150V',
        },
    },
};
const new_label = 'NEW!';
const radio_group_options_modal = 'RadioGroupOptionsModal';

jest.mock('Modules/Trading/Containers/radio-group-options-modal', () =>
    jest.fn(prop => (
        <div data-open={prop.is_open}>
            {radio_group_options_modal}
            <button onClick={prop.toggleModal}>Open Modal</button>
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
        render(mockAccumulatorOptionsWidget(mockStore(default_mock_store_accumulators)));

        expect(screen.getByText(/1%/i)).toBeInTheDocument();
        expect(screen.getByTestId(/dt_popover_wrapper/i)).toBeInTheDocument();
    });
    it('should render tooltip with text if user click on info icon, but should not open RadioGroupOptionsModal', () => {
        render(mockAccumulatorOptionsWidget(mockStore(default_mock_store_accumulators)));

        const info_icon = screen.getByTestId(/dt_popover_wrapper/i);
        userEvent.click(info_icon);

        expect(screen.getByText(/Your stake will grow/i)).toBeInTheDocument();
        expect(screen.getByText(radio_group_options_modal)).toHaveAttribute('data-open', 'false');
    });
    it('if Accum contract is not open, user is able to open RadioGroupOptionsModal', () => {
        const new_mock_store = { ...default_mock_store_accumulators };
        new_mock_store.modules.trade = {
            growth_rate: 0.01,
            has_open_accu_contract: false,
            tick_size_barrier: 0,
        };
        render(mockAccumulatorOptionsWidget(mockStore(new_mock_store)));

        userEvent.click(screen.getByText('Open Modal'));

        expect(screen.getByText(radio_group_options_modal)).toHaveAttribute('data-open', 'true');
    });
});

describe('MultiplierOptionsWidget', () => {
    const mockMultiplierOptionsWidget = (mocked_store: TCoreStores) => {
        return (
            <TraderProviders store={mocked_store}>
                <MultiplierOptionsWidget />
            </TraderProviders>
        );
    };

    it('should render component with multipliers value', () => {
        render(mockMultiplierOptionsWidget(mockStore(default_mock_store_multipliers)));

        expect(screen.getByText(/x10/i)).toBeInTheDocument();
    });
    it('should not render new! label if chosen symbol is not synthetic or is equal to Vol 150 (1 sec) or 250 (1 sec)', () => {
        render(mockMultiplierOptionsWidget(mockStore(default_mock_store_multipliers)));

        expect(screen.queryByText(new_label)).not.toBeInTheDocument();
    });
    it('should render new! label if chosen symbol is synthetic and is not equal to Vol 150 (1 sec) or 250 (1 sec)', () => {
        const new_mock_store = { ...default_mock_store_multipliers };
        new_mock_store.modules.trade.symbol = '1HZ100V';

        render(mockMultiplierOptionsWidget(mockStore(new_mock_store)));

        expect(screen.getByText(new_label)).toBeInTheDocument();
    });
    it('should open RadioGroupOptionsModal if user clicked on Multiplier mobile widget', () => {
        render(mockMultiplierOptionsWidget(mockStore(default_mock_store_multipliers)));

        expect(screen.getByText(radio_group_options_modal)).toHaveAttribute('data-open', 'false');
        userEvent.click(screen.getByText(/x10/i));

        expect(screen.getByText(radio_group_options_modal)).toHaveAttribute('data-open', 'true');
    });
});
