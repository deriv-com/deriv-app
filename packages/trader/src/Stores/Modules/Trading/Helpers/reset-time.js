import { getDurationMaps } from 'Stores/Modules/Trading/Helpers/duration';

export const getResetDisplayValues = (reset_value, reset_unit) => {
    let reset_display_values = {
        reset_value,
        reset_unit: getDurationMaps()[reset_unit].display,
    };

    if (reset_value === 1 && reset_unit === 'm') {
        reset_display_values = {
            reset_value: getDurationMaps().m.to_second * reset_value,
            reset_unit: getDurationMaps().s.display,
        };
    } else if (reset_value === 1 && reset_unit === 'h') {
        reset_display_values = {
            reset_value: getDurationMaps().h.to_minute * reset_value,
            reset_unit: getDurationMaps().m.display,
        };
    } else if (reset_value === 1 && reset_unit === 'd') {
        reset_display_values = {
            reset_value: getDurationMaps().d.to_hour * reset_value,
            reset_unit: getDurationMaps().h.display,
        };
    }

    reset_display_values.reset_value = Math.floor(reset_display_values.reset_value / 2);
    return reset_display_values;
};
