import { BARRIER_COLORS, CONTRACT_TYPES } from '@deriv-lib/shared';

export const getHoveredColor = (type: string): string => {
    switch (type) {
        case CONTRACT_TYPES.TURBOS.SHORT:
            return BARRIER_COLORS.RED;
        case CONTRACT_TYPES.TURBOS.LONG:
            return BARRIER_COLORS.GREEN;
        default:
            return BARRIER_COLORS.BLUE;
    }
};
