type TContract = {
    high_barrier?: null | string;
    barriers?: number;
    barrier?: null | string;
    low_barrier?: null | string;
    expiry_type: string;
};

type TObjectBarrier = Pick<TContract, 'barrier' | 'low_barrier' | 'high_barrier'>;

type TAccumulatorBarriers = {
    high_barrier: string;
    low_barrier: string;
};

export const buildBarriersConfig = (contract: TContract, barriers = { count: contract.barriers }) => {
    if (!contract.barriers) {
        return undefined;
    }

    const obj_barrier: TObjectBarrier = {};

    ['barrier', 'low_barrier', 'high_barrier'].forEach(field => {
        if (field in contract) obj_barrier[field as keyof TObjectBarrier] = contract[field as keyof TObjectBarrier];
    });

    return Object.assign(barriers || {}, {
        [contract.expiry_type]: obj_barrier,
    });
};

/**
 * Here we calculate and return Accumulator Barriers for DTrader page for the reason that
    we can't use barriers from proposal or proposal_open_contract because
    these responses are separate API calls which sometimes when network capacity is low come
    much later than we receive the current tick from ticks_history call.
    This calculation is performed only on DTrader page (not in Contract Details) to visually synchronize ticks & barriers.
 * @param {number | undefined} tick_size_barrier - e.g. 0.000648677482
 * @param {number | undefined} spot - e.g. 9017.26
 * @param {number | undefined} spot_pip_size - e.g. 2
 * @returns {Object} barriers, e.g. { high_barrier: '9023.110', low_barrier: '9011.410' }
 */
export const getAccumulatorBarriers = (
    tick_size_barrier?: number,
    spot?: number,
    spot_pip_size?: number
): TAccumulatorBarriers => {
    if (!tick_size_barrier || !spot || !spot_pip_size) return { high_barrier: '', low_barrier: '' };
    const high_barrier = (1 + tick_size_barrier) * spot;
    const low_barrier = (1 - tick_size_barrier) * spot;
    // spot pip size + 1 extra digit = ACCU barriers pip size (e.g. 3), which we convert to precision (e.g. 0.001):
    const accu_barriers_pip_size = spot_pip_size + 1;
    const precision = Math.pow(10, -accu_barriers_pip_size);
    const rounded_high_barrier = Math.ceil(high_barrier / precision) * precision;
    const rounded_low_barrier = Math.floor(low_barrier / precision) * precision;
    return {
        high_barrier: isNaN(rounded_high_barrier) ? '' : rounded_high_barrier.toFixed(accu_barriers_pip_size),
        low_barrier: isNaN(rounded_low_barrier) ? '' : rounded_low_barrier.toFixed(accu_barriers_pip_size),
    };
};

/**
 * Here we calculate and return distance (difference) between each barrier value and a spot value between Accumulator barriers range.
    we can't use barriers from proposal or proposal_open_contract because
    these responses are separate API calls which sometimes when network capacity is low come
    much later than we receive the current tick from ticks_history call.
    This calculation is performed together with barriers calculation only on DTrader page (not in Contract Details) to display relevant data.
 * @param {string} high_barrier - e.g. '9017.413'
 * @param {number | undefined} spot - e.g. 9017.26
 * @param {number | undefined} spot_pip_size - e.g. 2
 * @returns {string} barriers, e.g. '0.153'
 */
export const getAccuBarrierSpotDistance = (high_barrier: string, spot?: number, spot_pip_size?: number): string => {
    if (!high_barrier || !spot || !spot_pip_size) return '';
    // spot pip size + 1 extra digit = ACCU pip size (e.g. 3):
    const accu_barriers_pip_size = spot_pip_size + 1;
    const difference = Math.abs(+high_barrier - spot);
    return difference.toFixed(accu_barriers_pip_size);
};

export const getBarrierPipSize = (barrier: string) => {
    if (barrier.length < 1 || isNaN(+barrier)) return 0;
    return barrier.split('.')[1]?.length || 0;
};
