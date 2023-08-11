export type TGetContractPath = (contract_id?: number) => string;

export type TToastConfig = {
    key: string;
    content: string | React.ReactNode;
    is_bottom?: boolean;
    timeout?: number;
    type: string;
};

export type TErrorMessages = Readonly<{
    take_profit: string;
    stop_loss: string;
}>;
