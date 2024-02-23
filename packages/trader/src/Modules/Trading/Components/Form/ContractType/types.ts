export type TContractType = {
    text?: string;
    value: string;
};

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

export type TTemporaryEvents = {
    ce_contracts_set_up_form: ContractsSetupForm;
};

type ContractsSetupForm = {
    action: 'change_parameter_value' | 'run_contract';
    duration_type?: string;
    form_name: string;
    input_type?: string;
    parameter_field_type?: string;
    parameter_type?: string;
    parameter_value?: string;
    trade_type_name: string;
    switcher_duration_mode_name?: string;
    switcher_stakepayout_mode_name?: string;
};
