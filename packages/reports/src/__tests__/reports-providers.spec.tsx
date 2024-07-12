import React from 'react';
import { mockStore } from '@deriv/stores';
import { render, screen } from '@testing-library/react';
import ReportsProviders from '../reports-providers';

describe('ReportsProviders', () => {
    it('should render ReportsProviders with children', () => {
        const mock_child = 'Mock Child';
        render(
            <ReportsProviders store={mockStore({})}>
                <div>{mock_child}</div>
            </ReportsProviders>
        );

        expect(screen.getByText(mock_child)).toBeInTheDocument();
    });
});
