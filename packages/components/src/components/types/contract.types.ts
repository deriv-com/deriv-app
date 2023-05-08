export type TGetContractPath = (contract_id?: number) => string;

export type TToastConfig = {
    key?: string;
    content: string;
    timeout?: number;
    is_bottom?: boolean;
    type?: string;
};

export type TErrorMessages = Readonly<{
    take_profit: string;
    stop_loss: string;
}>;
