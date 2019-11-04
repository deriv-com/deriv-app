const Shortcode = (() => {
    const extractInfoFromShortcode = (shortcode) => {
        const info_from_shortcode = {
            category  : '',
            underlying: '',
            barrier_1 : '',
        };
        // First group of regex pattern captures the trade category, second group captures the market's underlying
        // TODO: Confirm if short code naming convention for 1 tick per sec underlying as 1HZ__V is going to remain consistent
        const pattern = new RegExp('^([A-Z]+)_((1HZ[0-9-V]+)|(OTC_[A-Z0-9]+)|R_[\\d]{2,3}|[A-Z]+)');
        const extracted = pattern.exec(shortcode);
        if (extracted !== null) {
            info_from_shortcode.category   = extracted[1].toLowerCase();
            info_from_shortcode.underlying = extracted[2];

            if (/^(CALL|PUT)$/i.test(info_from_shortcode.category)) {
                info_from_shortcode.barrier_1 = shortcode.split('_').slice(-2)[0];
            }
        }

        return info_from_shortcode;
    };

    const isHighLow = ({ shortcode = '', shortcode_info = '' }) => {
        const info_from_shortcode = shortcode ? extractInfoFromShortcode(shortcode) : shortcode_info;
        return (info_from_shortcode && info_from_shortcode.barrier_1) ? !/^S0P$/.test(info_from_shortcode.barrier_1) : false;
    };

    return {
        extractInfoFromShortcode,
        isHighLow,
    };
})();

module.exports = Shortcode;
