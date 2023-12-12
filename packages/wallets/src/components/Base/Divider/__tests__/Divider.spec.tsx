import React from 'react';
import { render, screen } from '@testing-library/react';
import Divider from '../Divider';

describe('Divider', () => {
    const mockProps: React.ComponentProps<typeof Divider> = {
        color: '#f2f3f4',
        margin: '1rem',
        variant: 'vertical',
    };
    it('should render proper borderColor', () => {
        render(<Divider {...mockProps} />);
        const elemet = screen.getByTestId('dt_divider');

        expect(elemet).toHaveStyle('borderColor: #f2f3f4');
    });
    it('should render proper margin', () => {
        render(<Divider {...mockProps} />);
        const elemet = screen.getByTestId('dt_divider');

        expect(elemet).toHaveStyle('margin: 1rem');
    });

    it('should has proper class', () => {
        render(<Divider {...mockProps} />);
        const elemet = screen.getByTestId('dt_divider');

        expect(elemet).toHaveClass('wallets-divider wallets-divider--vertical');
        expect(elemet).not.toHaveClass('wallets-divider wallets-divider--horizontal');
    });
});
