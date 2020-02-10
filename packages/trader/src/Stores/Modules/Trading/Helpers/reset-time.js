import { getDurationMaps } from 'Stores/Modules/Trading/Helpers/duration';

export const getResetDisplayValues = (reset_value, reset_unit) => {
    let reset_time_str = '';
    let val;

    const mid_point = reset_value / 2; // a Reset happens at midpoint

    const duration_map = getDurationMaps();

    if (mid_point % 1 !== 0 && /[mh]/.test(reset_unit)) {
        val = Math.floor(mid_point);
        switch (reset_unit) {
            case 'm':
                reset_time_str = `${
                    val ? `${val} ${val > 1 ? duration_map.m.display_plural : duration_map.m.display_singular}` : ''
                } 30 ${duration_map.s.display_plural}`;
                break;
            case 'h':
                reset_time_str = `${val || ''} 30 ${
                    val > 1 ? duration_map.m.display_plural : duration_map.m.display_singular
                }`;
                break;
            default: // no default
        }
    } else {
        val = reset_unit === 't' ? Math.floor(mid_point) : Math.ceil(mid_point);
        reset_time_str = `${val} ${
            val > 1 ? duration_map[reset_unit].display_plural : duration_map[reset_unit].display_singular
        }`;
    }

    return { reset_display_value: reset_time_str };
};
