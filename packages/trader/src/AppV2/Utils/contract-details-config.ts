import { CONTRACT_TYPES } from '@deriv/shared';

const defaultConfig = {
    isTakeProfitVisible: false,
    isDealCancellationVisible: false,
    isStopLossVisible: false,
    isTpHistoryVisible: false,
};

export const getContractDetailsConfig = (contractType: string) => {
    const config = {
        [CONTRACT_TYPES.ACCUMULATOR]: {
            isTakeProfitVisible: true,
            isDealCancellationVisible: false,
            isStopLossVisible: false,
            isTpHistoryVisible: true,
        },
        [CONTRACT_TYPES.MULTIPLIER.UP]: {
            isTakeProfitVisible: true,
            isDealCancellationVisible: true,
            isStopLossVisible: true,
            isTpHistoryVisible: true,
        },
        [CONTRACT_TYPES.MULTIPLIER.DOWN]: {
            isTakeProfitVisible: true,
            isDealCancellationVisible: true,
            isStopLossVisible: true,
            isTpHistoryVisible: true,
        },
        [CONTRACT_TYPES.TURBOS.LONG]: {
            isTakeProfitVisible: true,
            isDealCancellationVisible: false,
            isStopLossVisible: false,
            isTpHistoryVisible: true,
        },
        [CONTRACT_TYPES.TURBOS.SHORT]: {
            isTakeProfitVisible: true,
            isDealCancellationVisible: false,
            isStopLossVisible: false,
            isTpHistoryVisible: true,
        },
    } as const;

    return config[contractType as keyof typeof config] || defaultConfig;
};
