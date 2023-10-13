import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mockStore } from '@deriv/stores';
import { TCoreStores } from '@deriv/stores/types';
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
            is_vanilla: false,
            is_turbos: false,
        },
    },
};

jest.mock('@deriv/components', () => ({
    ...jest.requireActual('@deriv/components'),
    Modal: jest.fn(({ children, height }) => <div data-testid={height}>{children}</div>),
    ThemedScrollbars: jest.fn(({ children }) => <div>{children}</div>),
    Div100vhContainer: jest.fn(({ children }) => <div>{children}</div>),
    Tabs: jest.fn(({ children }) => <div>{children}</div>),
}));
jest.mock('Modules/Trading/Components/Form/TradeParams/amount-mobile', () =>
    jest.fn(props => (
        <div>
            <p>AmountMobile</p>
            <p>{props.amount_tab_idx}</p>
            <p>{props.stake_value}</p>
            <p>{props.has_duration_error && 'Duration error'}</p>
            <button onClick={() => props.setAmountTabIdx(1)}>setAmountTabIdx</button>
            <button onClick={() => props.setSelectedAmount('stake', 20)}>setSelectedAmount</button>
            <button onClick={() => props.setAmountError(true)}>setAmountError</button>
        </div>
    ))
);
jest.mock('Modules/Trading/Components/Form/TradeParams/Duration/duration-mobile', () =>
    jest.fn(props => (
        <div>
            <p>DurationMobile</p>
            <p>{props.has_amount_error && 'Amount error'}</p>
            <button onClick={() => props.setDurationError(true)}>setDurationError</button>
        </div>
    ))
);
jest.mock('Modules/Trading/Components/Form/TradeParams/last-digit', () => jest.fn(() => <div>LastDigit</div>));
jest.mock('Modules/Trading/Components/Form/TradeParams/barrier', () => jest.fn(() => <div>Barrier</div>));

describe('<TradeParamsModal />', () => {
    const mockTradeParamsModal = (
        mocked_store: TCoreStores,
        mocked_params: React.ComponentProps<typeof TradeParamsModal>
    ) => {
        return (
            <TraderProviders store={mocked_store}>
                <TradeParamsModal {...mocked_params} />
            </TraderProviders>
        );
    };

    it('should not render children components if the form_components is an empty array', () => {
        default_mock_store.modules.trade.form_components = [];
        render(mockTradeParamsModal(mockStore(default_mock_store), mock_default_props));

        expect(screen.queryByText('DurationMobile')).not.toBeInTheDocument();
        expect(screen.queryByText('AmountMobile')).not.toBeInTheDocument();
    });

    it('should render DurationMobile and AmountMobile component if they are in the form_components array', () => {
        default_mock_store.modules.trade.form_components = ['amount', 'duration'];
        render(mockTradeParamsModal(mockStore(default_mock_store), mock_default_props));

        expect(screen.getByText('DurationMobile')).toBeInTheDocument();
        expect(screen.getByText('AmountMobile')).toBeInTheDocument();
    });

    it('should render Modal with specific height if is_vanilla === true', () => {
        default_mock_store.modules.trade.is_vanilla = true;
        render(mockTradeParamsModal(mockStore(default_mock_store), mock_default_props));

        expect(screen.getByTestId('53.8rem')).toBeInTheDocument();
    });

    it('function setAmountTabIdx call should change amount_tab_idx', () => {
        const { rerender } = render(mockTradeParamsModal(mockStore(default_mock_store), mock_default_props));
        expect(screen.queryByText('1')).not.toBeInTheDocument();

        userEvent.click(screen.getByText('setAmountTabIdx'));
        rerender(mockTradeParamsModal(mockStore(default_mock_store), mock_default_props));

        expect(screen.getByText('1')).toBeInTheDocument();
    });

    it('function setSelectedAmount call should change stake_value', () => {
        const { rerender } = render(mockTradeParamsModal(mockStore(default_mock_store), mock_default_props));
        expect(screen.getByText('10')).toBeInTheDocument();

        userEvent.click(screen.getByText('setSelectedAmount'));
        rerender(mockTradeParamsModal(mockStore(default_mock_store), mock_default_props));

        expect(screen.getByText('20')).toBeInTheDocument();
    });

    it('function setAmountError call should change amount_error', () => {
        const { rerender } = render(mockTradeParamsModal(mockStore(default_mock_store), mock_default_props));
        expect(screen.queryByText('Amount error')).not.toBeInTheDocument();

        userEvent.click(screen.getByText('setAmountError'));
        rerender(mockTradeParamsModal(mockStore(default_mock_store), mock_default_props));

        expect(screen.getByText('Amount error')).toBeInTheDocument();
    });

    it('function setDurationError call should change amount_error', () => {
        const { rerender } = render(mockTradeParamsModal(mockStore(default_mock_store), mock_default_props));
        expect(screen.queryByText('Duration error')).not.toBeInTheDocument();

        userEvent.click(screen.getByText('setDurationError'));
        rerender(mockTradeParamsModal(mockStore(default_mock_store), mock_default_props));

        expect(screen.getByText('Duration error')).toBeInTheDocument();
    });
});

describe('<LastDigitMobile />', () => {
    const mockLastDigitMobile = (mocked_store: TCoreStores) => {
        return (
            <TraderProviders store={mocked_store}>
                <LastDigitMobile />
            </TraderProviders>
        );
    };

    it('should not render LastDigit component if it is not in the form_components array', () => {
        const { container } = render(mockLastDigitMobile(mockStore(default_mock_store)));

        expect(container).toBeEmptyDOMElement();
    });

    it('should render LastDigit component if it is in the form_components array', () => {
        default_mock_store.modules.trade.form_components = ['last_digit'];
        render(mockLastDigitMobile(mockStore(default_mock_store)));

        expect(screen.getByText('LastDigit')).toBeInTheDocument();
    });
});

describe('<BarrierMobile />', () => {
    const mockLastDigitMobile = (mocked_store: TCoreStores) => {
        return (
            <TraderProviders store={mocked_store}>
                <BarrierMobile />
            </TraderProviders>
        );
    };

    it('should not render BarrierMobile component if it is not in the form_components array', () => {
        const { container } = render(mockLastDigitMobile(mockStore(default_mock_store)));

        expect(container).toBeEmptyDOMElement();
    });

    it('should render BarrierMobile component if it is in the form_components array', () => {
        default_mock_store.modules.trade.form_components = ['barrier'];
        render(mockLastDigitMobile(mockStore(default_mock_store)));

        expect(screen.getByText('Barrier')).toBeInTheDocument();
    });
});
