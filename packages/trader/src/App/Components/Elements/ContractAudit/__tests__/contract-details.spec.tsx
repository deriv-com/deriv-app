import React from 'react';
import { screen, render } from '@testing-library/react';
import { TContractInfo } from '@deriv/shared';
import { isCancellationExpired } from 'Stores/Modules/Trading/Helpers/logic';
import ContractDetails from '../contract-details';

const contract_info = {
    account_id: 73816028,
    barrier: '1460.00',
    barrier_count: 1,
    bid_price: 1.9,
    buy_price: 2,
    cancellation: { ask_price: 122223 },
    contract_id: 210660718708,
    contract_type: 'test_contract_type',
    currency: 'USD',
    current_spot: 1458.01,
    current_spot_display_value: '1458.01',
    current_spot_time: 1686895544,
    date_expiry: 1687046399,
    date_settlement: 1687046400,
    date_start: 1686895542,
    display_name: 'Volatility 100 (1s) Index',
    entry_spot: 1458.17,
    entry_spot_display_value: '1458.17',
    entry_tick: 1458.17,
    entry_tick_display_value: '1458.17',
    entry_tick_time: 1686895541,
    expiry_time: 1687046399,
    high_barrier: '2030',
    id: '1c1fd73a-daeb-05df-47f3-f70aa09146e4',
    is_expired: 0,
    is_forward_starting: 0,
    is_intraday: 0,
    is_path_dependent: 0,
    is_settleable: 0,
    is_sold: 0,
    is_valid_to_cancel: 0,
    is_valid_to_sell: 1,
    longcode: 'Your payout will be 0.04958 for each point above 1460.00 at expiry time',
    low_barrier: '2020',
    display_number_of_contracts: '0.04958',
    profit: -0.1,
    profit_percentage: -5,
    purchase_time: 1686895542,
    shortcode: 'VANILLALONGCALL_1HZ100V_2.00_1686895542_1687046399_1460000000_0.04958_1686895541',
    status: 'open',
    transaction_ids: { buy: 420381262708 },
    underlying: '1HZ100V',
} as TContractInfo;

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
    it('should render componenet with children', () => {
        render(<ContractDetails {...mock_default_props} />);

        expect(screen.getByText('Reference ID')).toBeInTheDocument();
        expect(screen.getByText('Start time')).toBeInTheDocument();
        expect(screen.getByText('Entry spot')).toBeInTheDocument();
        expect(screen.getByText('Exit spot')).toBeInTheDocument();
        expect(screen.getByText('Exit time')).toBeInTheDocument();
    });

    it('should render specific componenet for multiplier contract_type', () => {
        const new_props = { ...mock_default_props };
        new_props.contract_info.contract_type = 'multiplier';
        new_props.contract_info.transaction_ids = { buy: 420381262708, sell: 420381262710 };
        render(<ContractDetails {...new_props} />);

        expect(screen.getByText('Commission')).toBeInTheDocument();
        expect(screen.getByText('122,223.00')).toBeInTheDocument();
    });

    it('should render duration ContractAuditItem if show_duration === true', () => {
        const new_props = { ...mock_default_props };
        new_props.contract_info.contract_type = 'vanillalongcall';
        new_props.contract_info.tick_count = 5;
        render(<ContractDetails {...new_props} />);

        expect(screen.getByText('Duration')).toBeInTheDocument();
    });

    it('should render stike barrier information in ContractAuditItem if show_strike_barrier === true', () => {
        const new_props = { ...mock_default_props };
        new_props.is_vanilla = true;
        new_props.contract_info.contract_type = 'vanillalongcall';
        render(<ContractDetails {...new_props} />);

        expect(screen.getByText('Strike')).toBeInTheDocument();
    });

    it('should render barrier information in ContractAuditItem if show_barrier === true', () => {
        const new_props = { ...mock_default_props };
        new_props.contract_info.contract_type = 'digit';
        render(<ContractDetails {...new_props} />);

        expect(screen.getByText('Target')).toBeInTheDocument();
    });

    it('should render hight and low barriers information in ContractAuditItem if hasTwoBarriers === true', () => {
        const new_props = { ...mock_default_props };
        new_props.contract_info.contract_type = 'expiry';
        render(<ContractDetails {...new_props} />);

        expect(screen.getByText('High barrier')).toBeInTheDocument();
        expect(screen.getByText('Low barrier')).toBeInTheDocument();
    });

    it('should render paypout per point information in ContractAuditItem if show_payout_per_point === true', () => {
        const new_props = { ...mock_default_props };
        new_props.is_vanilla = true;
        new_props.contract_info.display_number_of_contracts = undefined;
        new_props.contract_info.profit = 10;
        render(<ContractDetails {...new_props} />);

        expect(screen.getByText('Payout per point')).toBeInTheDocument();
    });

    it('getLabel function should return correct label if user sold the contract and it endedn before cancellation expired', () => {
        const new_props = { ...mock_default_props };
        new_props.contract_info.contract_type = 'multiplier';
        new_props.contract_info.status = 'sold';
        new_props.contract_info.transaction_ids = { buy: 420381262708, sell: 420381262710 };
        render(<ContractDetails {...new_props} />);

        expect(screen.getByText('Deal cancellation')).toBeInTheDocument();
    });

    it('getLabel function should return correct label if user cancelled contract', () => {
        const new_props = { ...mock_default_props };
        new_props.contract_info.contract_type = 'multiplier';
        new_props.contract_info.status = 'cancelled';
        new_props.contract_info.transaction_ids = { buy: 420381262708, sell: 420381262710 };
        render(<ContractDetails {...new_props} />);

        expect(screen.getByText('Deal cancellation (executed)')).toBeInTheDocument();
    });

    it('getLabel function should return correct label if user cancellation expired', () => {
        (isCancellationExpired as jest.Mock).mockReturnValue(true);
        const new_props = { ...mock_default_props };
        new_props.contract_info.contract_type = 'multiplier';
        new_props.contract_info.status = undefined;
        new_props.contract_info.transaction_ids = { buy: 420381262708, sell: 420381262710 };
        render(<ContractDetails {...new_props} />);

        expect(screen.getByText('Deal cancellation (expired)')).toBeInTheDocument();
    });
});
