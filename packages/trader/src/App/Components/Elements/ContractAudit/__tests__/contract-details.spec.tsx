import React from 'react';
import { screen, render } from '@testing-library/react';
import { isCancellationExpired } from 'Stores/Modules/Trading/Helpers/logic';
import { mockContractInfo, CONTRACT_TYPES } from '@deriv/shared';
import ContractDetails from '../contract-details';

jest.mock('@deriv/shared', () => ({
    ...jest.requireActual('@deriv/shared'),
    isEndedBeforeCancellationExpired: jest.fn(() => true),
}));
jest.mock('Stores/Modules/Trading/Helpers/logic', () => ({
    ...jest.requireActual('Stores/Modules/Trading/Helpers/logic'),
    isCancellationExpired: jest.fn(() => false),
}));

describe('<ContractDetails />', () => {
    let mock_default_props: React.ComponentProps<typeof ContractDetails>;

    beforeEach(() => {
        const contract_info = mockContractInfo({
            barrier: '1460.00',
            cancellation: { ask_price: 122223 },
            contract_type: 'test_contract_type',
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
            reset_time: undefined,
            reset_barrier: '2070.88',
            status: 'open',
            transaction_ids: { buy: 420381262708 },
        });

        mock_default_props = {
            contract_end_time: 123,
            contract_info,
            duration: 'test_duration',
            duration_unit: 'test_duration_unit',
            exit_spot: '123',
            is_vanilla: false,
        };
    });

    it('should render component with children', () => {
        render(<ContractDetails {...mock_default_props} />);

        expect(screen.getByText('Reference ID')).toBeInTheDocument();
        expect(screen.getByText('Start time')).toBeInTheDocument();
        expect(screen.getByText('Entry spot')).toBeInTheDocument();
        expect(screen.getByText('Exit spot')).toBeInTheDocument();
        expect(screen.getByText('Exit time')).toBeInTheDocument();
    });

    it('should render specific component for multiplier contract_type', () => {
        mock_default_props.contract_info.contract_type = CONTRACT_TYPES.MULTIPLIER.UP;
        mock_default_props.contract_info.transaction_ids = { buy: 420381262708, sell: 420381262710 };
        render(<ContractDetails {...mock_default_props} />);

        expect(screen.getByText('Commission')).toBeInTheDocument();
        expect(screen.getByText('122,223.00')).toBeInTheDocument();
    });

    it('should render duration and strike barrier information ContractAuditItem if it is vanillas contract type', () => {
        mock_default_props.is_vanilla = true;
        mock_default_props.contract_info.contract_type = CONTRACT_TYPES.VANILLA.CALL;
        mock_default_props.contract_info.tick_count = 5;
        render(<ContractDetails {...mock_default_props} />);

        expect(screen.getByText('Duration')).toBeInTheDocument();
        expect(screen.getByText('Strike')).toBeInTheDocument();
    });

    it('should render selected tick if it is tick_high_low contract type', () => {
        mock_default_props.contract_info.contract_type = CONTRACT_TYPES.TICK_HIGH_LOW.HIGH;
        render(<ContractDetails {...mock_default_props} />);

        expect(screen.getByText('Selected tick')).toBeInTheDocument();
    });

    it('should render barrier information in ContractAuditItem if it is digit contract type', () => {
        mock_default_props.contract_info.contract_type = CONTRACT_TYPES.MATCH_DIFF.DIFF;
        render(<ContractDetails {...mock_default_props} />);

        expect(screen.getByText('Target')).toBeInTheDocument();
    });

    it('should render hight and low barriers information in ContractAuditItem if it is expiry contract type', () => {
        mock_default_props.contract_info.contract_type = CONTRACT_TYPES.EXPIRYRANGEE;
        render(<ContractDetails {...mock_default_props} />);

        expect(screen.getByText('High barrier')).toBeInTheDocument();
        expect(screen.getByText('Low barrier')).toBeInTheDocument();
    });

    it('should render payout per point information in ContractAuditItem if is_vanilla === true', () => {
        mock_default_props.is_vanilla = true;
        mock_default_props.contract_info.display_number_of_contracts = undefined;
        mock_default_props.contract_info.profit = 10;
        render(<ContractDetails {...mock_default_props} />);

        expect(screen.getByText('Payout per point')).toBeInTheDocument();
    });

    it('should render reset time and reset barrier information for Reset contract if it was passed in prop', () => {
        mock_default_props.contract_info.contract_type = CONTRACT_TYPES.RESET.CALL;
        mock_default_props.contract_info.reset_time = 1235782312876;
        render(<ContractDetails {...mock_default_props} />);

        expect(screen.getByText('Reset time')).toBeInTheDocument();
        expect(screen.getByText('Reset barrier')).toBeInTheDocument();
        expect(screen.getByText('2,070.88')).toBeInTheDocument();
    });

    it('getLabel function should return correct label if user sold the contract and it ended before cancellation expired', () => {
        mock_default_props.contract_info.contract_type = CONTRACT_TYPES.MULTIPLIER.UP;
        mock_default_props.contract_info.status = 'sold';
        mock_default_props.contract_info.transaction_ids = { buy: 420381262708, sell: 420381262710 };
        render(<ContractDetails {...mock_default_props} />);

        expect(screen.getByText('Deal cancellation')).toBeInTheDocument();
    });

    it('getLabel function should return correct label if user cancelled contract', () => {
        mock_default_props.contract_info.contract_type = CONTRACT_TYPES.MULTIPLIER.UP;
        mock_default_props.contract_info.status = 'cancelled';
        mock_default_props.contract_info.transaction_ids = { buy: 420381262708, sell: 420381262710 };
        render(<ContractDetails {...mock_default_props} />);

        expect(screen.getByText('Deal cancellation (executed)')).toBeInTheDocument();
    });

    it('getLabel function should return correct label if cancellation expired', () => {
        (isCancellationExpired as jest.Mock).mockReturnValue(true);
        mock_default_props.contract_info.contract_type = CONTRACT_TYPES.MULTIPLIER.UP;
        mock_default_props.contract_info.status = undefined;
        mock_default_props.contract_info.transaction_ids = { buy: 420381262708, sell: 420381262710 };
        render(<ContractDetails {...mock_default_props} />);

        expect(screen.getByText('Deal cancellation (expired)')).toBeInTheDocument();
    });

    it('should render correct rounding for barrier, entry spot and exit spot', () => {
        mock_default_props.contract_info.contract_type = CONTRACT_TYPES.VANILLA.CALL;
        mock_default_props.contract_info.barrier = '2037.000';
        mock_default_props.contract_info.entry_spot_display_value = '2031.00';
        mock_default_props.exit_spot = '2039.0';
        render(<ContractDetails {...mock_default_props} />);

        expect(screen.getByText('2,037.000')).toBeInTheDocument();
        expect(screen.getByText('2,031.00')).toBeInTheDocument();
        expect(screen.getByText('2,039.0')).toBeInTheDocument();
    });

    it('should render indicative high spot information for High Close contract', () => {
        mock_default_props.contract_info.contract_type = CONTRACT_TYPES.LB_PUT;
        render(<ContractDetails {...mock_default_props} />);

        expect(screen.getByText('Indicative high spot')).toBeInTheDocument();
    });

    it('should render indicative low spot information for Low Close contract', () => {
        mock_default_props.contract_info.contract_type = CONTRACT_TYPES.LB_CALL;
        render(<ContractDetails {...mock_default_props} />);

        expect(screen.getByText('Indicative low spot')).toBeInTheDocument();
    });

    it('should render both indicative high spot and indicative low spot information for High Low contract', () => {
        mock_default_props.contract_info.contract_type = CONTRACT_TYPES.LB_HIGH_LOW;
        render(<ContractDetails {...mock_default_props} />);

        expect(screen.getByText('Indicative high spot')).toBeInTheDocument();
        expect(screen.getByText('Indicative low spot')).toBeInTheDocument();
    });

    it('should render another text for both high spot and low spot High Low if the contract was sold', () => {
        mock_default_props.contract_info.contract_type = CONTRACT_TYPES.LB_HIGH_LOW;
        mock_default_props.contract_info.is_sold = 1;
        render(<ContractDetails {...mock_default_props} />);

        expect(screen.getByText('High spot')).toBeInTheDocument();
        expect(screen.getByText('Low spot')).toBeInTheDocument();
    });
});
