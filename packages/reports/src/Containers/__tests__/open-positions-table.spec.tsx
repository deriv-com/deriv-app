import React from 'react';
import { render, screen } from '@testing-library/react';
import { mockContractInfo } from '@deriv/shared';
import { useDevice } from '@deriv-com/ui';
import { TPortfolioPosition } from '@deriv/stores/types';
import { OpenPositionsTable, getRowAction, isPurchaseMissing } from '../open-positions-table';

const data_list = 'DataList';
const future_time = Math.floor(Date.now() / 1000) + 5000;
const options_position = {
    contract_info: mockContractInfo({
        bid_price: 9.52,
        buy_price: 10,
        shortcode: `CALL_R_100_19.73_1718630564_${future_time}_S0P_0`,
    }),
    details:
        'Win payout if Volatility 100 Index is strictly higher than entry spot at 6 hours after contract start time.',
    display_name: '',
    id: 246179185288,
    indicative: 9.52,
    payout: 19.73,
    purchase: 10,
    reference: 490752972668,
    type: 'CALL',
    profit_loss: -0.48,
    is_valid_to_sell: true,
    status: 'loss',
    barrier: 1184.99,
    entry_spot: 1184.99,
} as TPortfolioPosition;

jest.mock('@deriv-com/ui', () => ({
    useDevice: jest.fn(() => ({ isDesktop: true })),
}));

jest.mock('@deriv/components', () => ({
    ...jest.requireActual('@deriv/components'),
    DataList: jest.fn(() => <>{data_list}</>),
}));

describe('OpenPositionsTable', () => {
    const data_table_test_id = 'dt_data_table';
    const loading_test_id = 'dt_loading_component';
    const mocked_props: React.ComponentProps<typeof OpenPositionsTable> = {
        accumulator_rate: 'All growth rates',
        active_positions: [options_position],
        className: 'open-positions',
        columns: [
            {
                key: 'icon',
                title: 'Type',
                col_index: 'type',
            },
            {
                title: 'Ref. ID',
                col_index: 'reference',
            },
            {
                title: 'Currency',
                col_index: 'currency',
            },
            {
                title: 'Stake',
                col_index: 'purchase',
            },
            {
                title: 'Potential payout',
                col_index: 'payout',
            },
            {
                title: 'Total profit/loss',
                col_index: 'profit',
            },
            {
                title: 'Contract value',
                col_index: 'indicative',
            },
            {
                title: 'Remaining time',
                col_index: 'id',
            },
        ],
        component_icon: 'IcOpenPositions',
        contract_type_value: 'Options',
        currency: 'USD',
        is_empty: false,
        is_loading: false,
        mobileRowRenderer: () => <div>MobileRowRenderer</div>,
        row_size: 63,
        totals: {
            indicative: 9.73,
            purchase: 10,
            profit_loss: -0.27,
            payout: null,
        },
    };

    it('should render DataTable if active_positions and currency are passed on desktop', () => {
        render(<OpenPositionsTable {...mocked_props} />);
        expect(screen.getByTestId(data_table_test_id)).toHaveClass(mocked_props.className);
    });
    it('should not render DataTable or Loading on desktop if currency is missing', () => {
        render(<OpenPositionsTable {...mocked_props} currency='' />);
        expect(screen.queryByTestId(data_table_test_id)).not.toBeInTheDocument();
        expect(screen.queryByTestId(loading_test_id)).not.toBeInTheDocument();
    });
    it('should render DataList if active_positions and currency are passed on desktop on mobile', () => {
        (useDevice as jest.Mock).mockImplementation(() => ({ isDesktop: false }));
        render(<OpenPositionsTable {...mocked_props} />);
        expect(screen.getByText(data_list)).toBeInTheDocument();
    });
    it('should not render DataList or Loading on mobile if currency is missing', () => {
        (useDevice as jest.Mock).mockImplementation(() => ({ isDesktop: false }));
        render(<OpenPositionsTable {...mocked_props} currency='' />);
        expect(screen.queryByText(data_list)).not.toBeInTheDocument();
        expect(screen.queryByTestId(loading_test_id)).not.toBeInTheDocument();
    });
    it('should render Loading when is_loading is true', () => {
        render(<OpenPositionsTable {...mocked_props} is_loading />);
        expect(screen.getByTestId(loading_test_id)).toBeInTheDocument();
    });
    it('should render No positions message when is_empty is true', () => {
        render(<OpenPositionsTable {...mocked_props} active_positions={[]} is_empty />);
        expect(screen.getByText('You have no open positions yet.')).toBeInTheDocument();
    });
});

describe('isPurchaseMissing', () => {
    it('should return true if purchase value (position purchase) is 0 / NaN / undefined', () => {
        expect(isPurchaseMissing({ purchase: 0 })).toBe(true);
        expect(isPurchaseMissing({ purchase: NaN })).toBe(true);
        expect(isPurchaseMissing({})).toBe(true);
    });
    it('should return false if purchase value (position purchase) is a non-zero number', () => {
        expect(isPurchaseMissing({ purchase: 10 })).toBe(false);
        expect(isPurchaseMissing({ purchase: 1.55 })).toBe(false);
    });
});

describe('getRowAction', () => {
    it('should return an empty object if received data is an empty object, or if contract_info and id are missing in it', () => {
        expect(getRowAction()).toMatchObject({});
        expect(getRowAction({})).toMatchObject({});
        expect(getRowAction({ ...options_position, id: '', contract_info: undefined })).toMatchObject({});
        expect(getRowAction({ ...options_position, id: '', contract_info: undefined, type: '' })).toMatchObject({});
    });
    it('should return contract path string if received data has an id, and if contract is not unsupported or forward-starting', () => {
        expect(getRowAction({ id: options_position.id })).toEqual(`/contract/${options_position.id}`);
        expect(getRowAction(options_position)).toEqual(`/contract/${options_position.id}`);
    });
    it('should return an object with component that renders a correct message if contract type is unsupported', () => {
        render(
            (
                getRowAction({
                    ...options_position,
                    type: 'CALLSPREAD',
                }) as Record<string, JSX.Element>
            ).component
        );
        expect(screen.getByText(/contract details aren't currently available/i)).toBeInTheDocument();
    });
    it('should return an object with component that renders a correct message if contract is forward-starting', () => {
        render(
            (
                getRowAction({
                    ...options_position,
                    contract_info: {
                        ...options_position.contract_info,
                        current_spot_time: 1717662763,
                        date_start: future_time,
                    },
                }) as Record<string, JSX.Element>
            ).component
        );
        expect(screen.getByText("You'll see these details once the contract starts.")).toBeInTheDocument();
    });
});
