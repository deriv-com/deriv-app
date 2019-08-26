import ActiveSymbols                     from './activeSymbols';
import config                            from '../../../constants/const';
import { getObjectValue }                from '../../../utils/tools';
import { getTokenList, removeAllTokens } from '../../../utils/tokenHelper';

const noop = () => {};

let parsedAssetIndex;

const parseAssetIndex = assetIndex => {
    const parsed = {};

    assetIndex.forEach(symbol => {
        parsed[symbol[0].toLowerCase()] = {};

        symbol[2].forEach(category => {
            [, , parsed[symbol[0].toLowerCase()][category[0].toLowerCase()]] = category;
        });
    });
    return parsed;
};

const getAllowedConditionsOrCategoriesForSymbol = symbol => {
    const categories   = [];
    const symbol_index = parsedAssetIndex[symbol.toLowerCase()];
    let conditions     = [];

    if (symbol_index) {
        const symbol_trade_types = Object.keys(symbol_index);

        Object.keys(config.TRADE_TYPE_CATEGORIES).forEach(trade_type_category => {
            const category_trade_types = config.TRADE_TYPE_CATEGORIES[trade_type_category];

            symbol_trade_types.forEach(symbol_trade_type => {
                if (category_trade_types.includes(symbol_trade_type) || trade_type_category === symbol_trade_type) {
                    conditions = conditions.concat(category_trade_types);

                    if (!categories.includes(trade_type_category)) {
                        categories.push(trade_type_category);
                    }
                }
            });
        });
    }
    return { conditions, categories };
};

const getCategoryForCondition = condition =>
    Object.keys(config.TRADE_TYPE_CATEGORIES).find(
        category => config.TRADE_TYPE_CATEGORIES[category].indexOf(condition.toLowerCase()) >= 0
    );

export default class _Symbol {
    constructor(api) {
        this.api = api;
        this.initPromise = new Promise(resolve => {
            const getActiveSymbolsLogic = () => {
                this.api.getActiveSymbolsBrief().then(r => {
                    this.activeSymbols = new ActiveSymbols(r.active_symbols);
                    this.api.getAssetIndex().then(r2 => {
                        parsedAssetIndex = parseAssetIndex(r2.asset_index);
                        resolve();
                    }, noop);
                }, noop);
            };
            // Authorize the WS connection when possible for accurate offered Symbols & AssetIndex
            const tokenList = getTokenList();
            if (tokenList.length) {
                this.api
                    .authorize(tokenList[0].token)
                    .then(() => getActiveSymbolsLogic())
                    .catch(() => {
                        removeAllTokens();
                        getActiveSymbolsLogic();
                    });
            } else {
                getActiveSymbolsLogic();
            }
        });
    }

    /* eslint-disable class-methods-use-this */
    getLimitation(symbol, condition) {
        const category = getCategoryForCondition(condition);
        return {
            minDuration: parsedAssetIndex[symbol.toLowerCase()][category],
        };
    }

    isConditionAllowedInSymbol(symbol, condition) {
        const { conditions } = getAllowedConditionsOrCategoriesForSymbol(symbol);
        return conditions.includes(condition);
    }

    getConditionName(condition) {
        const [con1, con2] = config.opposites[condition.toUpperCase()];
        return `${getObjectValue(con1)}/${getObjectValue(con2)}`;
    }

    getCategoryNameForCondition(condition) {
        return config.TRADE_TYPE_CATEGORY_NAMES[getCategoryForCondition(condition)];
    }

    getAllowedCategories(symbol) {
        return getAllowedConditionsOrCategoriesForSymbol(symbol).categories;
    }

    getAllowedCategoryNames(symbol) {
        const { categories } = getAllowedConditionsOrCategoriesForSymbol(symbol);
        return categories.map(el => config.TRADE_TYPE_CATEGORY_NAMES[el]);
    }
    /* eslint-enable */
}
