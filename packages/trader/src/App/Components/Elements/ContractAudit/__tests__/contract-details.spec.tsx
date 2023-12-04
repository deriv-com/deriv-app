import React from 'react';
import { screen, render } from '@testing-library/react';
import { isCancellationExpired } from 'Stores/Modules/Trading/Helpers/logic';
import { mockContractInfo, TRADE_TYPES } from '@deriv/shared';
import ContractDetails from '../contract-details';

const contract_types = {
    test_contract_type: 'test_contract_type',
    multiplier: TRADE_TYPES.MULTIPLIER,
    vanilla: TRADE_TYPES.VANILLA.CALL,
    digit: 'digit',
    expiry: 'expiry',
};
const contract_info = mockContractInfo({
    barrier: '1460.00',
    cancellation: { ask_price: 122223 },
    contract_type: contract_types.test_contract_type,
    current_spot: 1458.01,
    current_spot_display_value: '1458.01',
    current_spot_time: 1686895544,
    date_expiry: 1687046399,
    date_start: 1686895542,
    entry_spot: 1458.17,
    entry_spot_display_value: '1458.17',
    entry_tick: 1458.17,
    entry_tick_display_value: '1458.17',
    entry_tick_time: 1686895541,
    expiry_time: 1687046399,
    high_barrier: '2030',
    is_expired: 0,
    is_forward_starting: 0,
    is_settleable: 0,
    is_sold: 0,
    is_valid_to_cancel: 0,
    is_valid_to_sell: 1,
    low_barrier: '2020',
    display_number_of_contracts: '0.04958',
    profit: -0.1,
    status: 'open',
    transaction_ids: { buy: 420381262708 },
});

const mock_default_props = {
    contract_end_time: 123,
    contract_info,
    duration: 'test_duration',
    duration_unit: 'test_duration_unit',
    exit_spot: '123',
    is_vanilla: false,
};

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    isEndedBeforeCancellationExpired: jest.fn(() => true),
}));
jest.mock('Stores/Modules/Trading/Helpers/logic', () => ({
    ...jest.requireActual('Stores/Modules/Trading/Helpers/logic'),
    isCancellationExpired: jest.fn(() => false),
}));

describe('<ContractDetails />', () => {
    it('should render component with children', () => {
        render(<ContractDetails {...mock_default_props} />);

        expect(screen.getByText('Reference ID')).toBeInTheDocument();
        expect(screen.getByText('Start time')).toBeInTheDocument();
        expect(screen.getByText('Entry spot')).toBeInTheDocument();
        expect(screen.getByText('Exit spot')).toBeInTheDocument();
        expect(screen.getByText('Exit time')).toBeInTheDocument();
    });

    it('should render specific component for multiplier contract_type', () => {
        const new_props = { ...mock_default_props };
        new_props.contract_info.contract_type = contract_types.multiplier;
        new_props.contract_info.transaction_ids = { buy: 420381262708, sell: 420381262710 };
        render(<ContractDetails {...new_props} />);

        expect(screen.getByText('Commission')).toBeInTheDocument();
        expect(screen.getByText('122,223.00')).toBeInTheDocument();
    });

    it('should render duration and strike barrier information ContractAuditItem if it is vanillas contract type', () => {
        const new_props = { ...mock_default_props };
        new_props.is_vanilla = true;
        new_props.contract_info.contract_type = contract_types.vanilla;
        new_props.contract_info.tick_count = 5;
        render(<ContractDetails {...new_props} />);

        expect(screen.getByText('Duration')).toBeInTheDocument();
        expect(screen.getByText('Strike')).toBeInTheDocument();
    });

    it('should render barrier information in ContractAuditItem if it is digit contract type', () => {
        const new_props = { ...mock_default_props };
        new_props.contract_info.contract_type = contract_types.digit;
        render(<ContractDetails {...new_props} />);

        expect(screen.getByText('Target')).toBeInTheDocument();
    });

    it('should render hight and low barriers information in ContractAuditItem if it is expiry contract type', () => {
        const new_props = { ...mock_default_props };
        new_props.contract_info.contract_type = contract_types.expiry;
        render(<ContractDetails {...new_props} />);

        expect(screen.getByText('High barrier')).toBeInTheDocument();
        expect(screen.getByText('Low barrier')).toBeInTheDocument();
    });

    it('should render payout per point information in ContractAuditItem if is_vanilla === true', () => {
        const new_props = { ...mock_default_props };
        new_props.is_vanilla = true;
        new_props.contract_info.display_number_of_contracts = undefined;
        new_props.contract_info.profit = 10;
        render(<ContractDetails {...new_props} />);

        expect(screen.getByText('Payout per point')).toBeInTheDocument();
    });

    it('getLabel function should return correct label if user sold the contract and it ended before cancellation expired', () => {
        const new_props = { ...mock_default_props };
        new_props.contract_info.contract_type = contract_types.multiplier;
        new_props.contract_info.status = 'sold';
        new_props.contract_info.transaction_ids = { buy: 420381262708, sell: 420381262710 };
        render(<ContractDetails {...new_props} />);

        expect(screen.getByText('Deal cancellation')).toBeInTheDocument();
    });

    it('getLabel function should return correct label if user cancelled contract', () => {
        const new_props = { ...mock_default_props };
        new_props.contract_info.contract_type = contract_types.multiplier;
        new_props.contract_info.status = 'cancelled';
        new_props.contract_info.transaction_ids = { buy: 420381262708, sell: 420381262710 };
        render(<ContractDetails {...new_props} />);

        expect(screen.getByText('Deal cancellation (executed)')).toBeInTheDocument();
    });

    it('getLabel function should return correct label if cancellation expired', () => {
        (isCancellationExpired as jest.Mock).mockReturnValue(true);
        const new_props = { ...mock_default_props };
        new_props.contract_info.contract_type = contract_types.multiplier;
        new_props.contract_info.status = undefined;
        new_props.contract_info.transaction_ids = { buy: 420381262708, sell: 420381262710 };
        render(<ContractDetails {...new_props} />);

        expect(screen.getByText('Deal cancellation (expired)')).toBeInTheDocument();
    });

    it('should render correct rounding for barrier, entry spot and exit spot', () => {
        const new_props = { ...mock_default_props };
        new_props.contract_info.contract_type = contract_types.vanilla;
        new_props.contract_info.barrier = '2037.000';
        new_props.contract_info.entry_spot_display_value = '2031.00';
        new_props.exit_spot = '2039.0';

        render(<ContractDetails {...new_props} />);

        expect(screen.getByText('2,037.000')).toBeInTheDocument();
        expect(screen.getByText('2,031.00')).toBeInTheDocument();
        expect(screen.getByText('2,039.0')).toBeInTheDocument();
    });
});
