import { TContractStore } from '../../contract';
import { getLimitOrder, LIMIT_ORDER_TYPES, setLimitOrderBarriers } from '../limit-orders';

describe('getLimitOrder', () => {
    it('should return correct limit order when values change', () => {
        const contract_update = {
            has_contract_update_stop_loss: true,
            has_contract_update_take_profit: true,
            contract_update_stop_loss: 50,
            contract_update_take_profit: 100,
            contract_info: {
                limit_order: {
                    take_profit: {
                        order_amount: 80,
                    },
                    stop_loss: {
                        order_amount: 40,
                    },
                },
            },
        } as TContractStore;
        const result = getLimitOrder(contract_update);
        expect(result).toEqual({
            take_profit: 100,
            stop_loss: 50,
        });
    });
    it('should return empty object when values remain unchanged', () => {
        const contract_update = {
            has_contract_update_stop_loss: false,
            has_contract_update_take_profit: false,
            contract_update_stop_loss: '',
            contract_update_take_profit: '',
            contract_info: {
                limit_order: {
                    take_profit: {
                        order_amount: 100,
                    },
                    stop_loss: {
                        order_amount: 50,
                    },
                },
            },
        } as TContractStore;
        const result = getLimitOrder(contract_update);
        expect(result).toEqual({ stop_loss: null, take_profit: null });
    });
});

describe('setLimitOrderBarriers', () => {
    let contract_info: Parameters<typeof setLimitOrderBarriers>[0]['contract_info'],
        barriers: Parameters<typeof setLimitOrderBarriers>[0]['barriers'];
    let contract_type = 'MULTUP';
    const mock_barrier = {
        color: 'blue',
        lineStyle: 'solid',
        high: '',
        low: '',
        onChange: jest.fn(),
        relative: false,
        draggable: false,
        hidePriceLines: false,
        onChartBarrierChange: jest.fn(),
        updateBarriers: jest.fn(),
        updateBarrierShade: jest.fn(),
        onBarrierChange: jest.fn(),
        barrier_count: 1,
        default_shade: 'acbd',
    };

    beforeEach(() => {
        contract_info = {
            growth_rate: 0.1,
            spot_time: 1,
            spot: 1,
            cancellation: {},
            error_code: '',
            error_field: '',
            has_error: false,
            has_error_details: false,
            commission: 1,
            id: '',
            message: '',
            obj_contract_basis: {
                text: '',
                value: '',
            },
            payout: 1,
            profit: '',
            returns: '',
            stake: '',
            limit_order: {
                take_profit: {},
                stop_loss: {},
                stop_out: {},
            },
            barrier: '2650',
        };
    });
    it('should remove barriers when limit_order is empty but is_over is true and limit order barriers are supported', () => {
        barriers = [];
        setLimitOrderBarriers({
            barriers,
            contract_type,
            contract_info,
            is_over: true,
        });
        expect(barriers).toHaveLength(0);
    });
    it('should update barriers with changed obj_limit_order values', () => {
        barriers = [{ ...mock_barrier, key: LIMIT_ORDER_TYPES.STOP_OUT, high: 10, title: 'Stop Out' }];
        if (contract_info?.limit_order?.stop_out) {
            contract_info.limit_order.stop_out.value = '15';
            contract_info.limit_order.stop_out.display_name = 'Dừng';
        }
        setLimitOrderBarriers({
            barriers,
            contract_type,
            contract_info,
            is_over: true,
        });
        expect(barriers[0].onChange).toHaveBeenCalledWith({
            hidePriceLines: false,
            high: '15',
            title: 'Dừng',
        });
    });
    it('should create and add a new barrier if conditions are met', () => {
        barriers = [];
        if (contract_info?.limit_order?.take_profit && contract_info?.limit_order?.stop_loss) {
            contract_info.limit_order.take_profit.value = '15';
            contract_info.limit_order.stop_loss.value = '5';
        }
        setLimitOrderBarriers({
            barriers,
            is_over: true,
            contract_type,
            contract_info,
        });
        const hasTakeProfit = barriers.some(barrier => barrier.key === 'take_profit');
        const hasStopLoss = barriers.some(barrier => barrier.key === 'stop_loss');
        const hasStopOut = barriers.some(barrier => barrier.key === 'stop_out');

        expect(hasTakeProfit).toBe(true);
        expect(hasStopLoss).toBe(true);
        expect(hasStopOut).toBe(false);
    });
    it('should remove barriers when is_over is true and limit order barriers are not supported', () => {
        barriers = [];
        contract_type = 'some_contract_type';

        setLimitOrderBarriers({
            barriers,
            contract_type,
            contract_info,
            is_over: true,
        });
        expect(barriers).toHaveLength(0);
    });
});
