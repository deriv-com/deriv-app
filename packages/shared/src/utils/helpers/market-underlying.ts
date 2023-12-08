import { getMarketNamesMap, getContractConfig } from '../constants/contract';

type TTradeConfig = {
    button_name?: JSX.Element;
    name: JSX.Element;
    position: string;
};

/**
 * Fetch market information from shortcode
 * @param shortcode: string
 * @returns {{underlying: string, category: string}}
 */

// TODO: Combine with  extractInfoFromShortcode function in shared, both are currently used
export const getMarketInformation = (shortcode: string) => {
    const market_info = {
        category: '',
        underlying: '',
    };

    const pattern = new RegExp(
        '^([A-Z]+)_((1HZ[0-9-V]+)|((CRASH|BOOM)[0-9\\d]+[A-Z]?)|(OTC_[A-Z0-9]+)|R_[\\d]{2,3}|[A-Z]+)'
    );
    const extracted = pattern.exec(shortcode);
    if (extracted !== null) {
        market_info.category = extracted[1].toLowerCase();
        market_info.underlying = extracted[2];
    }

    return market_info;
};

export const getMarketName = (underlying: string) =>
    underlying ? getMarketNamesMap()[underlying.toUpperCase() as keyof typeof getMarketNamesMap] : null;

export const getTradeTypeName = (category: string, is_high_low = false, show_button_name = false) => {
    const trade_type =
        category &&
        (getContractConfig(is_high_low)[category.toUpperCase() as keyof typeof getContractConfig] as TTradeConfig);
    if (!trade_type) return null;
    return (show_button_name && trade_type.button_name) || trade_type.name || null;
};
