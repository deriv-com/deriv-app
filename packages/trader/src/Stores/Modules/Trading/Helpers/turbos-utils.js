import { BARRIER_COLORS } from '../../SmartChart/Constants/barriers';

// Get Turbos barrier Line Color Based on the Contract Type
export const getTurbosColor = type => {
    switch (type) {
        case 'TURBOSSHORT':
            return BARRIER_COLORS.RED;
        case 'TURBOSLONG':
        default:
            return BARRIER_COLORS.GRAY;
    }
};
