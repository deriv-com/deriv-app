import { ContractUpdate, ProposalOpenContract } from '@deriv/api-types';
import { useStore } from '@deriv/stores';

export type TRootStore = ReturnType<typeof useStore>;
export type TContractStore = TRootStore['contract_store'];

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
