export type TContractType = {
    text?: string;
    value: string;
};

export type TFilteredContractType = Omit<TContractType, 'value'> & { value: string | string[] };

export type TContractCategory = {
    component?: JSX.Element | null;
    contract_types: TContractType[];
    icon?: string;
    is_unavailable?: boolean;
    key: string;
    label?: string;
};

export type TList = {
    component?: JSX.Element | null;
    contract_categories?: TContractCategory[];
    contract_types?: TContractType[];
    icon: string;
    label?: string;
    key: string;
};
