export const extractInfoFromShortcode = shortcode => {
    const info_from_shortcode = {
        category: '',
        underlying: '',
        barrier_1: '',
    };
    // First group of regex pattern captures the trade category, second group captures the market's underlying
    const pattern = new RegExp('^([A-Z]+)_((1HZ[0-9-V]+)|((CRASH|BOOM)[0-9\\d]+)|(OTC_[A-Z0-9]+)|R_[\\d]{2,3}|[A-Z]+)');
    const extracted = pattern.exec(shortcode);
    if (extracted !== null) {
        info_from_shortcode.category = extracted[1].toLowerCase();
        info_from_shortcode.underlying = extracted[2];

        if (/^(CALL|PUT)$/i.test(info_from_shortcode.category)) {
            info_from_shortcode.barrier_1 = shortcode.split('_').slice(-2)[0];
        } else if (/^MULT/i.test(info_from_shortcode.category)) {
            info_from_shortcode.multiplier = shortcode.split('_').slice(-5)[0];
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
    if (extractInfoFromShortcode(shortcode)?.multiplier) return false;
    const start_time = shortcode.split('_')[3].replace(/\D/g, '');
    return start_time && purchase_time && +start_time !== +purchase_time;
};
