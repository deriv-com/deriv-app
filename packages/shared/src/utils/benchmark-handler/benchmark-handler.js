export const benchmarkHandler = (id, phase, actual_time, base_duration, start_time, commit_time) => {
    if (phase === 'mount') {
        // send to data layer
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
};
