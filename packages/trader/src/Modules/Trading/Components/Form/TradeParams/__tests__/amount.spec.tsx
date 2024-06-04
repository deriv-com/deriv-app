import React from 'react';
import { render, screen } from '@testing-library/react';
import { mockStore } from '@deriv/stores';
import { CONTRACT_TYPES, TRADE_TYPES } from '@deriv/shared';
import { TCoreStores } from '@deriv/stores/types';
import { useTraderStore } from 'Stores/useTraderStores';
import TraderProviders from '../../../../../../trader-providers';
import Amount from '../amount';

const default_mock_store = {
    modules: {
        trade: {
            amount: 10,
            basis: 'stake',
            basis_list: [{ text: 'Stake', value: 'stake' }],
            contract_start_type: 'spot',
            contract_type: TRADE_TYPES.TURBOS.LONG,
            contract_types_list: {} as ReturnType<typeof useTraderStore>['contract_types_list'],
            duration_unit: 'm',
            expiry_type: 'endtime',
            is_accumulator: false,
            is_equal: false,
            is_multiplier: false,
            is_turbos: true,
            is_vanilla: false,
            has_equals_only: false,
            has_open_accu_contract: false,
            stake_boundary: { [CONTRACT_TYPES.TURBOS.LONG]: { min_stake: 1, max_stake: 10000 } } as ReturnType<
                typeof useTraderStore
            >['stake_boundary'],
            onChange: jest.fn(),
            validation_errors: {} as ReturnType<typeof useTraderStore>['validation_errors'],
        },
    },
    client: { is_single_currency: false },
};
const stake = 'Stake';
const allow_equals = 'Allow equals';
const mocked_input_field = 'Mocked InputField Component';
const mocked_dropdown = 'Mocked DropDown Component';
const mocked_button_toggle = 'Mocked Button Toggle Component';
const mocked_multiplier = 'Mocked Multiplier Component';
const mocked_multiplier_info = 'Mocked Multiplier Info Component';
const mocked_min_max_stake_info = 'Mocked Min Max Stake Info Component';

jest.mock('@deriv/components', () => ({
    ...jest.requireActual('@deriv/components'),
    InputField: jest.fn(() => <div>{mocked_input_field}</div>),
    Dropdown: jest.fn(() => <div>{mocked_dropdown}</div>),
    ButtonToggle: jest.fn(() => <div>{mocked_button_toggle}</div>),
}));
jest.mock('../Multiplier/multiplier', () => jest.fn(() => <div>{mocked_multiplier}</div>));
jest.mock('../Multiplier/info', () => jest.fn(() => <div>{mocked_multiplier_info}</div>));
jest.mock('../min-max-stake-info', () => jest.fn(() => <div>{mocked_min_max_stake_info}</div>));
jest.mock('Stores/Modules/Trading/Helpers/allow-equals', () => ({
    ...jest.requireActual('Stores/Modules/Trading/Helpers/allow-equals'),
    hasCallPutEqual: jest.fn().mockReturnValue(true),
}));

