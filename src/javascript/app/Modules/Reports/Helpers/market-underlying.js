export const getMarketInformation = (shortcode) => {
    const market_info = {
        category  : '',
        underlying: '',
        atm       : '',
    };

    const pattern = new RegExp('^([A-Z]+)_((OTC_[A-Z0-9]+)|R_[\\d]{2,3}|[A-Z]+)_([\\d.\\d]+)_(\\d+\\w)_(\\d+\\w)_(S[\\d.\\d]+P|(?:\\d+))_(\\d+)'); // Used to get market name from shortcode
    const extracted = pattern.exec(shortcode);
    if (extracted !== null) {
        market_info.category   = extracted[1].toLowerCase();
        market_info.underlying = extracted[2];
        market_info.atm        = extracted[7];
    }

    return market_info;
};

export const isHighLow = (shortcode) => {
    const market_info = getMarketInformation(shortcode);
    if (/CALL|PUT/i.test(market_info.category)) {
        return !/^S[\d.\d]+P$/.test(market_info.atm);
    }

    return false;
};
