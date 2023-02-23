import { BARRIER_COLORS } from '../../SmartChart/Constants/barriers';

export const getHoveredColor = type => {
    switch (type) {
        case 'TURBOSSHORT':
            return BARRIER_COLORS.RED;
        case 'TURBOSLONG':
            return BARRIER_COLORS.GREEN;
        default:
            return BARRIER_COLORS.GRAY;
    }
};