describe('<Amount />', () => {
    const mockAmount = (mocked_store: TCoreStores, mocked_props?: React.ComponentProps<typeof Amount>) => {
        return (
            <TraderProviders store={mocked_store}>
                <Amount {...mocked_props} />
            </TraderProviders>
        );
    };

    it('should render specific content if is_minimized === true', () => {
        render(mockAmount(mockStore(default_mock_store), { is_minimized: true }));

        expect(screen.getByText(stake)).toBeInTheDocument();
        expect(screen.getByText('10.00')).toBeInTheDocument();
    });
    it('should render only specific for Turbos components if it is a Turbos contract type', () => {
        render(mockAmount(mockStore(default_mock_store)));

        expect(screen.getByText(stake)).toBeInTheDocument();
        expect(screen.getByText(mocked_input_field)).toBeInTheDocument();
        expect(screen.getByText(mocked_dropdown)).toBeInTheDocument();
        expect(screen.getByText(mocked_min_max_stake_info)).toBeInTheDocument();

        expect(screen.queryByText(allow_equals)).not.toBeInTheDocument();
        expect(screen.queryByText(mocked_multiplier)).not.toBeInTheDocument();
        expect(screen.queryByText(mocked_multiplier_info)).not.toBeInTheDocument();
        expect(screen.queryByText(mocked_button_toggle)).not.toBeInTheDocument();
    });
    it('should render only specific for Vanillas components if it is a Vanillas contract type', () => {
        default_mock_store.modules.trade.contract_type = TRADE_TYPES.VANILLA.CALL;
        default_mock_store.modules.trade.stake_boundary = {
            [CONTRACT_TYPES.VANILLA.CALL]: { min_stake: 1, max_stake: 10000 },
        } as ReturnType<typeof useTraderStore>['stake_boundary'];
        default_mock_store.modules.trade.is_turbos = false;
        default_mock_store.modules.trade.is_vanilla = true;
        render(mockAmount(mockStore(default_mock_store)));

        expect(screen.getByText(stake)).toBeInTheDocument();
        expect(screen.getByText(mocked_input_field)).toBeInTheDocument();
        expect(screen.getByText(mocked_dropdown)).toBeInTheDocument();
        expect(screen.getByText(mocked_min_max_stake_info)).toBeInTheDocument();

        expect(screen.queryByText(allow_equals)).not.toBeInTheDocument();
        expect(screen.queryByText(mocked_multiplier)).not.toBeInTheDocument();
        expect(screen.queryByText(mocked_multiplier_info)).not.toBeInTheDocument();
        expect(screen.queryByText(mocked_button_toggle)).not.toBeInTheDocument();
    });
    it('should render only specific for Multipliers components if it is a Multiplier contract type', () => {
        default_mock_store.modules.trade.contract_type = TRADE_TYPES.MULTIPLIER;
        default_mock_store.modules.trade.is_multiplier = true;
        default_mock_store.modules.trade.is_vanilla = false;
        render(mockAmount(mockStore(default_mock_store)));

        expect(screen.getByText(stake)).toBeInTheDocument();
        expect(screen.getByText(mocked_input_field)).toBeInTheDocument();
        expect(screen.getByText(mocked_dropdown)).toBeInTheDocument();
        expect(screen.getByText(mocked_multiplier)).toBeInTheDocument();
        expect(screen.getByText(mocked_multiplier_info)).toBeInTheDocument();

        expect(screen.queryByText(mocked_min_max_stake_info)).not.toBeInTheDocument();
        expect(screen.queryByText(allow_equals)).not.toBeInTheDocument();
        expect(screen.queryByText(mocked_button_toggle)).not.toBeInTheDocument();
    });
    it('should render only specific for RiseFallEquals components if it is a TRADE_TYPES.RISE_FALL_EQUAL contract type', () => {
        default_mock_store.modules.trade.contract_type = TRADE_TYPES.RISE_FALL_EQUAL;
        default_mock_store.modules.trade.is_multiplier = false;
        default_mock_store.modules.trade.basis_list = [
            { text: 'Stake', value: 'stake' },
            { text: 'Payout', value: 'payout' },
        ];
        render(mockAmount(mockStore(default_mock_store)));

        expect(screen.getByText(mocked_button_toggle)).toBeInTheDocument();
        expect(screen.getByText(allow_equals)).toBeInTheDocument();
        expect(screen.getByText(mocked_input_field)).toBeInTheDocument();
        expect(screen.getByText(mocked_dropdown)).toBeInTheDocument();

        expect(screen.queryByText(mocked_multiplier)).not.toBeInTheDocument();
        expect(screen.queryByText(mocked_multiplier_info)).not.toBeInTheDocument();
        expect(screen.queryByText(stake)).not.toBeInTheDocument();
        expect(screen.queryByText(mocked_min_max_stake_info)).not.toBeInTheDocument();
    });
    it('should render only input without dropdown if it is a single currency account', () => {
        default_mock_store.client.is_single_currency = true;
        render(mockAmount(mockStore(default_mock_store)));

        expect(screen.getByText(mocked_input_field)).toBeInTheDocument();
        expect(screen.queryByText(mocked_dropdown)).not.toBeInTheDocument();
    });
});
