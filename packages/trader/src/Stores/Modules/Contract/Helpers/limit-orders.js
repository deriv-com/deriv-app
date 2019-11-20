import { isMultiplierContract }       from './multiplier';
import { BARRIER_COLORS,
    BARRIER_LINE_STYLES }             from '../../SmartChart/Constants/barriers';
import { ChartBarrierStore }          from '../../SmartChart/chart-barrier-store';
import { removeBarrier }              from '../../SmartChart/Helpers/barriers';

export const LIMIT_ORDER_TYPES = {
    TAKE_PROFIT: 'take_profit',
    STOP_LOSS  : 'stop_loss',
    STOP_OUT   : 'stop_out',
};

const isLimitOrderBarrierSupported = (contract_type, contract_info) =>
    isMultiplierContract(contract_type) && contract_info.limit_order;

export const setLimitOrderBarriers = ({
    barriers,
    contract_type,
    contract_info = {},
    hide_stop_out_barrier = false,
    is_over,
}) => {

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
                    hideBarrierLine  : hide_stop_out_barrier && key === LIMIT_ORDER_TYPES.STOP_OUT,
                    hideOffscreenLine: true,
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

/**
 * Get stop_loss & take_profit order amount from contract_info
 * @param {object} contract_info - proposal_open_contract response
 */
export const getLimitOrderAmount = (contract_info) => {
    const {
        limit_order: {
            stop_loss: {
                order_amount: stop_loss_order_amount,
            } = {},
            take_profit: {
                order_amount: take_profit_order_amount,
            } = {},
        } = {},
    } = contract_info;

    return {
        stop_loss  : stop_loss_order_amount,
        take_profit: take_profit_order_amount,
    };
};

/**
 * Get limit_order for contract_update API
 * @param {object} contract_update - contract_update input & checkbox values
 */
export const getLimitOrder = (contract_update) => {
    const {
        has_stop_loss,
        has_take_profit,
        stop_loss,
        take_profit,
    } = contract_update;

    const has_limit_order = take_profit > 0 || stop_loss > 0;

    if (!has_limit_order) {
        return null;
    }

    const limit_order = {};

    if (take_profit > 0) {
        // send positive take_profit to update or null cancel
        limit_order.take_profit = has_take_profit ? +take_profit : null;
    }

    if (stop_loss > 0) {
        // send negative stop_loss to update or null to cancel
        limit_order.stop_loss = has_stop_loss ? -stop_loss : null;
    }

    return limit_order;
};
