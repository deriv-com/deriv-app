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
    [key: string]: (size?: 'sm' | 'md' | 'lg' | 'xs') => React.ReactNode;
};

export const TranslationFlag: TTranslationFlag = {
    AR: size => <FlagArabLeagueIcon iconSize={size} />,
    EN: size => <FlagUnitedKingdomIcon iconSize={size} />,
    ES: size => <FlagSpainIcon iconSize={size} />,
    BN: size => <FlagBangladeshIcon iconSize={size} />,
    DE: size => <FlagGermanyIcon iconSize={size} />,
    FR: size => <FlagFranceIcon iconSize={size} />,
    ID: size => <FlagIndonesiaIcon iconSize={size} />,
    IT: size => <FlagItalyIcon iconSize={size} />,
    // KO: ,
    MN: size => <FlagMongoliaIcon iconSize={size} />,
    PL: size => <FlagPolandIcon iconSize={size} />,
    PT: size => <FlagPortugalIcon iconSize={size} />,
    RU: size => <FlagRussiaIcon iconSize={size} />,
    SI: size => <FlagSriLankaIcon iconSize={size} />,
    SW: size => <FlagTanzaniaIcon iconSize={size} />,
    TR: size => <FlagTurkeyIcon iconSize={size} />,
    VI: size => <FlagVietnamIcon iconSize={size} />,
    ZH_CN: size => <FlagChinaSimplifiedIcon iconSize={size} />,
    ZH_TW: size => <FlagChinaTraditionalIcon iconSize={size} />,
    TH: size => <FlagThailandIcon iconSize={size} />,
};
