export type TWalletsIntro = {
    title: string;
    description: string;
    bullets: string[];
    eu_user?: boolean;
    image?: React.ReactNode;
};

export type TReadyToUpgradeWallets = {
    is_eu: boolean;
    toggleCheckbox: () => void;
};
