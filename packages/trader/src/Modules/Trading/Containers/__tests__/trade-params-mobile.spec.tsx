import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mockStore } from '@deriv/stores';
import TradeParamsModal, { LastDigitMobile, BarrierMobile } from '../trade-params-mobile';
import TraderProviders from '../../../../trader-providers';

const mock_default_props = {
    is_open: true,
    toggleModal: jest.fn(),
    tab_index: 0,
};
const default_mock_store = {
    modules: {
        trade: {
            amount: 10,
            basis_list: [{ text: 'basis', value: '1' }],
            basis: '1',
            duration: 12301911,
            duration_unit: 'm',
            duration_units_list: [{ text: '4', value: 'm' }],
            expiry_epoch: '123762300',
            form_components: ['duration', 'amount'],
            is_turbos: false,
        },
    },
};

const amount_mobile = 'Amount Mobile';
const amount_error = 'Amount error';
const duration_mobile = 'Duration Mobile';
const duration_error = 'Duration error';

jest.mock('@deriv/components', () => ({
    ...jest.requireActual('@deriv/components'),
    Modal: jest.fn(({ children, height }) => <div data-testid={height}>{children}</div>),
    ThemedScrollbars: jest.fn(({ children }) => <div>{children}</div>),
    Div100vhContainer: jest.fn(({ children }) => <div>{children}</div>),
    Tabs: jest.fn(({ children }) => <div>{children}</div>),
}));
jest.mock('Modules/Trading/Components/Form/TradeParams/amount-mobile', () =>
    jest.fn(
        ({ amount_tab_idx, has_duration_error, stake_value, setAmountTabIdx, setAmountError, setSelectedAmount }) => (
            <div>
                <div>{amount_mobile}</div>
                <div>{amount_tab_idx}</div>
                <div>{stake_value}</div>
                <div>{has_duration_error && duration_error}</div>
                <button onClick={() => setAmountTabIdx(1)}>setAmountTabIdx</button>
                <button onClick={() => setSelectedAmount('stake', 20)}>setSelectedAmount</button>
                <button onClick={() => setAmountError(true)}>setAmountError</button>
            </div>
        )
    )
);
jest.mock('Modules/Trading/Components/Form/TradeParams/Duration/duration-mobile', () =>
    jest.fn(({ has_amount_error, setDurationError }) => (
        <div>
            <div>{duration_mobile}</div>
            <div>{has_amount_error && amount_error}</div>
            <button onClick={() => setDurationError(true)}>setDurationError</button>
        </div>
    ))
);
jest.mock('Modules/Trading/Components/Form/TradeParams/last-digit', () => jest.fn(() => <div>LastDigit</div>));
jest.mock('Modules/Trading/Components/Form/TradeParams/barrier', () => jest.fn(() => <div>Barrier</div>));

describe('<TradeParamsModal />', () => {
    const mockTradeParamsModal = () => {
        return (
            <TraderProviders store={mockStore(default_mock_store)}>
                <TradeParamsModal {...mock_default_props} />
            </TraderProviders>
        );
    };

    it('should not render children components if the form_components is an empty array', () => {
        default_mock_store.modules.trade.form_components = [];
        render(mockTradeParamsModal());

        expect(screen.queryByText(duration_mobile)).not.toBeInTheDocument();
        expect(screen.queryByText(amount_mobile)).not.toBeInTheDocument();
    });

    it('should render DurationMobile and AmountMobile component if they are in the form_components array', () => {
        default_mock_store.modules.trade.form_components = ['amount', 'duration'];
        render(mockTradeParamsModal());

        expect(screen.getByText(duration_mobile)).toBeInTheDocument();
        expect(screen.getByText(amount_mobile)).toBeInTheDocument();
    });

    it('function setAmountTabIdx call should change amount_tab_idx', () => {
        const { rerender } = render(mockTradeParamsModal());
        expect(screen.queryByText('1')).not.toBeInTheDocument();

        userEvent.click(screen.getByText('setAmountTabIdx'));
        rerender(mockTradeParamsModal());

        expect(screen.getByText('1')).toBeInTheDocument();
    });

    it('function setSelectedAmount call should change stake_value', () => {
        const { rerender } = render(mockTradeParamsModal());
        expect(screen.getByText('10')).toBeInTheDocument();

        userEvent.click(screen.getByText('setSelectedAmount'));
        rerender(mockTradeParamsModal());

        expect(screen.getByText('20')).toBeInTheDocument();
    });

    it('function setAmountError call should change amount_error', () => {
        const { rerender } = render(mockTradeParamsModal());
        expect(screen.queryByText(amount_error)).not.toBeInTheDocument();

        userEvent.click(screen.getByText('setAmountError'));
        rerender(mockTradeParamsModal());

        expect(screen.getByText(amount_error)).toBeInTheDocument();
    });

    it('function setDurationError call should change amount_error', () => {
        const { rerender } = render(mockTradeParamsModal());
        expect(screen.queryByText(duration_error)).not.toBeInTheDocument();

        userEvent.click(screen.getByText('setDurationError'));
        rerender(mockTradeParamsModal());

        expect(screen.getByText(duration_error)).toBeInTheDocument();
    });
});

describe('<LastDigitMobile />', () => {
    const mockLastDigitMobile = () => {
        return (
            <TraderProviders store={mockStore(default_mock_store)}>
                <LastDigitMobile />
            </TraderProviders>
        );
    };

    it('should not render LastDigit component if it is not in the form_components array', () => {
        const { container } = render(mockLastDigitMobile());

        expect(container).toBeEmptyDOMElement();
    });

    it('should render LastDigit component if it is in the form_components array', () => {
        default_mock_store.modules.trade.form_components = ['last_digit'];
        render(mockLastDigitMobile());

        expect(screen.getByText('LastDigit')).toBeInTheDocument();
    });
});

describe('<BarrierMobile />', () => {
    const mockLastDigitMobile = () => {
        return (
            <TraderProviders store={mockStore(default_mock_store)}>
                <BarrierMobile />
            </TraderProviders>
        );
    };

    it('should not render BarrierMobile component if it is not in the form_components array', () => {
        const { container } = render(mockLastDigitMobile());

        expect(container).toBeEmptyDOMElement();
    });

    it('should render BarrierMobile component if it is in the form_components array', () => {
        default_mock_store.modules.trade.form_components = ['barrier'];
        render(mockLastDigitMobile());

        expect(screen.getByText('Barrier')).toBeInTheDocument();
    });
});
