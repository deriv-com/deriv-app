export type TModalContent = {
    account_type_card: string;
    selectAccountTypeCard: React.Dispatch<React.SetStateAction<string>>;
    is_financial_available: boolean;
    is_synthetic_available: boolean;
};

export type TAccountType = {
    title_and_type: string;
    description: string;
    icon: string;
};

export type TAccountCard = {
    account_type_card: string;
    title_and_type: string;
    description: string;
    icon: string;
    selectAccountTypeCard: React.Dispatch<React.SetStateAction<string>>;
};
