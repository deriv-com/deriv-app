const Shortcode = (() => {
    let info_from_shortcode = {
        category  : '',
        underlying: '',
        atm       : '',
    };

    const extractInfoFromShortcode = (shortcode) => {
        const pattern = new RegExp('^([A-Z]+)_((OTC_[A-Z0-9]+)|R_[\\d]{2,3}|[A-Z]+)_([\\d.\\d]+)_(\\d+\\w)_(\\d+\\w)_(S[\\d.\\d]+P|(?:\\d+))_(\\d+)'); // Used to get market name from shortcode
        const extracted = pattern.exec(shortcode);
        if (extracted !== null) {
            info_from_shortcode.shortcode  = shortcode;
            info_from_shortcode.category   = extracted[1].toLowerCase();
            info_from_shortcode.buy_price  = extracted[4];
            info_from_shortcode.underlying = extracted[2];
            info_from_shortcode.atm        = extracted[7];
        }

        return info_from_shortcode;
    };

    const isHighLow = (shortcode) => {
        if (shortcode) {
            info_from_shortcode = extractInfoFromShortcode(shortcode);
        }
        if (/CALL|PUT/i.test(info_from_shortcode.category)) {
            return !/^S0P$/.test(info_from_shortcode.atm);
        }

        return false;
    };

    return {
        extractInfoFromShortcode,
        isHighLow,
    };
})();

module.exports = Shortcode;
