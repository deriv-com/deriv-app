import { useTranslations } from '@deriv-com/translations';
import { TPlatforms } from '../../../../types';
import { CFD_PLATFORMS } from '../../constants';

type TValues = {
    instruments?: string[];
    isEuRegion: boolean;
    localize: ReturnType<typeof useTranslations>['localize'];
    platform: TPlatforms.All;
};

const getHighlightedIconLabel = (values: TValues) => {
    const { instruments, isEuRegion, localize, platform } = values;
    const forexInstrument = instruments?.find(instrument => instrument.toLowerCase().indexOf('forex') !== -1);
    const getForexLabel = () => {
        if (forexInstrument) {
            switch (forexInstrument?.toLowerCase()) {
                case 'forex: major/minor':
                    return localize('Forex: major/minor');
                case 'forex: standard/micro':
                    return localize('Forex: standard/micro');
                case 'forex: standard/exotic':
                    return localize('Forex: standard/exotic');
                case 'forex: standard':
                    return localize('Forex: standard');
                default:
                    return localize('Forex');
            }
        }
        return platform === CFD_PLATFORMS.CTRADER ? localize('Forex: major/minor') : localize('Forex: standard/micro');
    };

    const shouldHighlight = (instrument: string) => {
        if (platform === CFD_PLATFORMS.CTRADER || platform === CFD_PLATFORMS.DXTRADE) {
            return true;
        }

        return Boolean(instruments?.includes(instrument));
    };

    return [
        { highlighted: shouldHighlight(getForexLabel()), icon: 'Forex', text: getForexLabel() },
        { highlighted: shouldHighlight('Stocks'), icon: 'Stocks', text: localize('Stocks') },
        { highlighted: shouldHighlight('Stock indices'), icon: 'StockIndices', text: localize('Stock indices') },
        {
            highlighted: shouldHighlight('Commodities'),
            icon: 'Commodities',

            text: localize('Commodities'),
        },
        {
            highlighted: shouldHighlight('Cryptocurrencies'),
            icon: 'Cryptocurrencies',
            text: localize('Cryptocurrencies'),
        },
        ...(!isEuRegion
            ? ([{ highlighted: shouldHighlight('ETFs'), icon: 'ETF', text: localize('ETFs') }] as const)
            : []),
        {
            highlighted: shouldHighlight('Synthetic indices'),
            icon: 'Synthetics',
            isAsterisk: isEuRegion,
            text: localize('Synthetic indices'),
        },
        ...(!isEuRegion
            ? ([
                  { highlighted: shouldHighlight('Basket indices'), icon: 'Baskets', text: localize('Basket indices') },
              ] as const)
            : []),
        ...(!isEuRegion
            ? ([
                  { highlighted: shouldHighlight('Derived FX'), icon: 'DerivedFX', text: localize('Derived FX') },
              ] as const)
            : []),
    ] as const;
};

const getPlatformType = (platform: TPlatforms.All) => {
    switch (platform) {
        case CFD_PLATFORMS.MT5:
            return 'MT5';
        case CFD_PLATFORMS.CTRADER:
            return 'CTrader';
        case CFD_PLATFORMS.DXTRADE:
            return 'DerivX';
        default:
            return 'OtherCFDs';
    }
};

export { getHighlightedIconLabel, getPlatformType };
