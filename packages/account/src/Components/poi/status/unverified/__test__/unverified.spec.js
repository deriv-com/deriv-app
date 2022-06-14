import React from 'react';
import { render, screen } from '@testing-library/react';
import { PlatformContext } from '@deriv/shared';
import { Unverified } from '../unverified.jsx';

jest.mock('@deriv/components', () => {
    const original_module = jest.requireActual('@deriv/components');
    return {
        ...original_module,
        Icon: jest.fn(() => <div data-testid='dt_mocked_icon' />),
    };
});

describe('Unverified', () => {
    const renderWithRouter = component =>
        render(<PlatformContext.Provider value={{ is_appstore: true }}>{component}</PlatformContext.Provider>);

    it('should render unverified component', () => {
        renderWithRouter(<Unverified />);

        expect(screen.getByText(/We could not verify your proof of identity/i)).toBeInTheDocument();
        expect(screen.getByTestId(/dt_mocked_icon/)).toBeInTheDocument();
    });

    it('should show description message', () => {
        renderWithRouter(<Unverified is_description_enabled={true} />);

        expect(
            screen.getByText(
                /As a precaution, we have disabled trading, deposits and withdrawals for this account. If you have any questions, please go to our Help Center/i
            )
        ).toBeInTheDocument();
        expect(screen.getByTestId(/dt_mocked_icon/)).toBeInTheDocument();
    });

    it('should render Icon component when is_appstore is false', () => {
        render(
            <PlatformContext.Provider value={{ is_appstore: false }}>
                <Unverified />
            </PlatformContext.Provider>
        );

        expect(screen.getByText(/We could not verify your proof of identity/i)).toBeInTheDocument();
        expect(screen.getByTestId(/dt_mocked_icon/)).toBeInTheDocument();
    });
});
