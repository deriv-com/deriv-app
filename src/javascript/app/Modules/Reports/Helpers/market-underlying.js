export const getMarketInformation = (payload) => {
    const market_info = {
        category  : '',
        underlying: '',
        atm       : '',
    };

    const pattern = new RegExp('^([A-Z]+)_((OTC_[A-Z0-9]+)|R_[\\d]{2,3}|[A-Z]+)_([\\d.\\d]+)_(\\d+)_(\\d+)_(S[\\d.\\d]+P|(?:\\d+))_(\\d+)'); // Used to get market name from shortcode
    const extracted = pattern.exec(payload.shortcode);
    if (extracted !== null) {
        market_info.category   = extracted[1].toLowerCase();
        market_info.underlying = extracted[2];
        market_info.atm        = extracted[7];
    }
    return market_info;
};
