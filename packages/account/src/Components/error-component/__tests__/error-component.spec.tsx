import React from 'react';

import { mockStore, StoreProvider } from '@deriv/stores';
import { render, screen } from '@testing-library/react';

import ErrorComponent from '../error-component';

jest.mock('@deriv/components', () => ({
    ...jest.requireActual('@deriv/components'),
    PageError: () => <div>PageError</div>,
}));

describe('<ErrorComponent/>', () => {
    it('should render PageError component', () => {
        render(
            <StoreProvider store={mockStore({})}>
                <ErrorComponent />
            </StoreProvider>
        );
        expect(screen.getByText('PageError')).toBeInTheDocument();
    });
});
