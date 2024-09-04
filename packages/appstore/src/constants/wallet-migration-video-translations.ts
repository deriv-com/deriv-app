export const WALLET_MIGRATION_VIDEO_TRANSLATIONS = {
    AR: 'e52c6a3b483e287e39e983791f50e592',
    EN: '25df7df0d0af48090b086cd6f103d8f3',
    // TODO: Add translations for other languages
} as const;

export const getWalletMigrationVideoTranslations = (language_key: keyof typeof WALLET_MIGRATION_VIDEO_TRANSLATIONS) => {
    if (language_key in WALLET_MIGRATION_VIDEO_TRANSLATIONS) {
        return WALLET_MIGRATION_VIDEO_TRANSLATIONS[language_key];
    }
    return WALLET_MIGRATION_VIDEO_TRANSLATIONS.EN;
};
