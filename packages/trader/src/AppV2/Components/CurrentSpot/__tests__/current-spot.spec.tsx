import React from 'react';
import { render, screen } from '@testing-library/react';
import { CONTRACT_TYPES, mockContractInfo, TContractStore } from '@deriv/shared';
import { mockStore } from '@deriv/stores';
import TraderProviders from '../../../../trader-providers';
import ModulesProvider from 'Stores/Providers/modules-providers';
import CurrentSpot from '../current-spot';

const mocked_now = Math.floor(Date.now() / 1000);
const symbol = '1HZ100V';

describe('CurrentSpot', () => {
    let default_mock_store: ReturnType<typeof mockStore>;
    const tick_data = {
        ask: 405.76,
        bid: 405.56,
        epoch: mocked_now,
        id: 'f90a93f8-965a-28ab-a830-6253bff4cc98',
        pip_size: 2,
        quote: 405.66,
        symbol,
    };
    const current_spot = '405.6';
    const current_last_digit = '6';
    const ongoing_contract_info = mockContractInfo({
        barrier: '0',
        contract_id: 250136683588,
        contract_type: CONTRACT_TYPES.EVEN_ODD.EVEN,
        date_expiry: mocked_now + 1000,
        date_start: 1721636565,
        entry_tick: 389.39,
        is_expired: 0,
        is_path_dependent: 0,
        is_sold: 0,
        profit: -0.39,
        status: 'open',
        tick_count: 10,
        tick_stream: [
            {
                epoch: 1721636566,
                tick: 389.39,
                tick_display_value: '389.39',
            },
            {
                epoch: 1721636567,
                tick: 389.37,
                tick_display_value: '389.37',
            },
            {
                epoch: 1721636568,
                tick: 389.4,
                tick_display_value: '389.40',
            },
        ],
        underlying: symbol,
    });
    const closed_contract_info = mockContractInfo({
        barrier: '0',
        contract_id: 250136653148,
        contract_type: CONTRACT_TYPES.EVEN_ODD.ODD,
        date_expiry: 1721636554,
        date_start: 1721636544,
        entry_tick: 389.32,
        exit_tick_time: 1721636554,
        is_expired: 1,
        is_path_dependent: 0,
        is_sold: 1,
        profit: -10,
        sell_time: 1721636554,
        status: 'lost',
        tick_count: 10,
        tick_stream: [
            {
                epoch: 1721636545,
                tick: 389.32,
                tick_display_value: '389.32',
            },
            {
                epoch: 1721636546,
                tick: 389.35,
                tick_display_value: '389.35',
            },
            {
                epoch: 1721636547,
                tick: 389.36,
                tick_display_value: '389.36',
            },
            {
                epoch: 1721636548,
                tick: 389.43,
                tick_display_value: '389.43',
            },
            {
                epoch: 1721636549,
                tick: 389.5,
                tick_display_value: '389.50',
            },
            {
                epoch: 1721636550,
                tick: 389.39,
                tick_display_value: '389.39',
            },
            {
                epoch: 1721636551,
                tick: 389.31,
                tick_display_value: '389.31',
            },
            {
                epoch: 1721636552,
                tick: 389.33,
                tick_display_value: '389.33',
            },
            {
                epoch: 1721636553,
                tick: 389.43,
                tick_display_value: '389.43',
            },
            {
                epoch: 1721636554,
                tick: 389.38,
                tick_display_value: '389.38',
            },
        ],
        underlying: symbol,
    });
    const ongoing_contract = {
        digits_info: {
            1721636566: {
                digit: 9,
                spot: '389.39',
            },
            1721636567: {
                digit: 7,
                spot: '389.37',
            },
            1721636568: {
                digit: 0,
                spot: '389.30',
            },
            1721636569: {
                digit: 7,
                spot: '389.27',
            },
            1721636570: {
                digit: 6,
                spot: '389.26',
            },
            1721636571: {
                digit: 8,
                spot: '389.18',
            },
            1721636572: {
                digit: 7,
                spot: '389.27',
            },
            1721636573: {
                digit: 8,
                spot: '389.38',
            },
            1721636574: {
                digit: 7,
                spot: '389.47',
            },
            [mocked_now + 1000]: {
                digit: 4,
                spot: '389.44',
            },
        },
        display_status: 'purchased',
        is_digit_contract: true,
        is_ended: false,
        contract_info: ongoing_contract_info,
    } as unknown as TContractStore;
    const closed_contract = {
        digits_info: {
            1721636545: {
                digit: 2,
                spot: '389.32',
            },
            1721636546: {
                digit: 5,
                spot: '389.35',
            },
            1721636547: {
                digit: 6,
                spot: '389.36',
            },
            1721636548: {
                digit: 3,
                spot: '389.43',
            },
            1721636549: {
                digit: 0,
                spot: '389.50',
            },
            1721636550: {
                digit: 9,
                spot: '389.39',
            },
            1721636551: {
                digit: 1,
                spot: '389.31',
            },
            1721636552: {
                digit: 3,
                spot: '389.33',
            },
            1721636553: {
                digit: 3,
                spot: '389.43',
            },
            1721636554: {
                digit: 8,
                spot: '389.38',
            },
        },
        display_status: 'lost',
        is_digit_contract: true,
        is_ended: true,
        contract_info: closed_contract_info,
    } as unknown as TContractStore;
    const ongoing_contract_tick_stream = ongoing_contract.contract_info.tick_stream as { [key: string]: unknown }[];
    const ongoing_contract_current_tick = ongoing_contract_tick_stream?.length;

    beforeEach(() => {
        default_mock_store = mockStore({
            modules: {
                trade: {
                    tick_data: null,
                    symbol,
                },
            },
        });
    });

    const mockCurrentSpot = (store = default_mock_store) => (
        <TraderProviders store={store}>
            <ModulesProvider store={store}>
                <CurrentSpot />
            </ModulesProvider>
        </TraderProviders>
    );

    it('should render skeleton loader if has no tick data to display', () => {
        render(mockCurrentSpot());

        expect(screen.getByTestId('dt_skeleton')).toBeInTheDocument();
    });
    it('should render spot (tick.quote) without tick count if has tick data but no contract data', () => {
        default_mock_store.modules.trade.tick_data = tick_data;
        render(mockCurrentSpot());

        expect(screen.getByText(current_spot)).toBeInTheDocument();
        expect(screen.getByText(current_last_digit)).toBeInTheDocument();
    });
    it('should render the latest tick_stream spot from last contract info together with tick count when has last contract data', () => {
        default_mock_store.modules.trade.tick_data = tick_data;
        default_mock_store.contract_trade.last_contract = ongoing_contract;
        default_mock_store.contract_trade.prev_contract = closed_contract;
        render(mockCurrentSpot());

        const spot = ongoing_contract_tick_stream?.[2].tick_display_value as string;
        expect(screen.getByText(`Tick ${ongoing_contract_current_tick}`)).toBeInTheDocument();
        expect(screen.getByText(spot.slice(0, -1))).toBeInTheDocument();
        expect(screen.getByText(spot.slice(-1))).toBeInTheDocument();
    });
    it('should render 2 tick counts for animation purposes when next contract is opened while previous contract is ongoing', () => {
        default_mock_store.modules.trade.tick_data = tick_data;
        default_mock_store.contract_trade.prev_contract = {
            ...ongoing_contract,
            contract_info: {
                ...ongoing_contract_info,
                contract_id: 250136683587,
                tick_stream: [...ongoing_contract_tick_stream, ...ongoing_contract_tick_stream],
            },
        };
        default_mock_store.contract_trade.last_contract = ongoing_contract;

        const { rerender } = render(mockCurrentSpot());

        expect(screen.getByText(`Tick ${ongoing_contract_current_tick}`)).toBeInTheDocument();
        const spot = ongoing_contract_tick_stream?.[2].tick_display_value as string;
        expect(screen.getByText(spot.slice(0, -1))).toBeInTheDocument();
        expect(screen.getByText(spot.slice(-1))).toBeInTheDocument();

        rerender(
            mockCurrentSpot({
                ...default_mock_store,
                contract_trade: {
                    ...default_mock_store.contract_trade,
                    prev_contract: ongoing_contract,
                    last_contract: {
                        ...ongoing_contract,
                        contract_info: {
                            ...ongoing_contract_info,
                            contract_id: 250136683589,
                            tick_stream: ongoing_contract_tick_stream.slice(0, 1),
                        },
                    },
                },
            })
        );
        expect(screen.getAllByText(/Tick/)).toHaveLength(2);
        const new_spot = ongoing_contract_tick_stream?.[0].tick_display_value as string;
        expect(screen.getByText(new_spot.slice(0, -1))).toBeInTheDocument();
        expect(screen.getByText(new_spot.slice(-1))).toBeInTheDocument();
    });
    it('should render spot (tick.quote) without tick count if last contract is closed', () => {
        default_mock_store.modules.trade.tick_data = tick_data;
        default_mock_store.contract_trade.last_contract = closed_contract;
        render(mockCurrentSpot());

        expect(screen.queryByText(/Tick/)).not.toBeInTheDocument();
        expect(screen.getByText(current_spot)).toBeInTheDocument();
        expect(screen.getByText(current_last_digit)).toBeInTheDocument();
    });
});
