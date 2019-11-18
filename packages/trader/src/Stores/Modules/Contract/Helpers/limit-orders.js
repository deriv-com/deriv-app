import { isMultiplierContract }       from './multiplier';
import { BARRIER_COLORS,
    BARRIER_LINE_STYLES }             from '../../SmartChart/Constants/barriers';
import { ChartBarrierStore }          from '../../SmartChart/chart-barrier-store';

export const LIMIT_ORDER_TYPES = {
    TAKE_PROFIT: 'take_profit',
    STOP_LOSS  : 'stop_loss',
    STOP_OUT   : 'stop_out',
};

const removeBarrier = (barriers, key) => {
    for (let i = 0; barriers && i < barriers.length; i++){
        const barrier = barriers[i];
        if (barrier.key === key) {
            barriers.splice(i,1);
        }
    }
};

const isLimitOrderBarrierSupported = (contract_type, contract_info) =>
    isMultiplierContract(contract_type) && contract_info.limit_order;

export const setLimitOrderBarriers = (barriers, is_over, contract_type, contract_info = {}) => {

    if (is_over && isLimitOrderBarrierSupported(contract_type, contract_info)) {
        Object.keys(contract_info.limit_order).forEach((key)=>{
            const obj_limit_order = contract_info.limit_order[key];

            let barrier  = barriers.find((b)=>b.key === key);

            if (barrier) {
                barrier.onChange({
                    high: obj_limit_order.value,
                });
            } else {
                const obj_barrier = {
                    key,
                    title: `${obj_limit_order.display_name}`,
                    color: key === LIMIT_ORDER_TYPES.TAKE_PROFIT ?
                        BARRIER_COLORS.GREEN
                        :
                        BARRIER_COLORS.ORANGE,
                    draggable: false,
                    lineStyle: key === LIMIT_ORDER_TYPES.STOP_OUT ?
                        BARRIER_LINE_STYLES.DOTTED
                        :
                        BARRIER_LINE_STYLES.SOLID,
                    hideOffscreenLines: true,
                };
                barrier = new ChartBarrierStore(
                    obj_limit_order.value
                );

                Object.assign(barrier, obj_barrier);
                barriers.push(barrier);
            }
        });
    } else {
        const limit_orders = Object.values(LIMIT_ORDER_TYPES);
        limit_orders.forEach((l) => removeBarrier(barriers, l));
    }
};
