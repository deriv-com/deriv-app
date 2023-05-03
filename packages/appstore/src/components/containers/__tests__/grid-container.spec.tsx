import React from 'react';
import GridContainer from '../grid-container';
import { render, screen } from '@testing-library/react';
import { StoreProvider, mockStore } from '@deriv/stores';

describe('GridContainer', () => {
    it('should render children', () => {
        const store = mockStore({});
        const traders_hub_label = 'Traders Hub';
        render(
            <StoreProvider store={store}>
                <GridContainer>
                    <div>
                        <h1>{traders_hub_label}</h1>
                    </div>
                </GridContainer>
            </StoreProvider>
        );
        expect(screen.getByText(traders_hub_label)).toBeInTheDocument();
    });
});
