import React from 'react';
// import { render, screen } from '@testing-library/react';
// import { isDesktop, isMobile } from '@deriv/shared';
// import { TPortfolioPosition } from '@deriv/stores/types';

// const future_time = Math.floor(Date.now() / 1000) + 5000;
// const options_position = {
//     contract_info: {
//         account_id: 112905368,
//         barrier: '1184.99',
//         barrier_count: 1,
//         bid_price: 9.52,
//         buy_price: 10,
//         contract_id: 246179185288,
//         contract_type: 'CALL',
//         currency: 'USD',
//         current_spot: 1184.95,
//         current_spot_display_value: '1184.95',
//         current_spot_time: 1718630678,
//         date_expiry: future_time,
//         date_settlement: future_time,
//         date_start: 1718630564,
//         display_name: 'Volatility 100 Index',
//         entry_spot: 1184.99,
//         entry_spot_display_value: '1184.99',
//         entry_tick: 1184.99,
//         entry_tick_display_value: '1184.99',
//         entry_tick_time: 1718630566,
//         expiry_time: future_time,
//         id: '6838091b-05ce-7872-3131-eedddd394422',
//         is_expired: 0,
//         is_forward_starting: 0,
//         is_intraday: 1,
//         is_path_dependent: 0,
//         is_settleable: 0,
//         is_sold: 0,
//         is_valid_to_cancel: 0,
//         is_valid_to_sell: 1,
//         longcode:
//             'Win payout if Volatility 100 Index is strictly higher than entry spot at 6 hours after contract start time.',
//         payout: 19.73,
//         profit: -0.48,
//         profit_percentage: -4.8,
//         purchase_time: 1718630564,
//         shortcode: `CALL_R_100_19.73_1718630564_${future_time}_S0P_0`,
//         status: 'open',
//         transaction_ids: {
//             buy: 490752972668,
//         },
//         underlying: 'R_100',
//     },
//     details:
//         'Win payout if Volatility 100 Index is strictly higher than entry spot at 6 hours after contract start time.',
//     display_name: '',
//     id: 246179185288,
//     indicative: 9.52,
//     payout: 19.73,
//     purchase: 10,
//     reference: 490752972668,
//     type: 'CALL',
//     profit_loss: -0.48,
//     is_valid_to_sell: true,
//     status: 'loss',
//     barrier: 1184.99,
//     entry_spot: 1184.99,
// } as TPortfolioPosition;

describe('MobileRowRenderer', () => {
    // const data_table_test_id = 'dt_data_table';
    // const loading_test_id = 'dt_loading_component';
    // const no_open_positions_text = 'You have no open positions yet.';
    // const test_classname = 'test-class';
    // const mocked_props: React.ComponentProps<typeof OpenPositionsTable> = {
    //     accumulator_rate: 'All growth rates',
    //     active_positions: [options_position],
    //     className: 'open-positions',
    //     columns: [
    //         {
    //             key: 'icon',
    //             title: 'Type',
    //             col_index: 'type',
    //         },
    //         {
    //             title: 'Ref. ID',
    //             col_index: 'reference',
    //         },
    //         {
    //             title: 'Currency',
    //             col_index: 'currency',
    //         },
    //         {
    //             title: 'Stake',
    //             col_index: 'purchase',
    //         },
    //         {
    //             title: 'Potential payout',
    //             col_index: 'payout',
    //         },
    //         {
    //             title: 'Total profit/loss',
    //             col_index: 'profit',
    //         },
    //         {
    //             title: 'Contract value',
    //             col_index: 'indicative',
    //         },
    //         {
    //             title: 'Remaining time',
    //             col_index: 'id',
    //         },
    //     ],
    //     component_icon: 'IcOpenPositions',
    //     contract_type_value: 'Options',
    //     currency: 'USD',
    //     is_empty: false,
    //     is_loading: false,
    //     mobileRowRenderer: () => <div>MobileRowRenderer</div>,
    //     row_size: 63,
    //     totals: {
    //         indicative: 9.73,
    //         purchase: 10,
    //         profit_loss: -0.27,
    //         payout: null,
    //     },
    // };
    // it('should render "DataTable" component and it\'s properties when "is_loading" property is "false" and the "currency" property is passed in the "desktop" view', () => {
    //     render(<OpenPositionsTable {...mocked_props} />);
    //     expect(screen.getByTestId(data_table_test_id)).toBeInTheDocument();
    //     expect(screen.getByTestId(data_table_test_id)).toHaveClass(test_classname);
    // });
    // it('should render "DataList" component and it\'s properties when "is_loading" property is "false" and the "currency" property is passed in the "mobile" view', () => {
    //     (isMobile as jest.Mock).mockReturnValue(false);
    //     (isDesktop as jest.Mock).mockReturnValue(true);
    //     render(<OpenPositionsTable {...mocked_props} />);
    //     expect(screen.getByText('DataList')).toBeInTheDocument();
    // });
    // it('should render "Loading" component when is_loading is true', () => {
    //     render(<OpenPositionsTable {...mocked_props} is_loading />);
    //     expect(screen.getByTestId(loading_test_id)).toBeInTheDocument();
    // });
    // it('should render "Loading" component when is_empty is true', () => {
    //     render(<OpenPositionsTable {...mocked_props} active_positions={[]} is_empty />);
    //     expect(screen.getByTestId(no_open_positions_text)).toBeInTheDocument();
    // });
});
