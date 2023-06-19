import { ContractUpdate, ProposalOpenContract } from '@deriv/api-types';

export type TContractStore = {
    contract_info: ProposalOpenContract;
    contract_update_take_profit: number | string;
    contract_update_stop_loss: number | string;
    clearContractUpdateConfigValues: () => void;
    has_contract_update_take_profit: boolean;
    has_contract_update_stop_loss: boolean;
    updateLimitOrder: () => void;
    validation_errors: { contract_update_stop_loss: string[]; contract_update_take_profit: string[] };
    onChange: (param: { name: string; value: string | number | boolean }) => void;
};

export type TContractInfo = ProposalOpenContract & {
    contract_update?: ContractUpdate;
};

export type TTickItem = {
    epoch?: number;
    tick?: null | number;
    tick_display_value?: null | string;
};

export type TDigitsInfo = { [key: number]: { digit: number; spot: string } };

type TLimitProperty = {
    display_name?: string;
    order_amount?: null | number;
    order_date?: number;
    value?: null | string;
};

export type TLimitOrder = Partial<Record<'stop_loss' | 'stop_out' | 'take_profit', TLimitProperty>>;
