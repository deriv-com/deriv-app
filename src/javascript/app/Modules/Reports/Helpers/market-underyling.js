export const getMarketInformation = (payload) => {
    const pattern = new RegExp('^([A-Z]+)_((OTC_[A-Z0-9]+)|R_[\\d]{2,3}|[A-Z]+)_'); // Used to get market name from shortcode
    const extracted = pattern.exec(payload.shortcode);
    if (extracted !== null) {
        return {
            category  : extracted[1].toLowerCase(),
            underlying: extracted[2],
        };
    }
    return null;
};
