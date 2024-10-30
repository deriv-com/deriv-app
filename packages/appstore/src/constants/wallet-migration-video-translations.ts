export const WALLET_MIGRATION_VIDEO_TRANSLATIONS = {
    AR: 'e52c6a3b483e287e39e983791f50e592',
    EN: '25df7df0d0af48090b086cd6f103d8f3',
    // ES: 'ef6e04a732ebf193106e62c4d9307637', TODO: Uncomment this when Spanish translations are ready
    FR: 'e444c765e24eaad80dcb1549d1018c0f',
    // TODO: Add translations for other languages
} as const;

export const getWalletMigrationVideoTranslations = (language_key: keyof typeof WALLET_MIGRATION_VIDEO_TRANSLATIONS) => {
    if (language_key in WALLET_MIGRATION_VIDEO_TRANSLATIONS) {
        return WALLET_MIGRATION_VIDEO_TRANSLATIONS[language_key];
    }
    return WALLET_MIGRATION_VIDEO_TRANSLATIONS.EN;
};
