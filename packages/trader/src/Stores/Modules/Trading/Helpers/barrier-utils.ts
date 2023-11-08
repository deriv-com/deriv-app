import { BARRIER_COLORS, TRADE_TYPES } from '@deriv/shared';

export const getHoveredColor = (type: string): string => {
    switch (type) {
        case TRADE_TYPES.TURBOS.SHORT.toUpperCase():
            return BARRIER_COLORS.RED;
        case TRADE_TYPES.TURBOS.LONG.toUpperCase():
            return BARRIER_COLORS.GREEN;
        default:
            return BARRIER_COLORS.GRAY;
    }
};
