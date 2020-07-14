import { isMultiplierContract } from '@deriv/shared';
import { BARRIER_COLORS, BARRIER_LINE_STYLES } from '../../SmartChart/Constants/barriers';
import { ChartBarrierStore } from '../../SmartChart/chart-barrier-store';
import { removeBarrier } from '../../SmartChart/Helpers/barriers';

const isLimitOrderBarrierSupported = (contract_type, contract_info) =>
    isMultiplierContract(contract_type) && contract_info.limit_order;

export const LIMIT_ORDER_TYPES = {
    STOP_OUT: 'stop_out',
    TAKE_PROFIT: 'take_profit',
    STOP_LOSS: 'stop_loss',
};

export const setLimitOrderBarriers = ({ barriers, contract_type, contract_info = {}, is_over }) => {
    if (is_over && isLimitOrderBarrierSupported(contract_type, contract_info)) {
        const limit_orders = Object.values(LIMIT_ORDER_TYPES);
        const has_stop_loss = Object.keys(contract_info.limit_order).some(
            k => k === LIMIT_ORDER_TYPES.STOP_LOSS && contract_info.limit_order[k].value
        );

        limit_orders.forEach(key => {
            const obj_limit_order = contract_info.limit_order[key];

            if (!obj_limit_order || !obj_limit_order.value) {
                removeBarrier(barriers, key);
                return;
            }

            let barrier = barriers.find(b => b.key === key);

            if (barrier) {
                if (barrier.high === +obj_limit_order.value) {
                    return;
                }

                barrier.onChange({
                    high: obj_limit_order.value,
                });
            } else {
                const obj_barrier = {
                    key,
                    title: `${obj_limit_order.display_name}`,
                    color: key === LIMIT_ORDER_TYPES.TAKE_PROFIT ? BARRIER_COLORS.GREEN : BARRIER_COLORS.ORANGE,
                    draggable: false,
                    lineStyle:
                        key === LIMIT_ORDER_TYPES.STOP_OUT ? BARRIER_LINE_STYLES.DOTTED : BARRIER_LINE_STYLES.SOLID,
                    hidePriceLines: has_stop_loss && key === LIMIT_ORDER_TYPES.STOP_OUT,
                    hideOffscreenLine: true,
                    showOffscreenArrows: true,
                    isSingleBarrier: true,
                    opacityOnOverlap: key === LIMIT_ORDER_TYPES.STOP_OUT && 0.15,
                };
                barrier = new ChartBarrierStore(obj_limit_order.value);

                Object.assign(barrier, obj_barrier);
                barriers.push(barrier);
            }
        });
    } else {
        const limit_orders = Object.values(LIMIT_ORDER_TYPES);
        limit_orders.forEach(l => removeBarrier(barriers, l));
    }
};

/**
 * Get limit_order for contract_update API
 * @param {object} contract_update - contract_update input & checkbox values
 */
export const getLimitOrder = contract_update => {
    const {
        has_contract_update_stop_loss,
        has_contract_update_take_profit,
        contract_update_stop_loss,
        contract_update_take_profit,
    } = contract_update;

    const limit_order = {};

    // send positive take_profit to update or null cancel
    limit_order.take_profit = has_contract_update_take_profit ? +contract_update_take_profit : null;

    // send positive stop_loss to update or null to cancel
    limit_order.stop_loss = has_contract_update_stop_loss ? +contract_update_stop_loss : null;

    return limit_order;
};
