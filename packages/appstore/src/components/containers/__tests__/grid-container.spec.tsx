import React from 'react';
import GridContainer from '../grid-container';
import { render, screen } from '@testing-library/react';
import { StoreProvider, mockStore } from '@deriv/stores';

describe('GridContainer', () => {
    it('should render children', () => {
        const store = mockStore({});
        render(
            <StoreProvider store={store}>
                <GridContainer>
                    <div>
                        <h1>Traders hub</h1>
                    </div>
                </GridContainer>
            </StoreProvider>
        );
        expect(screen.getByText('Traders hub')).toBeInTheDocument();
    });
});
