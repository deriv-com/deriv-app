type TComponetnPhase = 'mount' | 'update' | 'nested-update';

type TBenchmarkHandler = (
    id: string,
    phase: TComponetnPhase,
    actual_time: number,
    base_duration: number,
    start_time: number,
    commit_time: number
) => void;

/**
 * The function is intended to be used as a callback for the React Profiler.
 * @param {string} id
 * @param {'mount'|'update'|'nested-update'} phase
 * @param {number} actual_time
 * @param {number} base_duration
 * @param {number} start_time
 * @param {number} commit_time
 */
export const benchmarkHandler: TBenchmarkHandler = (id, phase, actual_time, base_duration, start_time, commit_time) => {
    if (phase === 'mount') {
        // send to data layer
        if (window?.dataLayer) {
            window.dataLayer.push({
                event: `${id}-mount-time`,
                data: {
                    component_id: id,
                    component_phase: phase,
                    component_mount_time: actual_time,
                    component_duration_time: base_duration,
                    component_start_time: start_time,
                    component_commit_time: commit_time,
                },
            });
        }
    }
};
