import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { mockStore } from '@deriv/stores';
import { TCoreStores } from '@deriv/stores/types';
import { CONTRACT_TYPES, TRADE_TYPES } from '@deriv/shared';
import { useTraderStore } from 'Stores/useTraderStores';
import TraderProviders from '../../../../../../trader-providers';
import Amount from '../amount-mobile';

const mocked_numpad_component = 'Mocked Numpad Component';
const default_props = {
    toggleModal: jest.fn(),
    duration_value: 3,
    duration_unit: 'm',
    has_duration_error: false,
    amount_tab_idx: undefined,
    setAmountError: jest.fn(),
    setAmountTabIdx: jest.fn(),
    setSelectedAmount: jest.fn(),
    stake_value: 10,
    payout_value: 20,
};
const default_mock_store = {
    modules: {
        trade: {
            basis: 'stake',
            basis_list: [{ text: 'Payout', value: 'payout' }],
            contract_type: TRADE_TYPES.RISE_FALL as string,
            is_turbos: false,
            is_vanilla: false,
            onChangeMultiple: jest.fn(),
            amount: 10,
            duration_unit: 'm',
            duration: 3,
            stake_boundary: { [CONTRACT_TYPES.TURBOS.LONG]: { min_stake: 1, max_stake: 10000 } } as ReturnType<
                typeof useTraderStore
            >['stake_boundary'],
        },
    },
};

jest.mock('@deriv/components', () => ({
    ...jest.requireActual('@deriv/components'),
    Numpad: jest.fn(props => (
        <div>
            <div>{mocked_numpad_component}</div>
            <div>{props.value}</div>
            <button
                onClick={() => {
                    props.onValueChange(5);
                    props.format(5);
                    props.onSubmit(5);
                }}
            >
                5
            </button>
            <button onClick={() => props.onValueChange(0)}>0</button>
            <button onClick={() => props.onValueChange(0.1)}>0.1</button>
            <button
                onClick={() => {
                    props.onValueChange('OK');
                    props.format('OK');
                }}
            >
                OK
            </button>
        </div>
    )),
    Tabs: jest.fn(({ children }) => <div>{children}</div>),
}));

describe('<Amount/>', () => {
    const mockAmount = (mocked_store: TCoreStores, mocked_props: React.ComponentProps<typeof Amount>) => {
        return (
            <TraderProviders store={mocked_store}>
                <Amount {...mocked_props} />
            </TraderProviders>
        );
    };

    it('should render only one Numpad component with value equal to payout_value if basis_list.length === 1 and basis_list[0].value is payout', () => {
        render(mockAmount(mockStore(default_mock_store), default_props));

        expect(screen.getByText(mocked_numpad_component)).toBeInTheDocument();
        expect(screen.getByText(default_props.payout_value)).toBeInTheDocument();
    });
    it('should render only one Numpad component with value equal to stake_value if basis_list.length === 1 and basis_list[0].value is stake', () => {
        default_mock_store.modules.trade.basis_list = [{ text: 'Stake', value: 'stake' }];
        render(mockAmount(mockStore(default_mock_store), default_props));

        expect(screen.getByText(mocked_numpad_component)).toBeInTheDocument();
        expect(screen.getByText(default_props.stake_value)).toBeInTheDocument();
    });
    it('should not render extra Numpad components except payout and stake', () => {
        default_mock_store.modules.trade.basis_list = [
            { text: 'Payout', value: 'payout' },
            { text: 'Stake', value: 'stake' },
            { text: 'Test', value: 'test' },
        ];
        render(mockAmount(mockStore(default_mock_store), default_props));

        expect(screen.getAllByText(mocked_numpad_component)).toHaveLength(2);
    });
    it('should render MinMaxStakeInfo for Turbos', () => {
        default_mock_store.modules.trade.basis_list = [{ text: 'Stake', value: 'stake' }];
        default_mock_store.modules.trade.contract_type = TRADE_TYPES.TURBOS.LONG;
        default_mock_store.modules.trade.is_turbos = true;
        render(mockAmount(mockStore(default_mock_store), default_props));

        expect(screen.getByText(/min. stake/i)).toBeInTheDocument();
        expect(screen.getByText('1.00')).toBeInTheDocument();
        expect(screen.getByText(/max. stake/i)).toBeInTheDocument();
        expect(screen.getByText('10,000.00')).toBeInTheDocument();
        expect(screen.getByText(mocked_numpad_component)).toBeInTheDocument();
        expect(screen.getByText(default_props.stake_value)).toBeInTheDocument();
    });
    it('should pass the validation if user insert correct stake value', () => {
        render(mockAmount(mockStore(default_mock_store), default_props));

        userEvent.click(screen.getByText('5'));

        expect(default_props.setAmountError).toBeCalledWith(false);
    });
    it('should not pass the validation if user insert zero stake value', () => {
        render(mockAmount(mockStore(default_mock_store), default_props));

        userEvent.click(screen.getByText('0'));

        expect(default_props.setAmountError).toBeCalledWith(true);
    });
    it('should not pass the validation if user insert stake value which is less then allowed min stake', () => {
        render(mockAmount(mockStore(default_mock_store), default_props));

        userEvent.click(screen.getByText('0.1'));

        expect(default_props.setAmountError).toBeCalledWith(true);
    });
    it('should not pass the validation if user clicked on other buttons except those with numbers', () => {
        render(mockAmount(mockStore(default_mock_store), default_props));

        userEvent.click(screen.getByText('OK'));

        expect(default_props.setAmountError).toBeCalledWith(true);
    });
});
