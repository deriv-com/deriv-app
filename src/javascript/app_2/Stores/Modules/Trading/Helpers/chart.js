export const setChartBarrier = (SmartChartStore, proposal_response, onBarrierChange, barrier_config) => {
    const { barrier, barrier2, contract_type } = proposal_response.echo_req;
    SmartChartStore.createBarriers(
        contract_type,
        barrier,
        barrier2,
        onBarrierChange,
        barrier_config,
    );
};
