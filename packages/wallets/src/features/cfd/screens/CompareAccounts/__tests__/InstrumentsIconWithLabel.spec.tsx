import React from 'react';
import { render, screen } from '@testing-library/react';
import InstrumentsIconWithLabel from '../InstrumentsIconWithLabel';

jest.mock('../../../../../public/images/tradingInstruments', () => ({
    __esModule: true,
    default: jest.fn().mockReturnValue({
        Forex: <svg data-testid='forex-icon' />,
    }),
}));

jest.mock('@deriv-com/ui', () => ({
    ...jest.requireActual('@deriv-com/ui'),
    useDevice: jest.fn(() => ({
        isMobile: false,
    })),
}));

describe('InstrumentsIconWithLabel', () => {
    const defaultProps = {
        highlighted: true,
        icon: 'Forex' as const,
        text: 'Forex',
    };

    it('renders default icon with label for given trading instrument', () => {
        render(<InstrumentsIconWithLabel {...defaultProps} />);

        expect(screen.getByTestId('dt_instruments_icon_container')).toBeInTheDocument();
        expect(screen.getByTestId('forex-icon')).toBeInTheDocument();
        expect(screen.getByText('Forex')).toBeInTheDocument();
    });

    it('renders asterisk when isAsterisk is true', () => {
        render(<InstrumentsIconWithLabel {...defaultProps} isAsterisk={true} />);

        expect(screen.getByText('*')).toBeInTheDocument();
    });
});
