import React from 'react';
import {
    IllustrativeBasketIndicesIcon,
    IllustrativeCommoditiesIcon,
    IllustrativeCryptocurrenciesIcon,
    IllustrativeDerivedFxIcon,
    IllustrativeEtfIcon,
    IllustrativeForexIcon,
    IllustrativeStockIndicesIcon,
    IllustrativeStocksIcon,
    IllustrativeSyntheticIndicesIcon,
} from '@deriv/quill-icons';

const getInstrumentsIcons = (isDesktop: boolean) => {
    const size = isDesktop ? { height: 24, width: 24 } : { height: 16, width: 16 };

    return {
        Baskets: <IllustrativeBasketIndicesIcon {...size} />,
        Commodities: <IllustrativeCommoditiesIcon {...size} />,
        Cryptocurrencies: <IllustrativeCryptocurrenciesIcon {...size} />,
        DerivedFX: <IllustrativeDerivedFxIcon {...size} />,
        ETF: <IllustrativeEtfIcon {...size} />,
        Forex: <IllustrativeForexIcon {...size} />,
        StockIndices: <IllustrativeStockIndicesIcon {...size} />,
        Stocks: <IllustrativeStocksIcon {...size} />,
        Synthetics: <IllustrativeSyntheticIndicesIcon {...size} />,
    };
};

export default getInstrumentsIcons;
