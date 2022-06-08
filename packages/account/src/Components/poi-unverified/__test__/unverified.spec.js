import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { PlatformContext } from '@deriv/shared';
import { Unverified } from '../unverified.jsx';

jest.mock('@deriv/components', () => {
    const original_module = jest.requireActual('@deriv/components');
    return {
        ...original_module,
        Icon: jest.fn(() => <div data-testid='mockedIcon' />),
    };
});

describe('Unverified', () => {
    const renderWithRouter = component =>
        render(
            <PlatformContext.Provider value={{ is_appstore: true }}>
                <BrowserRouter>{component}</BrowserRouter>
            </PlatformContext.Provider>
        );

    it('should render unverified page', () => {
        renderWithRouter(<Unverified />);

        expect(screen.getByText(/We could not verify your proof of identity/i)).toBeInTheDocument();
        expect(screen.getByTestId(/mockedIcon/)).toBeInTheDocument();
    });

    describe('return true message from is_description_enabled', () => {
        beforeEach(() => {
            renderWithRouter(<Unverified is_description_enabled={true} />);
        });

        it('will show description message', () => {
            expect(
                screen.getByText(
                    /As a precaution, we have disabled trading, deposits and withdrawals for this account. If you have any questions, please go to our Help Center/i
                )
            ).toBeInTheDocument();
            expect(screen.getByTestId(/mockedIcon/)).toBeInTheDocument();
        });
    });

    describe('return false from is_appstore and true from is_description_enabled', () => {
        beforeEach(() => {
            render(
                <PlatformContext.Provider value={{ is_appstore: false }}>
                    <BrowserRouter>
                        <Unverified />
                    </BrowserRouter>
                </PlatformContext.Provider>
            );
        });

        it('will show IcPoiError icon', () => {
            expect(screen.getByText(/We could not verify your proof of identity/i)).toBeInTheDocument();
            expect(screen.getByTestId(/mockedIcon/)).toBeInTheDocument();
        });
    });
});
