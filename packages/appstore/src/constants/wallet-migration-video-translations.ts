export const WALLET_MIGRATION_VIDEO_TRANSLATIONS = {
    AR: 'e52c6a3b483e287e39e983791f50e592',
    BN: '42956ab96be4975ed48765c57fe83153',
    DE: 'd7c4d6846e939d90a387ce4f069fb011',
    EN: '25df7df0d0af48090b086cd6f103d8f3',
    ES: 'ef6e04a732ebf193106e62c4d9307637',
    FR: 'e444c765e24eaad80dcb1549d1018c0f',
    IT: '171e886b747c31d53fccfa62835457f2',
    KM: '822f34d7f3d3af22e217f505c1ba97f9',
    KO: '76185e5007ba30de02c35f982e2abf88',
    PL: 'b58e38563c0f08997619beba4876fa01',
    PT: '9ff5a292b00c7eefe72af77428e1fe35',
    RU: '932be9817e60bdaae87d657d609b38d2',
    SI: 'a1840bd4ed92217a8669d562ef5cc5d8',
    SW: '6f83c4e1933f37f437d051031145f9f1',
    TH: '585d162254b3eb06804d9749a95d21f1',
    TR: 'c1dd6e120eb9bf70d95c1796fde9f2b5',
    UZ: 'dd4d5cd0a90bd72f3ad90cba90600710',
    VI: '7af868e0f038a2ca03d0c6a67db38a45',
    ZH_CN: '578e9f02c496d8086d6af97327c8ec6a',
    ZH_TW: '74f928ac56b382c346e05460620b1fdc',
} as const;

export const getWalletMigrationVideoTranslations = (language_key: keyof typeof WALLET_MIGRATION_VIDEO_TRANSLATIONS) => {
    if (language_key in WALLET_MIGRATION_VIDEO_TRANSLATIONS) {
        return WALLET_MIGRATION_VIDEO_TRANSLATIONS[language_key];
    }
    return WALLET_MIGRATION_VIDEO_TRANSLATIONS.EN;
};
