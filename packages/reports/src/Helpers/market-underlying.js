import { getMarketNamesMap, getContractConfig } from '_common/contract';
import { localize } from '@deriv/translations';

/**
 * Fetch market information from shortcode
 * @param shortcode: string
 * @returns {{underlying: string, category: string}}
 */

// TODO: Combine with  extractInfoFromShortcode function in shared, both are currently used
export const getMarketInformation = shortcode => {
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

export const getMarketName = underlying => (underlying ? getMarketNamesMap()[underlying.toUpperCase()] : null);

export const getTradeTypeName = (category, is_high_low = false) =>
    category ? getContractConfig(is_high_low)[category.toUpperCase()].name : null;

export const getContractDurationType = (longcode, shortcode) => {
    if (/^MULTUP|MULTDOWN/.test(shortcode)) return '';

    const duration_pattern = new RegExp('ticks|tick|seconds|minutes|minute|hour|hours');
    const extracted = duration_pattern.exec(longcode);
    if (extracted !== null) {
        const duration_type = extracted[0];
        const duration_text = duration_type[0].toUpperCase() + duration_type.slice(1);
        return duration_text.endsWith('s') ? duration_text : `${duration_text}s`;
    }
    return localize('Days');
};
