import { BARRIER_COLORS } from '@deriv/shared';

export const getHoveredColor = (type: string): string => {
    switch (type) {
        case 'TURBOSSHORT':
            return BARRIER_COLORS.RED;
        case 'TURBOSLONG':
            return BARRIER_COLORS.GREEN;
        default:
            return BARRIER_COLORS.BLUE;
    }
};
