import React from 'react';
import { screen, render } from '@testing-library/react';
import ApiTokenTableRowHeader from '../api-token-table-row-header';

describe('ApiTokenTableRowHeader', () => {
    const mock_props: React.ComponentProps<typeof ApiTokenTableRowHeader> = {
        text: <>Api Token Table Row Header</>,
    };

    it('should render ApiTokenTableRowHeader', () => {
        render(<ApiTokenTableRowHeader {...mock_props} />);
        expect(screen.getByText('Api Token Table Row Header')).toBeInTheDocument();
    });
});
