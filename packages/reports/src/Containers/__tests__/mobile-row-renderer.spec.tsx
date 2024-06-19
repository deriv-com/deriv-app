import React from 'react';
import { render, screen } from '@testing-library/react';
import { MobileRowRenderer } from '../mobile-row-renderer';
import { CONTRACT_TYPES, toMoment } from '@deriv/shared';

const positions_drawer_card = 'PositionsDrawerCard';
const progress_bar = 'ProgressBar';
const progress_slider_mobile = 'ProgressSliderMobile';

jest.mock('@deriv/components', () => ({
    ...jest.requireActual('@deriv/components'),
    PositionsDrawerCard: jest.fn(() => <>{positions_drawer_card}</>),
    ProgressBar: jest.fn(() => <>{progress_bar}</>),
    ProgressSliderMobile: jest.fn(() => <>ProgressSliderMobile</>),
}));

describe('MobileRowRenderer', () => {
    const contract_icons = 'contract icons';
    const future_time = Math.floor(Date.now() / 1000) + 5000;
    const COLUMNS_MAP_KEY = {
        CURRENCY: 'currency',
        ID: 'id',
        INDICATIVE: 'indicative',
        PAYOUT: 'payout',
        PROFIT: 'profit',
        PURCHASE: 'purchase',
        REFERENCE: 'reference',
        TYPE: 'type',
    };
    const columns_map = {
        [COLUMNS_MAP_KEY.CURRENCY]: {
            col_index: 'currency',
            renderCellContent: jest.fn(() => 'USD'),
            title: 'Currency',
        },
        [COLUMNS_MAP_KEY.ID]: {
            col_index: 'id',
            renderCellContent: jest.fn(() => <>ProgressSliderStream</>),
            title: 'Remaining time',
        },
        [COLUMNS_MAP_KEY.INDICATIVE]: {
            col_index: 'indicative',
            renderCellContent: jest.fn(() => '9.71'),
            title: 'Contract value',
        },
        [COLUMNS_MAP_KEY.PAYOUT]: {
            col_index: 'payout',
            renderCellContent: jest.fn(() => '19.73'),
            renderHeader: jest.fn(() => 'Potential payout'),
            title: 'Potential payout',
        },
        [COLUMNS_MAP_KEY.PROFIT]: {
            col_index: 'profit',
            renderCellContent: jest.fn(() => '-0.29'),
            title: 'Total profit/loss',
        },
        [COLUMNS_MAP_KEY.PURCHASE]: {
            col_index: 'purchase',
            renderCellContent: jest.fn(() => '10.00'),
            title: 'Stake',
        },
        [COLUMNS_MAP_KEY.REFERENCE]: {
            col_index: 'reference',
            title: 'Ref. ID',
        },
        [COLUMNS_MAP_KEY.TYPE]: {
            col_index: 'type',
            key: 'icon',
            renderCellContent: jest.fn(() => contract_icons),
            title: '',
        },
    } as const;
    const body_props: React.ComponentProps<typeof MobileRowRenderer> = {
        row: {
            contract_info: {
                account_id: 112905368,
                barrier: '1033.40',
                barrier_count: 1,
                bid_price: 9.71,
                buy_price: 10,
                contract_id: 246421120968,
                contract_type: 'CALL',
                currency: 'USD',
                current_spot: 1034.03,
                current_spot_display_value: '1034.03',
                current_spot_time: 1718802820,
                date_expiry: future_time,
                date_settlement: future_time,
                date_start: 1718802531,
                display_name: 'Volatility 100 Index',
                entry_spot: 1033.4,
                entry_spot_display_value: '1033.40',
                entry_tick: 1033.4,
                entry_tick_display_value: '1033.40',
                entry_tick_time: 1718802532,
                expiry_time: future_time,
                id: 'dcbbe22b-e4d9-afa9-ce79-402fd3f11376',
                is_expired: 0,
                is_forward_starting: 0,
                is_intraday: 1,
                is_path_dependent: 0,
                is_settleable: 0,
                is_sold: 0,
                is_valid_to_cancel: 0,
                is_valid_to_sell: 1,
                longcode:
                    'Win payout if Volatility 100 Index is strictly higher than entry spot at 6 hours after contract start time.',
                payout: 19.73,
                profit: -0.29,
                profit_percentage: -2.9,
                purchase_time: 1718802531,
                shortcode: `CALL_R_100_19.73_1718802531_${future_time}_S0P_0`,
                status: 'open',
                transaction_ids: {
                    buy: 491236444088,
                },
                underlying: 'R_100',
            },
            details:
                'Win payout if Volatility 100 Index is strictly higher than entry spot at 6 hours after contract start time.',
            display_name: '',
            id: 246421120968,
            indicative: 9.71,
            payout: 19.73,
            purchase: 10,
            reference: 491236444088,
            type: 'CALL',
            barrier: 1033.4,
            entry_spot: 1033.4,
            profit_loss: -0.29,
            is_valid_to_sell: true,
            status: 'profit',
        },
        columns_map,
        server_time: toMoment(),
        current_focus: null,
        should_show_cancellation_warning: false,
        onClickCancel: jest.fn(),
        onClickSell: jest.fn(),
        measure: jest.fn(),
        addToast: jest.fn(),
        removeToast: jest.fn(),
        setCurrentFocus: jest.fn(),
        toggleCancellationWarning: jest.fn(),
        getContractById: jest.fn(),
        onClickRemove: jest.fn(),
    };
    const footer_props: React.ComponentProps<typeof MobileRowRenderer> = {
        ...body_props,
        row: {
            indicative: 9.64,
            purchase: 10,
            profit_loss: -0.36,
            payout: 19.73,
        },
    };
    const options_footer_titles = [
        COLUMNS_MAP_KEY.PURCHASE,
        COLUMNS_MAP_KEY.INDICATIVE,
        COLUMNS_MAP_KEY.PAYOUT,
        COLUMNS_MAP_KEY.PROFIT,
    ];
    const options_card_titles = [COLUMNS_MAP_KEY.REFERENCE, COLUMNS_MAP_KEY.CURRENCY, ...options_footer_titles];

    it('should render a MobileRowRenderer with contract card titles, Sell button and ProgressBar for non-Vanillas/non-Turbos options', () => {
        render(<MobileRowRenderer {...body_props} />);

        Object.keys(columns_map).forEach(key => {
            const title = columns_map[key as keyof typeof columns_map].title;
            if (options_card_titles.includes(key)) {
                expect(screen.getByText(columns_map[key as keyof typeof columns_map].title)).toBeInTheDocument();
            } else if (title) {
                expect(screen.queryByText(title)).not.toBeInTheDocument();
            }
        });
        expect(screen.getByText(contract_icons)).toBeInTheDocument();
        expect(screen.getByText(progress_bar)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Sell' })).toBeEnabled();
    });
    it('should render MobileRowRenderer for footer with totals for non-Vanilla/non-Turbos options', () => {
        render(<MobileRowRenderer {...footer_props} is_footer />);
        Object.keys(columns_map).forEach(key => {
            const title = columns_map[key as keyof typeof columns_map].title;
            if (options_footer_titles.includes(key)) {
                expect(screen.getByText(columns_map[key as keyof typeof columns_map].title)).toBeInTheDocument();
            } else if (title) {
                expect(screen.queryByText(title)).not.toBeInTheDocument();
            }
        });
        expect(screen.queryByText(contract_icons)).not.toBeInTheDocument();
        expect(screen.queryByText(progress_bar)).not.toBeInTheDocument();
        expect(screen.queryByRole('button', { name: 'Sell' })).not.toBeInTheDocument();
    });
    it('should render a non-footer MobileRowRenderer with ProgressSliderMobile for Vanillas/Turbos instead of ProgressBar', () => {
        const { rerender } = render(
            <MobileRowRenderer {...body_props} row={{ ...body_props.row, type: CONTRACT_TYPES.VANILLA.CALL }} />
        );
        expect(screen.getByText(progress_slider_mobile)).toBeInTheDocument();
        expect(screen.queryByText(progress_bar)).not.toBeInTheDocument();

        rerender(<MobileRowRenderer {...body_props} row={{ ...body_props.row, type: CONTRACT_TYPES.TURBOS.LONG }} />);
        expect(screen.getByText(progress_slider_mobile)).toBeInTheDocument();
        expect(screen.queryByText(progress_bar)).not.toBeInTheDocument();
    });
    it('should render a non-footer MobileRowRenderer with PositionsDrawerCard only for Multipliers/Accumulators instead of DataList cells displaying contract data', () => {
        const { rerender } = render(
            <MobileRowRenderer {...body_props} row={{ ...body_props.row, type: CONTRACT_TYPES.MULTIPLIER.UP }} />
        );
        expect(screen.getByText(positions_drawer_card)).toBeInTheDocument();
        expect(screen.queryByText(contract_icons)).not.toBeInTheDocument();
        expect(screen.queryByRole('button', { name: 'Sell' })).not.toBeInTheDocument();

        rerender(<MobileRowRenderer {...body_props} row={{ ...body_props.row, type: CONTRACT_TYPES.ACCUMULATOR }} />);
        expect(screen.getByText(positions_drawer_card)).toBeInTheDocument();
        expect(screen.queryByText(contract_icons)).not.toBeInTheDocument();
        expect(screen.queryByRole('button', { name: 'Sell' })).not.toBeInTheDocument();
    });
});
