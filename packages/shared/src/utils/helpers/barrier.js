export const buildBarriersConfig = (contract, barriers = { count: contract.barriers }) => {
    if (!contract.barriers) {
        return undefined;
    }

    const obj_barrier = {};

    ['barrier', 'low_barrier', 'high_barrier'].forEach(field => {
        if (field in contract) obj_barrier[field] = contract[field];
    });

    return Object.assign(barriers || {}, {
        [contract.expiry_type]: obj_barrier,
    });
};

export const getBarrierPipSize = barrier => {
    if (Math.floor(barrier) === barrier || barrier.length < 1 || barrier % 1 === 0 || isNaN(barrier)) return 0;
    return barrier.toString().split('.')[1].length || 0;
};
