export const buildBarriersConfig = (contract, barriers = { count: contract.barriers }) => {
    if (!contract.barriers) {
        return undefined;
    }

    const obj_barrier = {};

    ['barrier', 'low_barrier', 'high_barrier'].forEach((field) => {
        if (field in contract) obj_barrier[field] = contract[field];
    });

    return Object.assign(barriers || {}, {
        [contract.expiry_type]: obj_barrier,
    });
};
