import { getContractConfig, getMarketNamesMap } from '@deriv/shared';
import { localize } from '@deriv/translations';

type TMarketInfo = {
    category: string;
    underlying: string;
};

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
export const getMarketInformation = (shortcode: string): TMarketInfo => {
    const market_info: TMarketInfo = {
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

export const getTradeTypeName = (category: string, is_high_low = false) =>
    category
        ? (getContractConfig(is_high_low)[category.toUpperCase() as keyof typeof getContractConfig] as TTradeConfig)
              .name
        : null;

export const getContractDurationType = (longcode: string, shortcode: string): string => {
    if (/^(MULTUP|MULTDOWN)/.test(shortcode)) return '';

    const duration_pattern = new RegExp('ticks|tick|seconds|minutes|minute|hour|hours');
    const extracted = duration_pattern.exec(longcode);
    if (extracted !== null) {
        const duration_type = extracted[0];
        const duration_text = duration_type[0].toUpperCase() + duration_type.slice(1);
        return duration_text.endsWith('s') ? duration_text : `${duration_text}s`;
    }
    return localize('Days');
};
