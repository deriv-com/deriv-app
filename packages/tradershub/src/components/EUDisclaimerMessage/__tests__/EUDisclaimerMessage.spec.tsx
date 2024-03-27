import React from 'react';
import { render, screen } from '@testing-library/react';
import EUDisclaimerMessage from '../EUDisclaimerMessage';

describe('EUDisclaimerMessage component', () => {
    it('renders the EU disclaimer message correctly', () => {
        render(<EUDisclaimerMessage />);

        expect(screen.getByText(/EU statutory disclaimer/i)).toBeInTheDocument();

        expect(
            screen.getByText(
                /: CFDs are complex instruments and come with a high risk of losing money rapidly due to leverage./i
            )
        ).toBeInTheDocument();

        expect(
            screen.getByText(/70.1% of retail investor accounts lose money when trading CFDs with this provider/i)
        ).toBeInTheDocument();

        expect(
            screen.getByText(
                /. You should consider whether you understand how CFDs work and whether you can afford to take the high risk of losing your money./i
            )
        ).toBeInTheDocument();
    });
});
