export type TContractStage = 0 | 1 | 2 | 3 | 4 | 5;

export const contract_stages = Object.freeze({
    NOT_RUNNING: 0,
    STARTING: 1,
    PURCHASE_SENT: 2,
    PURCHASE_RECEIVED: 3,
    IS_STOPPING: 4,
    CONTRACT_CLOSED: 5,
});
