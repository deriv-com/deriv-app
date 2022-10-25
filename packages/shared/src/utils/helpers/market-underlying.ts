import { getMarketNamesMap, getContractConfig } from '../constants/contract';

type TTradeConfig = {
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

export const getTradeTypeName = (category: string) =>
    category
        ? (getContractConfig()[category.toUpperCase() as keyof typeof getContractConfig] as TTradeConfig).name
        : null;
