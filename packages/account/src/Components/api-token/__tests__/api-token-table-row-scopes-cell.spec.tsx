import React from 'react';
import { screen, render } from '@testing-library/react';
import ApiTokenTableRowScopesCell from '../api-token-table-row-scopes-cell';

describe('ApiTokenTableRowScopeCell', () => {
    const mock_props: React.ComponentProps<typeof ApiTokenTableRowScopesCell> = {
        scopes: ['api scope 1', 'api scope 2'],
    };

    it('should render ApiTokenTableRowScopesCell', () => {
        render(<ApiTokenTableRowScopesCell {...mock_props} />);
        expect(screen.getByText('api scope 1')).toBeInTheDocument();
        expect(screen.getByText('api scope 2')).toBeInTheDocument();
    });
});
