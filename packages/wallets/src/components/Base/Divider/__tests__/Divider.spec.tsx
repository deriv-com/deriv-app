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
        const element = screen.getByTestId('dt_divider');

        expect(element).toHaveStyle('borderColor: #f2f3f4');
    });
    it('should render proper margin', () => {
        render(<Divider {...mockProps} />);
        const element = screen.getByTestId('dt_divider');

        expect(element).toHaveStyle('margin: 1rem');
    });

    it('should has proper class', () => {
        render(<Divider {...mockProps} />);
        const element = screen.getByTestId('dt_divider');

        expect(element).toHaveClass('wallets-divider wallets-divider--vertical');
        expect(element).not.toHaveClass('wallets-divider wallets-divider--horizontal');
    });
});
