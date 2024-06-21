import React from 'react';
import {
    FlagArabLeagueIcon,
    FlagBangladeshIcon,
    FlagChinaSimplifiedIcon,
    FlagChinaTraditionalIcon,
    FlagFranceIcon,
    FlagGermanyIcon,
    FlagIndonesiaIcon,
    FlagItalyIcon,
    FlagMongoliaIcon,
    FlagPolandIcon,
    FlagPortugalIcon,
    FlagRussiaIcon,
    FlagSpainIcon,
    FlagSriLankaIcon,
    FlagTanzaniaIcon,
    FlagThailandIcon,
    FlagTurkeyIcon,
    FlagUnitedKingdomIcon,
    FlagVietnamIcon,
} from '@deriv/quill-icons';

type TTranslationFlag = {
    [key: string]: (width?: number, height?: number) => React.ReactNode;
};

export const TranslationFlag: TTranslationFlag = {
    AR: (width, height) => <FlagArabLeagueIcon width={width} height={height} />,
    EN: (width, height) => <FlagUnitedKingdomIcon width={width} height={height} />,
    ES: (width, height) => <FlagSpainIcon width={width} height={height} />,
    BN: (width, height) => <FlagBangladeshIcon width={width} height={height} />,
    DE: (width, height) => <FlagGermanyIcon width={width} height={height} />,
    FR: (width, height) => <FlagFranceIcon width={width} height={height} />,
    ID: (width, height) => <FlagIndonesiaIcon width={width} height={height} />,
    IT: (width, height) => <FlagItalyIcon width={width} height={height} />,
    // KO: ,
    MN: (width, height) => <FlagMongoliaIcon width={width} height={height} />,
    PL: (width, height) => <FlagPolandIcon width={width} height={height} />,
    PT: (width, height) => <FlagPortugalIcon width={width} height={height} />,
    RU: (width, height) => <FlagRussiaIcon width={width} height={height} />,
    SI: (width, height) => <FlagSriLankaIcon width={width} height={height} />,
    SW: (width, height) => <FlagTanzaniaIcon width={width} height={height} />,
    TR: (width, height) => <FlagTurkeyIcon width={width} height={height} />,
    VI: (width, height) => <FlagVietnamIcon width={width} height={height} />,
    ZH_CN: (width, height) => <FlagChinaSimplifiedIcon width={width} height={height} />,
    ZH_TW: (width, height) => <FlagChinaTraditionalIcon width={width} height={height} />,
    TH: (width, height) => <FlagThailandIcon width={width} height={height} />,
};
