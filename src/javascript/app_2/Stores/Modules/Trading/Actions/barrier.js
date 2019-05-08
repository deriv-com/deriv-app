export const getBarrierValues = ({ barrier_values = {} }) => ({
    barrier_1: barrier_values.barrier || barrier_values.high_barrier || '',
    barrier_2: barrier_values.low_barrier || '',
});
