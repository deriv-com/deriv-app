import { render, screen } from '@testing-library/react';

import { Button } from '@deriv/components';
import React from 'react';
import { Verified } from '../verified';
import { MemoryRouter } from 'react-router';

jest.mock('Components/poa/poa-button', () => jest.fn(() => <div data-testid='poa-button' />));

describe('<Verified/>', () => {
    const message = 'Your proof of identity is verified';
    const redirect_button = <Button>Lorem epsom</Button>;
    const needs_poa_msg = 'To continue trading, you must also submit a proof of address.';

    it('should render Verified component', () => {
        render(
            <MemoryRouter>
                <Verified />
            </MemoryRouter>
        );
        expect(screen.getByText(message)).toBeInTheDocument();
    });

    it('should show icon with message if needs_poa is false', () => {
        render(
            <MemoryRouter>
                <Verified />
            </MemoryRouter>
        );

        expect(screen.getByTestId('dt_IcPoaVerified')).toBeInTheDocument();
        expect(screen.getByText(message)).toBeInTheDocument();
    });

    it('should show redirect button if needs_poa and is_from_external are false and have redirect_button', () => {
        render(<Verified redirect_button={redirect_button} />);
        expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should show continue trading button if redirect_button is not passed', () => {
        render(
            <MemoryRouter>
                <Verified />
            </MemoryRouter>
        );
        expect(screen.getByText('Continue trading')).toBeInTheDocument();
    });

    it('should show poa buttons and the message if needs_poa is true and is_from_external is false ', () => {
        render(
            <MemoryRouter>
                <Verified needs_poa redirect_button={redirect_button} />
            </MemoryRouter>
        );
        expect(screen.getByTestId('poa-button')).toBeInTheDocument();
        expect(screen.getByText(needs_poa_msg)).toBeInTheDocument();
    });
});
