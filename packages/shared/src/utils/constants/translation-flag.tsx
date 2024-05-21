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
    FlagThailandIcon,
    FlagTurkeyIcon,
    FlagUnitedKingdomIcon,
    FlagVietnamIcon,
} from '@deriv/quill-icons';

type TTranslationFlag = {
    [key: string]: (size?: number) => React.ReactNode;
};

export const TranslationFlag: TTranslationFlag = {
    AR: size => <FlagArabLeagueIcon width={size} height={size} />,
    EN: size => <FlagUnitedKingdomIcon width={size} height={size} />,
    ES: size => <FlagSpainIcon width={size} height={size} />,
    BN: size => <FlagBangladeshIcon width={size} height={size} />,
    DE: size => <FlagGermanyIcon width={size} height={size} />,
    FR: size => <FlagFranceIcon width={size} height={size} />,
    ID: size => <FlagIndonesiaIcon width={size} height={size} />,
    IT: size => <FlagItalyIcon width={size} height={size} />,
    // KO: ,
    MN: size => <FlagMongoliaIcon width={size} height={size} />,
    PL: size => <FlagPolandIcon width={size} height={size} />,
    PT: size => <FlagPortugalIcon width={size} height={size} />,
    RU: size => <FlagRussiaIcon width={size} height={size} />,
    SI: size => <FlagSriLankaIcon width={size} height={size} />,
    TR: size => <FlagTurkeyIcon width={size} height={size} />,
    VI: size => <FlagVietnamIcon width={size} height={size} />,
    ZH_CN: size => <FlagChinaSimplifiedIcon width={size} height={size} />,
    ZH_TW: size => <FlagChinaTraditionalIcon width={size} height={size} />,
    TH: size => <FlagThailandIcon width={size} height={size} />,
};
