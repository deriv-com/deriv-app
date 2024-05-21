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
    [key: string]: React.ReactNode;
};

export const TranslationFlag: TTranslationFlag = {
    AR: <FlagArabLeagueIcon />,
    EN: <FlagUnitedKingdomIcon />,
    ES: <FlagSpainIcon />,
    BN: <FlagBangladeshIcon />,
    DE: <FlagGermanyIcon />,
    FR: <FlagFranceIcon />,
    ID: <FlagIndonesiaIcon />,
    IT: <FlagItalyIcon />,
    // KO: ,
    MN: <FlagMongoliaIcon />,
    PL: <FlagPolandIcon />,
    PT: <FlagPortugalIcon />,
    RU: <FlagRussiaIcon />,
    SI: <FlagSriLankaIcon />,
    TR: <FlagTurkeyIcon />,
    VI: <FlagVietnamIcon />,
    ZH_CN: <FlagChinaSimplifiedIcon />,
    ZH_TW: <FlagChinaTraditionalIcon />,
    TH: <FlagThailandIcon />,
};
