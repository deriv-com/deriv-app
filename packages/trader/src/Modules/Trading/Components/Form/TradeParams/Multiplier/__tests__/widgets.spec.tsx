import React from 'react';
import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import { mockStore } from '@deriv/stores';
import { AccumulatorOptionsWidget, MultiplierOptionsWidget, MultiplierAmountWidget } from '../widgets';
import TraderProviders from '../../../../../../../trader-providers';

const radio_group_options_modal = 'RadioGroupOptionsModal';
const multiplier_amount_modal = 'Multiplier Amount Modal';
const multipliers_info = 'Multipliers Info';
const multipliers_expiration = 'Multipliers Expiration';
const multipliers_expiration_modal = 'Multipliers Expiration Modal';

jest.mock('Modules/Trading/Containers/radio-group-options-modal', () =>
    jest.fn(prop => (
        <div data-open={prop.is_open}>
            {radio_group_options_modal}
            <button onClick={prop.toggleModal}>Open Modal</button>
        </div>
    ))
);
jest.mock('Modules/Trading/Containers/Multiplier/multiplier-amount-modal', () =>
    jest.fn(({ is_open }) => (is_open ? multiplier_amount_modal : null))
);
jest.mock('Modules/Trading/Components/Form/TradeParams/Multiplier/expiration', () =>
    jest.fn(() => multipliers_expiration)
);
jest.mock('Modules/Trading/Components/Form/TradeParams/Multiplier/expiration-modal', () =>
    jest.fn(({ is_open }) => (is_open ? multipliers_expiration_modal : null))
);
jest.mock('Modules/Trading/Components/Form/TradeParams/Multiplier/info', () => jest.fn(() => multipliers_info));

describe('AccumulatorOptionsWidget', () => {
    let default_mocked_store: ReturnType<typeof mockStore>;

    beforeEach(() => {
        default_mocked_store = {
            ...mockStore({}),
            modules: {
                trade: {
                    growth_rate: 0.01,
                    has_open_accu_contract: true,
                    tick_size_barrier_percentage: '',
                },
            },
        };
    });

    const mockAccumulatorOptionsWidget = () => {
        return (
            <TraderProviders store={default_mocked_store}>
                <AccumulatorOptionsWidget />
            </TraderProviders>
        );
    };

    it('should render component with extra tooltip', () => {
        render(mockAccumulatorOptionsWidget());

        expect(screen.getByText(/1%/i)).toBeInTheDocument();
        expect(screen.getByTestId(/dt_popover_wrapper/i)).toBeInTheDocument();
    });
    it('should render tooltip with text if user click on info icon, but should not open RadioGroupOptionsModal', () => {
        render(mockAccumulatorOptionsWidget());

        const info_icon = screen.getByTestId(/dt_popover_wrapper/i);
        userEvent.click(info_icon);

        expect(screen.getByText(/Your stake will grow/i)).toBeInTheDocument();
        expect(screen.getByText(radio_group_options_modal)).toHaveAttribute('data-open', 'false');
    });
    it('if Accumulator contract is not open, user is able to open RadioGroupOptionsModal', () => {
        default_mocked_store.modules.trade.has_open_accu_contract = false;
        render(mockAccumulatorOptionsWidget());

        userEvent.click(screen.getByText('Open Modal'));

        expect(screen.getByText(radio_group_options_modal)).toHaveAttribute('data-open', 'true');
    });
});

describe('MultiplierOptionsWidget', () => {
    let default_mocked_store: ReturnType<typeof mockStore>;

    beforeEach(() => {
        default_mocked_store = {
            ...mockStore({}),
            modules: {
                trade: {
                    multiplier: 10,
                    symbol: '1HZ150V',
                },
            },
        };
    });

    const mockMultiplierOptionsWidget = () => {
        return (
            <TraderProviders store={default_mocked_store}>
                <MultiplierOptionsWidget />
            </TraderProviders>
        );
    };

    it('should render component with multipliers value', () => {
        render(mockMultiplierOptionsWidget());

        expect(screen.getByText(/x10/i)).toBeInTheDocument();
    });
    it('should open RadioGroupOptionsModal if user clicked on Multiplier mobile widget', () => {
        render(mockMultiplierOptionsWidget());

        expect(screen.getByText(radio_group_options_modal)).toHaveAttribute('data-open', 'false');
        userEvent.click(screen.getByText(/x10/i));

        expect(screen.getByText(radio_group_options_modal)).toHaveAttribute('data-open', 'true');
    });
});

describe('<MultiplierAmountWidget />', () => {
    let default_mocked_store: ReturnType<typeof mockStore>;

    beforeEach(() => {
        default_mocked_store = {
            ...mockStore({}),
            modules: {
                trade: {
                    amount: 10,
                    expiration: 1701215999,
                    currency: 'USD',
                    is_crypto_multiplier: false,
                },
            },
        };
    });

    const mockMultiplierAmountWidget = () => {
        return (
            <TraderProviders store={default_mocked_store}>
                <MultiplierAmountWidget />
            </TraderProviders>
        );
    };

    it('should render only amount of money and Multipliers Info if it is not crypto', () => {
        render(mockMultiplierAmountWidget());

        expect(screen.getByText(/10.00 USD/i)).toBeInTheDocument();
        expect(screen.getByText(multipliers_info)).toBeInTheDocument();

        expect(screen.queryByText(multipliers_expiration)).not.toBeInTheDocument();
        expect(screen.queryByText(multiplier_amount_modal)).not.toBeInTheDocument();
        expect(screen.queryByText(multipliers_expiration_modal)).not.toBeInTheDocument();
    });
    it('should render Multiplier Amount Modal if user clicked on amount button', () => {
        render(mockMultiplierAmountWidget());

        expect(screen.queryByText(multiplier_amount_modal)).not.toBeInTheDocument();
        userEvent.click(screen.getByText(/10.00 USD/i));

        expect(screen.getByText(multiplier_amount_modal)).toBeInTheDocument();
    });
    it('should render amount of money, Multipliers Info, Multipliers Expiration if it is crypto', () => {
        default_mocked_store.modules.trade.is_crypto_multiplier = true;
        render(mockMultiplierAmountWidget());

        expect(screen.getByText(/10.00 USD/i)).toBeInTheDocument();
        expect(screen.getByText(multipliers_info)).toBeInTheDocument();
        expect(screen.getByText(multipliers_expiration)).toBeInTheDocument();
    });
    it('should render Multipliers Expiration Modal if it is crypto and user clicked on Expiration button', () => {
        default_mocked_store.modules.trade.is_crypto_multiplier = true;
        render(mockMultiplierAmountWidget());

        expect(screen.queryByText(multipliers_expiration_modal)).not.toBeInTheDocument();
        userEvent.click(screen.getByText('Expires on'));

        expect(screen.getByText(multipliers_expiration_modal)).toBeInTheDocument();
    });
});
