import React from 'react';
import { render, screen } from '@testing-library/react';
import { mockStore } from '@deriv/stores';
import { VANILLALONG, TURBOS } from '@deriv/shared';
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
            contract_type: TURBOS.LONG as string,
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
            stake_boundary: { [TURBOS.LONG.toUpperCase()]: { min_stake: 1, max_stake: 10000 } } as ReturnType<
                typeof useTraderStore
            >['stake_boundary'],
            onChange: jest.fn(),
            validation_errors: {} as ReturnType<typeof useTraderStore>['validation_errors'],
        },
    },
    client: { is_single_currency: false },
};
const stake = 'Stake';
const allowEquals = 'Allow equals';
const mockedInputField = 'Mocked InputField Component';
const mockedDropDown = 'Mocked DropDown Component';
const mockedButtonToggle = 'Mocked Button Toggle Component';
const mockedMultiplier = 'Mocked Multiplier Component';
const mockedMultiplierInfo = 'Mocked Multiplier Info Component';
const mockedMinMaxStakeInfo = 'Mocked Min Max Stake Info Component';

jest.mock('@deriv/components', () => ({
    ...jest.requireActual('@deriv/components'),
    InputField: jest.fn(() => <div>{mockedInputField}</div>),
    Dropdown: jest.fn(() => <div>{mockedDropDown}</div>),
    ButtonToggle: jest.fn(() => <div>{mockedButtonToggle}</div>),
}));
jest.mock('../Multiplier/multiplier', () => jest.fn(() => <div>{mockedMultiplier}</div>));
jest.mock('../Multiplier/info', () => jest.fn(() => <div>{mockedMultiplierInfo}</div>));
jest.mock('../min-max-stake-info', () => jest.fn(() => <div>{mockedMinMaxStakeInfo}</div>));
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
        expect(screen.getByText(mockedInputField)).toBeInTheDocument();
        expect(screen.getByText(mockedDropDown)).toBeInTheDocument();
        expect(screen.getByText(mockedMinMaxStakeInfo)).toBeInTheDocument();

        expect(screen.queryByText(allowEquals)).not.toBeInTheDocument();
        expect(screen.queryByText(mockedMultiplier)).not.toBeInTheDocument();
        expect(screen.queryByText(mockedMultiplierInfo)).not.toBeInTheDocument();
        expect(screen.queryByText(mockedButtonToggle)).not.toBeInTheDocument();
    });
    it('should render only specific for Vanillas components if it is a Vanillas contract type', () => {
        default_mock_store.modules.trade.contract_type = VANILLALONG.CALL;
        default_mock_store.modules.trade.stake_boundary = {
            [VANILLALONG.CALL.toUpperCase()]: { min_stake: 1, max_stake: 10000 },
        } as ReturnType<typeof useTraderStore>['stake_boundary'];
        default_mock_store.modules.trade.is_turbos = false;
        default_mock_store.modules.trade.is_vanilla = true;
        render(mockAmount(mockStore(default_mock_store)));

        expect(screen.getByText(stake)).toBeInTheDocument();
        expect(screen.getByText(mockedInputField)).toBeInTheDocument();
        expect(screen.getByText(mockedDropDown)).toBeInTheDocument();
        expect(screen.getByText(mockedMinMaxStakeInfo)).toBeInTheDocument();

        expect(screen.queryByText(allowEquals)).not.toBeInTheDocument();
        expect(screen.queryByText(mockedMultiplier)).not.toBeInTheDocument();
        expect(screen.queryByText(mockedMultiplierInfo)).not.toBeInTheDocument();
        expect(screen.queryByText(mockedButtonToggle)).not.toBeInTheDocument();
    });
    it('should render only specific for Multipliers components if it is a Multiplier contract type', () => {
        default_mock_store.modules.trade.contract_type = 'multiplier';
        default_mock_store.modules.trade.is_multiplier = true;
        default_mock_store.modules.trade.is_vanilla = false;
        render(mockAmount(mockStore(default_mock_store)));

        expect(screen.getByText(stake)).toBeInTheDocument();
        expect(screen.getByText(mockedInputField)).toBeInTheDocument();
        expect(screen.getByText(mockedDropDown)).toBeInTheDocument();
        expect(screen.getByText(mockedMultiplier)).toBeInTheDocument();
        expect(screen.getByText(mockedMultiplierInfo)).toBeInTheDocument();

        expect(screen.queryByText(mockedMinMaxStakeInfo)).not.toBeInTheDocument();
        expect(screen.queryByText(allowEquals)).not.toBeInTheDocument();
        expect(screen.queryByText(mockedButtonToggle)).not.toBeInTheDocument();
    });
    it('should render only specific for RiseFallEquals components if it is a RiseFallEquals contract type', () => {
        default_mock_store.modules.trade.contract_type = 'rise_fall_equal';
        default_mock_store.modules.trade.is_multiplier = false;
        default_mock_store.modules.trade.basis_list = [
            { text: 'Stake', value: 'stake' },
            { text: 'Payout', value: 'payout' },
        ];
        render(mockAmount(mockStore(default_mock_store)));

        expect(screen.getByText(mockedButtonToggle)).toBeInTheDocument();
        expect(screen.getByText(allowEquals)).toBeInTheDocument();
        expect(screen.getByText(mockedInputField)).toBeInTheDocument();
        expect(screen.getByText(mockedDropDown)).toBeInTheDocument();

        expect(screen.queryByText(mockedMultiplier)).not.toBeInTheDocument();
        expect(screen.queryByText(mockedMultiplierInfo)).not.toBeInTheDocument();
        expect(screen.queryByText(stake)).not.toBeInTheDocument();
        expect(screen.queryByText(mockedMinMaxStakeInfo)).not.toBeInTheDocument();
    });
    it('should render only input without dropdown if it is single currency contract', () => {
        default_mock_store.client.is_single_currency = true;
        render(mockAmount(mockStore(default_mock_store)));

        expect(screen.getByText(mockedInputField)).toBeInTheDocument();
        expect(screen.queryByText(mockedDropDown)).not.toBeInTheDocument();
    });
});
