// category_underlying_amount
const base_pattern =
    '^([A-Z]+)_((?:1HZ[0-9-V]+)|(?:(?:CRASH|BOOM)[0-9\\d]+)|(?:OTC_[A-Z0-9]+)|R_[\\d]{2,3}|[A-Z]+)_([\\d.]+)';

// category_underlying_amount_multiplier_starttime
const multipliers_regex = new RegExp(`${base_pattern}_(\\d+)_(\\d+)`);

// category_underlying_amount_starttime_endtime_barrier
const options_regex = new RegExp(`${base_pattern}_(\\d+)_([A-Z\\d]+)_?([A-Z\\d]+)?`);

export const extractInfoFromShortcode = shortcode => {
    const info_from_shortcode = {
        category: '',
        underlying: '',
        barrier_1: '',
    };

    const is_multipliers = /^MULT/i.test(shortcode);
    // First group of regex pattern captures the trade category, second group captures the market's underlying
    const pattern = is_multipliers ? multipliers_regex : options_regex;
    const extracted = pattern.exec(shortcode);
    if (extracted !== null) {
        info_from_shortcode.category = extracted[1].toLowerCase();
        info_from_shortcode.underlying = extracted[2];

        if (is_multipliers) {
            info_from_shortcode.multiplier = extracted[4];
            info_from_shortcode.start_time = extracted[5];
        } else {
            info_from_shortcode.start_time = extracted[4];
        }

        if (/^(CALL|PUT)$/i.test(info_from_shortcode.category)) {
            info_from_shortcode.barrier_1 = extracted[6];
        }
    }

    return info_from_shortcode;
};

export const isHighLow = ({ shortcode = '', shortcode_info = '' }) => {
    const info_from_shortcode = shortcode ? extractInfoFromShortcode(shortcode) : shortcode_info;
    return info_from_shortcode && info_from_shortcode.barrier_1 ? !/^S0P$/.test(info_from_shortcode.barrier_1) : false;
};

export const isMultiplier = ({ shortcode = '', shortcode_info = '' }) => {
    const info_from_shortcode = shortcode ? extractInfoFromShortcode(shortcode) : shortcode_info;
    return info_from_shortcode && info_from_shortcode.category
        ? /^mult(up|down)$/.test(info_from_shortcode.category)
        : false;
};

export const isForwardStarting = (shortcode, purchase_time) => {
    const shortcode_info = extractInfoFromShortcode(shortcode);
    if (shortcode_info?.multiplier) return false;
    const start_time = shortcode_info?.start_time;
    return start_time && purchase_time && +start_time !== +purchase_time;
};
