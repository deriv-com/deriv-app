export type TGetContractPath = (contract_id?: number) => string;

export type TToastConfig = {
    key: string;
    content: string;
    type: string;
    timeout?: number;
    is_bottom?: boolean;
};

export type TErrorMessages = Readonly<{
    take_profit: string;
    stop_loss: string;
}>;
