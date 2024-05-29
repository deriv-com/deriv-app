import { CONTRACT_TYPES } from '@deriv/shared';

const DEFAULT_CONFIG = {
    is_take_profit_visible: false,
    is_deal_cancellation_visible: false,
    is_stop_loss_visible: false,
    is_tp_history_visible: false,
};

export const getContractDetailsConfig = (contract_type: string) => {
    const config = {
        [CONTRACT_TYPES.ACCUMULATOR]: {
            is_take_profit_visible: true,
            is_deal_cancellation_visible: false,
            is_stop_loss_visible: false,
            is_tp_history_visible: true,
        },
        [CONTRACT_TYPES.MULTIPLIER.UP || CONTRACT_TYPES.MULTIPLIER.DOWN]: {
            is_take_profit_visible: true,
            is_deal_cancellation_visible: true,
            is_stop_loss_visible: true,
            is_tp_history_visible: true,
        },
        [CONTRACT_TYPES.TURBOS.LONG || CONTRACT_TYPES.TURBOS.SHORT]: {
            is_take_profit_visible: true,
            is_deal_cancellation_visible: false,
            is_stop_loss_visible: false,
            is_tp_history_visible: true,
        },
    } as const;

    return config[contract_type as keyof typeof config] || DEFAULT_CONFIG;
};
