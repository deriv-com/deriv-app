import { render, screen } from '@testing-library/react';
import React from 'react';
import { Unverified } from '../unverified.jsx';
import { PlatformContext } from '@deriv/shared';
import { BrowserRouter } from 'react-router-dom';

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
        expect(screen.getByTestId(/test-icon__true/)).toBeInTheDocument();
    });

    describe('return true message from is_description_enabled', () => {
        beforeEach(() => {
            renderWithRouter(<Unverified is_description_enabled={true} />);
        });

        it('will show description message', () => {
            expect(screen.getByTitle('description_message')).toBeInTheDocument();
            expect(screen.getByTestId(/test-icon__true/)).toBeInTheDocument();
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
            expect(screen.getByTestId(/test-icon__false/)).toBeInTheDocument();
        });
    });
});
