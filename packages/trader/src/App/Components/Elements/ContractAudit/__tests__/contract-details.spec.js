import React from 'react';
import { screen, render } from '@testing-library/react';
import ContractDetails from '../contract-details';

describe('ContractDetails', () => {
    const contract_info = {
        account_id: 73816028,
        barrier: '1460.00',
        barrier_count: 1,
        bid_price: 1.9,
        buy_price: 2,
        contract_id: 210660718708,
        contract_type: 'VANILLALONGCALL',
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
        number_of_contracts: 0.04958,
        profit: -0.1,
        profit_percentage: -5,
        purchase_time: 1686895542,
        shortcode: 'VANILLALONGCALL_1HZ100V_2.00_1686895542_1687046399_1460000000_0.04958_1686895541',
        status: 'open',
        transaction_ids: { buy: 420381262708 },
        underlying: '1HZ100V',
    };

    it('renders the ContractAuditItems specific to Vanilla component when is_vanilla is true', () => {
        const wrapper = render(
            <ContractDetails
                contract_end_time={123456789}
                contract_info={contract_info}
                currency={'USD'}
                duration_unit={'day'}
                duration={1}
                exit_spot={123}
                is_vanilla={true}
                number_of_contracts={10}
            />
        );
        expect(wrapper.queryAllByTestId('dt_bt_label')).toHaveLength(2);
    });

    it('renders the Payout per point label when is_vanilla is true', () => {
        render(
            <ContractDetails
                contract_end_time={123456789}
                contract_info={contract_info}
                currency={'USD'}
                duration_unit={'day'}
                duration={1}
                exit_spot={123}
                is_vanilla={true}
                number_of_contracts={10}
            />
        );

        expect(screen.getByText('Payout per point')).toBeInTheDocument();
    });
});
