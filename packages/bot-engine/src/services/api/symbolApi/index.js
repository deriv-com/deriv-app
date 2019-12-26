import ActiveSymbols                     from './activeSymbols';
import { getTokenList, removeAllTokens } from '../../../utils/tokenHelper';

const noop = () => {};

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

export default class _Symbol {
    constructor(api) {
        this.api = api;
        this.initPromise = new Promise(resolve => {
            const getActiveSymbolsLogic = () => {
                this.api.getActiveSymbolsBrief().then(r => {
                    this.activeSymbols = new ActiveSymbols(r.active_symbols);
                    this.api.getAssetIndex().then(r2 => {
                        parseAssetIndex(r2.asset_index);
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
}
